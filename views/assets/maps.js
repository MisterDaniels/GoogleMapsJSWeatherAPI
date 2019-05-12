var map;
var marker;

function initMap() {

    // Map Options
    var options = {
        zoom: 18,
        center: {lat:-26.992262, lng: -51.176341}
    }

    // Instantiate the map
    map = new google.maps.Map(document.getElementById('map'), options);

    // When a user click in the map
    map.addListener('click', function(e) {
        placeMarkerAndFocus(e.latLng, map);
    });

}

// Place a marker if the details and focus in
function placeMarkerAndFocus(coords, map) {

    // Check and remove the last marker
    checkAndRemoveMarker(marker);

    // Return the latitude and longitude separated from the google return
    var coordsSeparated = getLatAndLngSeparated(coords.toString());

    // Set the marker
    marker = new google.maps.Marker({
        position: coords,
        map: map,
        icon: "http://maps.google.com/mapfiles/dir_walk_60.png",
    });

    // Verify if the data returned is ellegible
    var htmlWithData = "<h4>Previsão para amanhã em: </h4>";
    var dataFromApi = getWeatherCPTEC(coordsSeparated[0], coordsSeparated[1]);
    if (dataFromApi.cityname === "null") {
        htmlWithData = "<h1>Não tem nenhuma informação sobre...</h1>";
    } else {
        htmlWithData += "<h1>" + dataFromApi.cityname + " | Máxima: " + dataFromApi.tomorrowDataMax + "ºC, Mínima: " + dataFromApi.tomorrowDataMin + "ºC" + "</h1>";
    }
    
    // Create a pop-up window with the info of the API
    var dataInfoWindow = new google.maps.InfoWindow({
        content: htmlWithData
    });

    // Add the click listner to the marker
    marker.addListener('click', function(){
        dataInfoWindow.open(map, marker);
    })

    // Focus to the marker
    map.panTo(coords);

}

// Remove the last marker to substitut the next
function checkAndRemoveMarker(marker) {

    if (marker != null) {
        marker.setMap(null);
    }

}

// Get the latitude and longitude separated to work with the API
function getLatAndLngSeparated(coords) {

    coords = coords.replace(/\(|\)|\s/g, "");
    var latAndLng = coords.split(",");

    return latAndLng;

}

// Get the API data
function getWeatherCPTEC(lat, lng) {

    var objects = {};

    var url = "http://servicos.cptec.inpe.br/XML/cidade/7dias/" + lat + "/" + lng + "/previsaoLatLon.xml";
    console.log(url);
    
    var xmlRequest = new XMLHttpRequest();
    xmlRequest.open('GET', url, false);
    xmlRequest.send();

    var xmlData = xmlRequest.responseXML;

    if (xmlData != null) {
        
        xmlData = (new DOMParser()).parseFromString(xmlRequest.responseText, 'text/xml');

        var city = xmlData.getElementsByTagName("cidade")[0];
        var cityName = city.getElementsByTagName("nome")[0];
        objects["cityname"] = cityName.firstChild.data;

        var tomorrowData = city.getElementsByTagName("previsao")[0];
        var tomorrowDataMax = tomorrowData.getElementsByTagName("maxima")[0];
        objects["tomorrowDataMax"] = tomorrowDataMax.firstChild.data;
        var tomorrowDataMin = tomorrowData.getElementsByTagName("minima")[0];
        objects["tomorrowDataMin"] = tomorrowDataMax.firstChild.data;

    }
    
    return objects;

}