
/*
 * Codes for the Landcover Values of the INSPIRE-WFS NW Bodenbedeckungsvektor ALKIS
 */
var landCoverValues = [
    "0",
    "1",
    "1-1",
    "1-2",
    "2",
    "2-2",
    "2-2--1",
    "2-2--3",
    "3",
    "3-1",
    "3-1--1",
    "3-1--3",
    "3-2--1",
    "3-2--2",
    "4-2",
    "4-2--1---1",
    "4-2--1---2",
    "4-2--2---7"
];

/*
 * Colors for coloring the polygons of the landcoverunits
 */
var colors = [
    "#222B35",
    "#FF6699",
    "#7A30A0",
    "#FF00FF",
    "#FFFF00",
    "#FFE699",
    "#DBDBDB",
    "#FFFF99",
    "#92D050",
    "#00B050",
    "#C6E0B4",
    "#548235",
    "#BF8F00",
    "#806000",
    "#8EA9DB",
    "#203764",
    "#305496",
    "#8497B0"    
];

/*
 * Cities for which geojson files are available. If a folder for a city is added under /Werre/data/geodata/ , the folder name needs to be added here as well.
 */
var cities = [
    "Bad_Oeynhausen"  
];

/*
 * Boolean variables for saving the states of the checkboxes for showing and hiding the landcoverunits
 */
let loaded0 = false;
let loaded1 = false;
let loaded11 = false;
let loaded12 = false;
let loaded2 = false;
let loaded22 = false;
let loaded221 = false;
let loaded223 = false;
let loaded3 = false;
let loaded31 = false;
let loaded311 = false;
let loaded313 = false;
let loaded321 = false;
let loaded322 = false;
let loaded42 = false;
let loaded4211 = false;
let loaded4212 = false;
let loaded4227 = false;    

/*
 * Draws geojson-files based on a city, landcoverunitvalue and color on the map.
 * 
 * @ {string} city - The name of the city (name of the folder in /Werre/data/geodata/ ) for which the geojson-files shall be loaded.
 * @ {string} value - The landcoverunitvalue to load
 * @ {string} color - The color in which the landcoverunit will be drawn.
 */
function loadGeojson(city, value, color) {
    let modelFile = {
        url: '/Werre/data/geodata/' + city + '/output_'+ value + '.geojson',
        name: value,
        fillColor: color,
        outlineWidth: 0.3           
    };  
    console.log('Trying to load output_' + value + '.geojson');
    document.querySelector('#measurePoints').swac_comp.loadModelFile(modelFile);
}

/*
 * Removes the geojson-files that belong to a landcoverunitvalue from the map.
 * 
 * @ {string} value - The landcoverunitvalue to remove from the map.
 */
function removeGeojson(value) {
    console.log('Trying to remove output_' + value + '.geojson');
    document.querySelector('#measurePoints').swac_comp.removeModelFile(value);
}


/*
 * Functions for calling the correct functions when changing the checkboxes.
 */

function handleCheckbox0() {
    if (loaded0) {
        removeGeojson('0');
        loaded0 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '0', colors[0]);
        }
        loaded0 = true;
    }
}

function handleCheckbox1() {
    if (loaded1) {
        removeGeojson('1');
        loaded1 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '1', colors[1]);
        }
        loaded1 = true;
    }
}
    
function handleCheckbox11() {
    if (loaded11) {
        removeGeojson('1-1');
        loaded11 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '1-1', colors[2]);
        }
        loaded11 = true;
    }
}
    
function handleCheckbox12() {
    if (loaded12) {
        removeGeojson('1-2');
        loaded12 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '1-2', colors[3]);
        }
        loaded12 = true;
    }
}
    
function handleCheckbox2() {
    if (loaded2) {
        removeGeojson('2');
        loaded2 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '2', colors[4]);
        }
        loaded2 = true;
    }
}
    
function handleCheckbox22() {
    if (loaded22) {
        removeGeojson('2-2');
        loaded22 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '2-2', colors[5]);
        }
        loaded22 = true;
    }
}
    
function handleCheckbox221() {
    if (loaded221) {
        removeGeojson('2-2--1');
        loaded221 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '2-2--1', colors[6]);
        }
        loaded221 = true;
    }
}
    
function handleCheckbox223() {
    if (loaded223) {
        removeGeojson('2-2--3');
        loaded223 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '2-2--3', colors[7]);
        }
        loaded223 = true;
    }
}
    
function handleCheckbox3() {
    if (loaded3) {
        removeGeojson('3');
        loaded3 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '3', colors[8]);
        }
        loaded3 = true;
    }
}
    
function handleCheckbox31() {
    if (loaded31) {
        removeGeojson('3-1');
        loaded31 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '3-1', colors[9]);
        }
        loaded31 = true;
    }
}
    
function handleCheckbox311() {
    if (loaded311) {
        removeGeojson('3-1--1');
        loaded311 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '3-1--1', colors[10]);
        }
        loaded311 = true;
    }
}
    
function handleCheckbox313() {
    if (loaded313) {
        removeGeojson('3-1--3');
        loaded313 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '3-1--3', colors[11]);
        }
        loaded313 = true;
    }
}
    
function handleCheckbox321() {
    if (loaded321) {
        removeGeojson('3-2--1');
        loaded321 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '3-2--1', colors[12]);
        }
        loaded321 = true;
    }
}
    
function handleCheckbox322() {
    if (loaded322) {
        removeGeojson('3-2--2');
        loaded322 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '3-2--2', colors[13]);
        }
        loaded322 = true;
    }
}
    
function handleCheckbox42() {
    if (loaded42) {
        removeGeojson('4-2');
        loaded42 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '4-2', colors[14]);
        }
        loaded42 = true;
    }
}
    
function handleCheckbox4211() {
    if (loaded4211) {
        removeGeojson('4-2--1---1');
            loaded4211 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '4-2--1---1', colors[15]);
        }
        loaded4211 = true;
    }
}
    
function handleCheckbox4212() {
    if (loaded4212) {
        removeGeojson('4-2--1---2');
        loaded4212 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '4-2--1---2', colors[16]);
        }
        loaded4212 = true;
    }
}
    
function handleCheckbox4227() {
    if (loaded4227) {
        removeGeojson('4-2--2---7');
        loaded4227 = false;
    } else {
        for (let i = 0 ; i < cities.length ; i++) {
            loadGeojson(cities[i], '4-2--2---7', colors[17]);
        }
        loaded4227 = true;
    }
} 



