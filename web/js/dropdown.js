
/**
 * Adds new options to the dropdown menus related to measure points. 
 *
 * @param {string} text - The display text for the dropdown option.
 * @param {string} value - The value to be associated with the dropdown option.
 */
function addToMPDropdown(text, value) {
    var select = document.getElementById("mpDropdown");
    var option = document.createElement("option");
    option.value = value;
    option.text = text;
    select.appendChild(option);
    
    select = document.getElementById("chartDropdown");
    option = document.createElement("option");
    option.value = value;
    option.text = text;
    select.appendChild(option);
    
    var select1 = document.getElementById("compDropdown1");
    var option1 = document.createElement("option");
    option1.value = value;
    option1.text = text;
    select1.appendChild(option1);

    var select2 = document.getElementById("compDropdown2");
    var option2 = document.createElement("option");
    option2.value = value;
    option2.text = text;
    select2.appendChild(option2);
}


/**
 * Loads measure point data from JSON files and adds them as options to dropdown menus.
 */
function addMeasurePointsToDropdown() {
    fetch('data/openMeteoData/mpList.json')
        .then(response => response.json())
        .then(config => {
            let mpDateien = config.mpDateien;
            mpDateien.forEach(filename => {
                fetch('data/openMeteoData/' + filename)
                    .then(response => response.json())
                    .then(data => {
                        let name = data.name;
                        let setId = filename.replace('mp', '').replace('.json', '');
                        addToMPDropdown("Messpunkt " + setId + ": " + name, "mp" + setId);
                    })
                    .catch(error => console.error('Fehler beim Laden der Datei:', error));
            });
        })
        .catch(error => console.error('Fehler beim Laden der Konfigurationsdatei:', error));
}


/**
 * Call addMeasurePointsToDropdown() upon starting the application.
 */
document.addEventListener('DOMContentLoaded', async function() { 
    addMeasurePointsToDropdown();
});

function displayWeatherData(weatherData) {
    let hourIndex = getCurrentHourIndex();
    let hourlyData = weatherData.hourly;
    let time = lastDataUpdate;
    let temperature = hourlyData.temperature_2m[hourIndex];
    let soilTemp0cm = hourlyData.soil_temperature_0cm[hourIndex];
    let soilTemp6cm = hourlyData.soil_temperature_6cm[hourIndex];
    let soilTemp18cm = hourlyData.soil_temperature_18cm[hourIndex];
    let soilTemp54cm = hourlyData.soil_temperature_54cm[hourIndex];

    document.getElementById('timeOutput').innerHTML = time;
    document.getElementById('longOutput').innerHTML = weatherData.longitude;
    document.getElementById('latOutput').innerHTML = weatherData.latitude;
    document.getElementById('tempOutput').innerHTML = temperature;
    document.getElementById('soilTemp0cmOutput').innerHTML = soilTemp0cm;
    document.getElementById('soilTemp6cmOutput').innerHTML = soilTemp6cm;
    document.getElementById('soilTemp18cmOutput').innerHTML = soilTemp18cm;
    document.getElementById('soilTemp54cmOutput').innerHTML = soilTemp54cm;
}


/**
 * Fetches data for the selected measure point and displays various details in the HTML document.
 */
document.getElementById("submitBtn").onclick = function() {
    var option = document.getElementById("mpDropdown").value;    

    fetch('data/openMeteoData/' + option + '.json')
        .then(response => response.json())
        .then(data => {
            processCoordinatesToOpenMeteoRequest(data.latitude, data.longitude)
                .then(weatherData => {
                    displayWeatherData(weatherData);
                });
        })
        .catch(error => console.error('Fehler beim Laden der Datei:', error));
};



