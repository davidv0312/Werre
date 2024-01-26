

/**
 * Interpolates weather data using barycentric coordinates within a triangle formed by three points.
 * 
 * @param {number} x1 - X-coordinate of the first point.
 * @param {number} y1 - Y-coordinate of the first point.
 * @param {number} x2 - X-coordinate of the second point.
 * @param {number} y2 - Y-coordinate of the second point.
 * @param {number} x3 - X-coordinate of the third point.
 * @param {number} y3 - Y-coordinate of the third point.
 * @param {number} weather1 - Weather data at the first point.
 * @param {number} weather2 - Weather data at the second point.
 * @param {number} weather3 - Weather data at the third point.
 * @param {number} xt - Target X-coordinate for interpolation.
 * @param {number} yt - Target Y-coordinate for interpolation.
 * @returns {number} Interpolated weather value at the target coordinates.
 */
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

/**
 * Loads polygon from data/polygons/ .
 * 
 * @returns {Object[]} An array of polygon data objects.
 */
async function loadPolygons() {
    let checkbox = document.getElementById('showHeatmap');
    checkbox.disabled = true; // Checkbox deaktivieren
    let polygons = [];
    const path = 'data/polygons/polygon';
    let i = 0;

    while (true) {
        try {
            const response = await fetch(`${path}${i}.geojson`);
            if (!response.ok) {
                throw new Error(`Fehler beim Laden von ${path}${i}.geojson: ${response.status}`);
            }
            const data = await response.json();
            polygons.push(data);
            i++;
        } catch (error) {
            console.error('Fehler beim Laden eines Polygons:', error);
            break;  // Beendet die Schleife, wenn ein Fehler auftritt
        }
    }
    checkbox.disabled = false;
    return polygons;
}



/**
 * Determines if a point lies within the first polygon in a given feature collection.
 * 
 * @param {Object} featureCollection - A collection of features (polygons).
 * @param {number} x - X-coordinate of the point.
 * @param {number} y - Y-coordinate of the point.
 * @returns {boolean} True if the point is inside the polygon, false otherwise.
 */
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

/**
 * Loads measure point data from a given filename.
 * 
 * @param {string} filename - The filename to load data from.
 * @returns {Object|null} Measure point data object, or null in case of an error.
 */
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

function formatOpenMeteoData(openMeteoData, x, y) {
    if (!openMeteoData || !openMeteoData.hourly) {
        console.error('Ungültige OpenMeteo-Daten');
        return null;
    }

    let hourIndex = getCurrentHourIndex();
    let hourlyData = openMeteoData.hourly;
    let formattedData = {
        longitude: x,
        latitude: y,
        temp: hourlyData.temperature_2m[hourIndex],
        soil_temperature_0cm: hourlyData.soil_temperature_0cm[hourIndex],
        soil_temperature_6cm: hourlyData.soil_temperature_6cm[hourIndex],
        soil_temperature_18cm: hourlyData.soil_temperature_18cm[hourIndex],
        soil_temperature_54cm: hourlyData.soil_temperature_54cm[hourIndex]
    };

    return formattedData;
}

/**
 * Searches for and returns weather data for a measure point that matches given coordinates.
 * 
 * @param {number} x1 - X-coordinate to match.
 * @param {number} y1 - Y-coordinate to match.
 * @returns {Object|null} Weather data for the matching measure point, or null if not found.
 */
async function findMatchingMeasurePointWeatherData(x1, y1) {
    let configResponse = await fetch('data/openMeteoData/mpList.json');
    let config = await configResponse.json();
    let mpDateien = config.mpDateien;

    for (let filename of mpDateien) {
        const data = await loadMeasurePoint(filename);
        if (data && data.longitude === x1 && data.latitude === y1) {
            const openMeteoData = await processCoordinatesToOpenMeteoRequest(data.latitude, data.longitude);
            return formatOpenMeteoData(openMeteoData, x1, y1);
        }
    }

    console.log('Kein passender Messpunkt gefunden');
    return null; 
}


/**
 * Displays interpolated weather data and coordinates in the HTML document. 
 * This includes interpolating and displaying the weather data.
 * 
 * @param {number} x1 - X-coordinate of the first measure point.
 * @param {number} y1 - Y-coordinate of the first measure point.
 * @param {number} x2 - X-coordinate of the second measure point.
 * @param {number} y2 - Y-coordinate of the second measure point.
 * @param {number} x3 - X-coordinate of the third measure point.
 * @param {number} y3 - Y-coordinate of the third measure point.
 * @param {Object} weather1 - Weather data of the first measure point.
 * @param {Object} weather2 - Weather data of the second measure point.
 * @param {Object} weather3 - Weather data of the third measure point.
 * @param {number} x - X-coordinate for interpolation.
 * @param {number} y - Y-coordinate for interpolation.
 */
function enterValues(x1, y1, x2, y2, x3, y3, weather1, weather2, weather3, x, y) {
       
    document.getElementById('timeOutput').innerHTML = lastDataUpdate;   
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

/**
 * Fills the HTML elements with placeholder values when no data is found.
 */
function enterNoValuesFound() {   
    document.getElementById('timeOutput').innerHTML = '-';   
    document.getElementById('longOutput').innerHTML = '-';
    document.getElementById('latOutput').innerHTML = '-';
    document.getElementById('tempOutput').innerHTML = '-';
    document.getElementById('soilTemp0cmOutput').innerHTML = '-';
    document.getElementById('soilTemp6cmOutput').innerHTML = '-';
    document.getElementById('soilTemp18cmOutput').innerHTML = '-';
    document.getElementById('soilTemp54cmOutput').innerHTML = '-';
}

/**
 * Identifies a polygon that contains a given point, and displays weather data based on the polygon's vertices.
 * 
 * @param {number} x - X-coordinate of the point to find the polygon for.
 * @param {number} y - Y-coordinate of the point to find the polygon for.
 */
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

/**
 * Registers event listeners for map clicks, handling coordinates retrieval and polygon finding for weather data display.
 */
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('swac_measurePoints_map_click', function (e) {
        let lat = e.detail.latlng.lat; 
        let lng = e.detail.latlng.lng; 

        console.log('Koordinaten des Kartenklicks:', lat, lng);
        findPolygon(lng, lat);
    });
    document.addEventListener('swac_measurePoints_marker_click', function (e) {
        let lat = e.detail.latlng.lat; 
        let lng = e.detail.latlng.lng; 

        console.log('Koordinaten des Kartenklicks:', lat, lng);
        findPolygon(lng, lat);
    });
});





