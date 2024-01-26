/*
 * The time where the measure points got last updated
 */
var lastDataUpdate = null;

/*
 * Configuration-Object for the display of Measure-Points on the map
 */
var measurePoints_options = {
    zoom: 18,
    plugins: new Map()

};

/*
 * Adding of the DataShowModal plugin
 */
measurePoints_options.plugins.set('DataShowModal', {
    id: 'DataShowModal',
    active: true
});

/*
 * Configuration for the DataShowModal-Plugin
 */
window["DataShowModal_measurePoints_options"] = {
    attrsShown: ['latitude', 'longitude', 'time', 'temp', 'soil_temperature_0cm', 'soil_temperature_6cm', 'soil_temperature_18cm', 'soil_temperature_54cm'],
    attrsFormat: new Map()
};

/*
 * Updates the time where the measure points got last updated 
 */
function updateLastDataUpdate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; 
    const day = now.getDate();
    const hour = now.getHours(); 

    const formattedMonth = month < 10 ? '0' + month : month;
    const formattedDay = day < 10 ? '0' + day : day;
    lastDataUpdate = lastDataUpdate = formattedDay+ '-' + formattedMonth + '-' + year + ', ' + hour + ':00 Uhr';
}


/*
 * Adds measure points with up-to-date-data to the map
 */
async function updateMeasurePointData() {
    let map = document.querySelector('#measurePoints');

    let configResponse = await fetch('data/openMeteoData/mpList.json');
    let config = await configResponse.json();
    let mpDateien = config.mpDateien;

    for (let filename of mpDateien) {
        let filepath = 'data/openMeteoData/' + filename;
        try {
            let response = await fetch(filepath);
            let mpData = await response.json();

            let weatherData = await processCoordinatesToOpenMeteoRequest(mpData.latitude, mpData.longitude);
            let currentData = await sendCoordinatesToAPI(filepath);
            let currentHourIndex = getCurrentHourIndex();
            let setId = filename.replace('mp', '').replace('.json', '');
            let setName = mpData.name || `Messpunkt_${setId}`;
            let set = {
                id: setId,
                name: setName,
                latitude: mpData.latitude,
                longitude: mpData.longitude,
                time: weatherData.hourly.time[currentHourIndex],
                temp: weatherData.hourly.temperature_2m[currentHourIndex] + " °C",
                soil_temperature_0cm: weatherData.hourly.soil_temperature_0cm[currentHourIndex] + " °C",
                soil_temperature_6cm: weatherData.hourly.soil_temperature_6cm[currentHourIndex] + " °C",
                soil_temperature_18cm: weatherData.hourly.soil_temperature_18cm[currentHourIndex] + " °C",
                soil_temperature_54cm: weatherData.hourly.soil_temperature_54cm[currentHourIndex] + " °C"
            };
            await sendJsonData(currentData, filename);
            map.swac_comp.removeSets(setName, setId);
            map.swac_comp.addSet(setName, set);
            console.log('Set hinzugefügt:', set);

        } catch (error) {
            console.error('Fehler beim Laden oder Verarbeiten der Daten:', error);
        }            
    }   
    updateLastDataUpdate();
}



/*
 * Calls updateLastDataUpdate() at every full hour. Needs to be called once to start.
 */
function updateMeasurePointsSchedule() {
    const now = new Date();
    const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
    const delay = nextHour - now;

    const countdownInterval = setInterval(updateCountdown, 1000);

    function updateCountdown() {
        const currentTime = new Date();
        const timeLeft = nextHour - currentTime;

        if (timeLeft >= 0) {
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            document.getElementById("countdownTimer").innerText = 'Nächstes Update in: ' + minutes + ':' + seconds;
        } else {
            clearInterval(countdownInterval);
        }
    }

    setTimeout(() => {
        updateMeasurePointData();
        setInterval(updateMeasurePointData, 3600000);
        clearInterval(countdownInterval); 
        updateMeasurePointsSchedule(); 
    }, delay);

    updateCountdown(); 
}

/*
 * Calls updateMeasurePointData() and updateMeasurePointsSchedule() at the startup of the application.
 */
document.addEventListener('swac_components_complete', async function() { 
    updateMeasurePointData();
    updateMeasurePointsSchedule();
});


/*
 * Sends json-data and the filename to write to to the sever endpoint /getPolygons to create and write polygon files
 * 
 * @ {Object} - currentData the json data to send
 * @ {string} - the filename of the file to write to
 */
function sendJsonData(currentData, filename) {
    const dataToSend = {
        currentData: currentData,  
        filename: filename
    };
    
    fetch('/Werre/getPolygons', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)

        })
        .catch(error => {
            console.error('Fehler beim Senden der Anfrage:', error);
    });
}

/*
 * Sends the longitude and latitude data from a json-file from a filepath to the OpenMeteoAPI and returns the weather data
 * 
 * @ {string} filepath - The filepath to the json-file with the coordinates
 * @ {Promise<Object>} - A Promise with the openMeteo data from a successful request
 */
async function sendCoordinatesToAPI(filepath) {
    try {
        let response = await fetch(filepath);
        let data = await response.json();
        let latitude = data.latitude;
        let longitude = data.longitude;

        return await processCoordinatesToOpenMeteoRequest(latitude, longitude);
    } catch (error) {
        console.error('Fehler beim Laden der JSON-Datei:', error);
    }
}


