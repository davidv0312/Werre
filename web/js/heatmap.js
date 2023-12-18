let polygonNumber = 21;

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

    return getColorForTemperature((weather1.temp+weather2.temp+weather3.temp)/3);
    
}

async function loadPolygon(i) {
    let polygon;
    const path = 'data/polygons/polygon';
    
    try {
        const response = await fetch(`${path}${i}.geojson`);
        if (!response.ok) {
            throw new Error(`Fehler beim Laden von ${path}${i}.geojson: ${response.status}`);
        }
        const data = await response.json();
        polygon = data;
    } catch (error) {
        console.error('Fehler beim Laden eines Polygons in der Heatmap:', error);
    }  

    return polygon;
}

async function addHeatmap() {    
    for (let i = 0; i < polygonNumber; i++) {
        
        let color;  

        color = '#' + await getPolygonColor(i);
        console.log('Heatmap Polygon ' + i + 'farbe: ' + color);
        let modelFile = {
            url: '/Werre/data/polygons/polygon'+ i.toString()+ '.geojson',
            name: 'polygon_' + i.toString(),
            fillColor: color,
            outlineWidth: 2            
        };  
        document.querySelector('#measurePoints').swac_comp.loadModelFile(modelFile);
    }
}

function removeHeatmap() {
    for (let i = 0 ; i < polygonNumber ; i++) {
        document.querySelector('#measurePoints').swac_comp.removeModelFile('/Werre/data/polygons/polygon'+ i.toString()+ '.geojson');
    }
}

setTimeout(async function () {
    addHeatmap();
}, 3000 );

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("showHeatmap").addEventListener("change", function() {
        if (this.checked) {
            addHeatmap();
        } else {
            removeHeatmap();
        }
    });
});







