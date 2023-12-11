// Interpolation mittels baryzentrischer interpolation
function interpolateWeather(x1, y1, x2, y2, x3, y3, weather1, weather2, weather3, xt, yt) {  
    
    
    // Hilfsfunktion zur Berechnung der Fläche eines Dreiecks, mit Determinantenformel
    function triangleArea(x1, y1, x2, y2, x3, y3) {
        return Math.abs((x1*(y2-y3) + x2*(y3-y1) + x3*(y1-y2)) / 2.0);
    }


    // Gesamtfläche des Dreiecks
    const totalArea = triangleArea(x1, y1, x2, y2, x3, y3);

    // Flächen der Teil-Dreiecke
    const area1 = triangleArea(xt, yt, x2, y2, x3, y3);
    const area2 = triangleArea(x1, y1, xt, yt, x3, y3);
    const area3 = triangleArea(x1, y1, x2, y2, xt, yt);

    // Baryzentrische Koordinaten, Verhältnis zwischen Gesamtfläche und Teilflächen
    const w1 = area1 / totalArea;
    const w2 = area2 / totalArea;
    const w3 = area3 / totalArea;

    // Interpolierter Wetterwert, Baryzentrische Koordinaten werden als Gewichtung verwendet
    var interpolatedValue = w1 * weather1 + w2 * weather2 + w3 * weather3;    
    
    return interpolatedValue;
}


async function loadPolygons() {
    let polygons = [];
    const path = 'data/polygons/polygon';

    for (let i = 0; i <= 20; i++) {
        try {
            const response = await fetch(`${path}${i}.geojson`);
            if (!response.ok) {
                throw new Error(`Fehler beim Laden von ${path}${i}.geojson: ${response.status}`);
            }
            const data = await response.json();
            polygons.push(data);
        } catch (error) {
            console.error('Fehler beim Laden eines Polygons:', error);
        }
    }

    return polygons;
}



function findPolygonWithCoordinates(featureCollection, x, y) {

    if (featureCollection.features.length > 0) {

        const polygon = featureCollection.features[0];
        
        const point = turf.point([x, y]);
        
        return turf.booleanPointInPolygon(point, polygon);
    } else {
        console.error('Keine Features in der FeatureCollection');
        return false;
    }
}

async function loadMeasurePoint(filename) {
    try {
        const response = await fetch(`data/openMeteoData/${filename}`);
        if (!response.ok) {
            throw new Error(`Fehler beim Laden von ${filename}: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Fehler beim Laden einer Mp-Datei:', error);
        return null;
    }
}


async function findMatchingMeasurePointWeatherData(x1, y1) {
    for (let i = 1; i <= 15; i++) {
        const data = await loadMeasurePoint(`mp${i}.json`);
        if (data && data.longitude === x1 && data.latitude === y1) {
            return data;
        }
    }
    console.log('Kein passender Messpunkt gefunden');
    return null; 
}

function enterValues(x1, y1, x2, y2, x3, y3, weather1, weather2, weather3, x, y) {
       
    document.getElementById('longOutput').innerHTML = x.toFixed(4);
    document.getElementById('latOutput').innerHTML = y.toFixed(4);
    let interpolatedValue = interpolateWeather(x1, y1, x2, y2, x3, y3, weather1.temp, weather2.temp, weather3.temp, x, y); 
    document.getElementById('tempOutput').innerHTML = interpolatedValue.toFixed(1);
    interpolatedValue = interpolateWeather(x1, y1, x2, y2, x3, y3, weather1.soil_temperature_0cm, weather2.soil_temperature_0cm, weather3.soil_temperature_0cm, x, y); 
    document.getElementById('soilTemp0cmOutput').innerHTML = interpolatedValue.toFixed(1);
    interpolatedValue = interpolateWeather(x1, y1, x2, y2, x3, y3, weather1.soil_temperature_6cm, weather2.soil_temperature_6cm, weather3.soil_temperature_6cm, x, y); 
    document.getElementById('soilTemp6cmOutput').innerHTML = interpolatedValue.toFixed(1);
    interpolatedValue = interpolateWeather(x1, y1, x2, y2, x3, y3, weather1.soil_temperature_18cm, weather2.soil_temperature_18cm, weather3.soil_temperature_18cm, x, y); 
    document.getElementById('soilTemp18cmOutput').innerHTML = interpolatedValue.toFixed(1);
    interpolatedValue = interpolateWeather(x1, y1, x2, y2, x3, y3, weather1.soil_temperature_54cm, weather2.soil_temperature_54cm, weather3.soil_temperature_54cm, x, y); 
    document.getElementById('soilTemp54cmOutput').innerHTML = interpolatedValue.toFixed(1);
}

function enterNoValuesFound() {    
    document.getElementById('longOutput').innerHTML = '-';
    document.getElementById('latOutput').innerHTML = '-';
    document.getElementById('tempOutput').innerHTML = '-';
    document.getElementById('soilTemp0cmOutput').innerHTML = '-';
    document.getElementById('soilTemp6cmOutput').innerHTML = '-';
    document.getElementById('soilTemp18cmOutput').innerHTML = '-';
    document.getElementById('soilTemp54cmOutput').innerHTML = '-';
}

async function findPolygon(x, y) {
    const polygons = await loadPolygons();
    let found = false;
    let coordinates;

    for (const featureCollection of polygons) {
        if (findPolygonWithCoordinates(featureCollection, x, y)) {
            console.log('Gefundenes Polygon:', featureCollection);

            coordinates = featureCollection.features[0].geometry.coordinates[0];
            console.log('Eckpunktkoordinaten des gefundenen Polygons:', coordinates);

            found = true;
            break;
        }
    }

    if (!found) {
        console.log('Kein Polygon an den Koordinaten gefunden');
        enterNoValuesFound();
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
        
        enterValues(x1, y1, x2, y2, x3, y3, weather1, weather2, weather3, x, y);
    }
}



document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('swac_measurePoints_map_click', function (e) {
        let lat = e.detail.latlng.lat; 
        let lng = e.detail.latlng.lng; 

        console.log('Koordinaten des Kartenklicks:', lat, lng);
        findPolygon(lng, lat);
    });
});





