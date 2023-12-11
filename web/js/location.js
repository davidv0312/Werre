measurePoints_options = {
    ...measurePoints_options,
    userIcon: {
        iconUrl: 'SWAC/swac/libs/leaflet/images/marker_person.png',
        iconSize: [25, 50],
        iconAnchor: [12, 50],
        shadowSize: [60, 60],
        shadowAnchor: [20, 60],
        shadowUrl: 'SWAC/swac/libs/leaflet/images/marker-shadow.png'
    }
};

    
function enterValuesLocation(x1, y1, x2, y2, x3, y3, weather1, weather2, weather3, x, y) {
       
    document.getElementById('longOutputLocation').innerHTML = x.toFixed(4);
    document.getElementById('latOutputLocation').innerHTML = y.toFixed(4);
    let interpolatedValue = interpolateWeather(x1, y1, x2, y2, x3, y3, weather1.temp, weather2.temp, weather3.temp, x, y); 
    document.getElementById('tempOutputLocation').innerHTML = interpolatedValue.toFixed(1);
    interpolatedValue = interpolateWeather(x1, y1, x2, y2, x3, y3, weather1.soil_temperature_0cm, weather2.soil_temperature_0cm, weather3.soil_temperature_0cm, x, y); 
    document.getElementById('soilTemp0cmOutputLocation').innerHTML = interpolatedValue.toFixed(1);
    interpolatedValue = interpolateWeather(x1, y1, x2, y2, x3, y3, weather1.soil_temperature_6cm, weather2.soil_temperature_6cm, weather3.soil_temperature_6cm, x, y); 
    document.getElementById('soilTemp6cmOutputLocation').innerHTML = interpolatedValue.toFixed(1);
    interpolatedValue = interpolateWeather(x1, y1, x2, y2, x3, y3, weather1.soil_temperature_18cm, weather2.soil_temperature_18cm, weather3.soil_temperature_18cm, x, y); 
    document.getElementById('soilTemp18cmOutputLocation').innerHTML = interpolatedValue.toFixed(1);
    interpolatedValue = interpolateWeather(x1, y1, x2, y2, x3, y3, weather1.soil_temperature_54cm, weather2.soil_temperature_54cm, weather3.soil_temperature_54cm, x, y); 
    document.getElementById('soilTemp54cmOutputLocation').innerHTML = interpolatedValue.toFixed(1);
}

function enterNoValuesFoundLocation() {    
    document.getElementById('longOutputLocation').innerHTML = '-';
    document.getElementById('latOutputLocation').innerHTML = '-';
    document.getElementById('tempOutputLocation').innerHTML = '-';
    document.getElementById('soilTemp0cmOutputLocation').innerHTML = '-';
    document.getElementById('soilTemp6cmOutputLocation').innerHTML = '-';
    document.getElementById('soilTemp18cmOutputLocation').innerHTML = '-';
    document.getElementById('soilTemp54cmOutputLocation').innerHTML = '-';
}

async function findPolygonLocation(x, y) {
    const polygons = await loadPolygons();
    let found = false;
    let coordinates;

    for (const featureCollection of polygons) {
        if (findPolygonWithCoordinates(featureCollection, x, y)) {
            console.log('Gefundenes Polygon: an eigenen Koordinaten', featureCollection);

            coordinates = featureCollection.features[0].geometry.coordinates[0];
            console.log('Eckpunktkoordinaten des gefundenen Polygons an eigenen Koordinaten:', coordinates);

            found = true;
            break;
        }
    }

    if (!found) {
        console.log('Kein Polygon an den eigenen Koordinaten gefunden');
        enterNoValuesFoundLocation();
    } else {
        const x1 = coordinates[0][0]; 
        const y1 = coordinates[0][1]; 
        const x2 = coordinates[1][0]; 
        const y2 = coordinates[1][1]; 
        const x3 = coordinates[2][0]; 
        const y3 = coordinates[2][1];

        const weather1 = await findMatchingMeasurePointWeatherData(x1, y1);
        const weather2 = await findMatchingMeasurePointWeatherData(x2, y2);
        const weather3 = await findMatchingMeasurePointWeatherData(x3, y3);
        
        enterValuesLocation(x1, y1, x2, y2, x3, y3, weather1, weather2, weather3, x, y);
    }
}

if ("geolocation" in navigator) {

  navigator.geolocation.getCurrentPosition(function(position) {
    console.log("Own Latitude: " + position.coords.latitude);
    console.log("Own Longitude: " + position.coords.longitude);
    
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
        
    findPolygonLocation(longitude, latitude);
    
    
  }, function(error) {
    console.error("Error Code = " + error.code + " - " + error.message);
  });
} else {
  console.log("Geolocation wird von diesem Browser nicht unterstützt.");
}



