/**
 * Maps a temperature value to its closest predefined color.
 * 
 * @param {number} temperature - The temperature to map.
 * @returns {string} A string representing the color in hexadecimal.
 */
function getColorForTemperature(temperature) {
    let closestTemp = null;
    let minDiff = Infinity;

    for (const tempKey in tempToColor) {
        const temp = parseInt(tempKey);
        const diff = Math.abs(temperature - temp);

        if (diff < minDiff) {
            minDiff = diff;
            closestTemp = temp;
        }
    }

    return tempToColor[closestTemp.toString()].toString(16);
}

/**
 * Retrieves the color for a polygon based on the average temperature at its vertices.
 * 
 * @param {number} index - The index of the polygon to color.
 * @returns {string} The color associated with the average temperature of the polygon.
 */
async function getPolygonColor(index) {
    let polygon = await loadPolygon(index);
    let coordinates = polygon.features[0].geometry.coordinates[0];
    const x1 = coordinates[0][0]; 
    const y1 = coordinates[0][1]; 
    const x2 = coordinates[1][0]; 
    const y2 = coordinates[1][1]; 
    const x3 = coordinates[2][0]; 
    const y3 = coordinates[2][1]; 
    const weather1 = await findMatchingMeasurePointWeatherData(x1, y1);
    const weather2 = await findMatchingMeasurePointWeatherData(x2, y2);
    const weather3 = await findMatchingMeasurePointWeatherData(x3, y3);      
    console.log('Heatmap Polygon ' + index + ' :' + weather1.temp + '|' + weather2.temp + '|' + weather3.temp);

    return getColorForTemperature((weather1.temp + weather2.temp + weather3.temp) / 3);
}

/**
 * Loads polygon data from a file.
 * 
 * @param {number} i - The index of the polygon to load.
 * @returns {Object|null} The loaded polygon data, or null if an error occurred.
 */
async function loadPolygon(i) {
    let polygon;
    const path = 'data/polygons/polygon';
    
    try {
        const response = await fetch(`${path}${i}.geojson`);
        if (!response.ok) {
            throw new Error(`Error loading ${path}${i}.geojson: ${response.status}`);
        }
        polygon = await response.json();
    } catch (error) {
        console.error('Error loading a polygon in the heatmap:', error);
    }  

    return polygon;
}

let polygonCount = 0; // Global counter for the number of polygons

/**
 * Adds a heatmap overlay to the map by coloring polygons based on associated weather data.
 */
async function addHeatmap() {    
    let checkbox = document.getElementById('showHeatmap');
    checkbox.disabled = true; // Disable the checkbox while processing

    polygonCount = 0;
    let i = 0;
    while (true) {
        try {
            let color = '#' + await getPolygonColor(i);
            console.log('Heatmap Polygon ' + i + ' Color: ' + color);
            let modelFile = {
                url: '/Werre/data/polygons/polygon' + i.toString() + '.geojson',
                name: 'polygon_' + i.toString(),
                fillColor: color,
                outlineWidth: 2,
                zoomTo: false
            };
            document.querySelector('#measurePoints').swac_comp.loadModelFile(modelFile);
            i++;
            polygonCount++;
        } catch (error) {
            console.log('No more polygons found, process ended at polygon: ' + i);
            break; // End the loop on error
        }
    }

    checkbox.disabled = false;  // Re-enable the checkbox after processing
}

/**
 * Removes the heatmap overlay from the map.
 */
function removeHeatmap() {
    for (let i = 0; i < polygonCount; i++) {
        document.querySelector('#measurePoints').swac_comp.removeModelFile('polygon_' + i.toString());
    }
    polygonCount = 0;  // Reset the polygon counter
}

// Event listeners for adding or removing the heatmap based on user interaction
document.addEventListener('swac_components_complete', async function() { 
    addHeatmap();
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("showHeatmap").addEventListener("change", function() {
        if (this.checked) {
            addHeatmap();
        } else {
            removeHeatmap();
        }
    });
});








