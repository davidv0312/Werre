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
 * Adds measure points from data/openMeteoData with up-to-date-data to the map
 */
document.addEventListener('DOMContentLoaded', async function() { 
    setTimeout(async function() { 
        let map = document.querySelector('#measurePoints');   
        let n = 15; // Anzahl mp-Dateien -> TODO            
        for (let i = 1; i <= n; i++) {
            let filename = 'mp' + i + '.json';
            let filepath = 'data/openMeteoData/' + filename;
            
            try {
                
                let currentData = await sendCoordinatesToAPI(filepath);
                
                if (currentData) {  
                    
                    sendJsonData(currentData, filename);
                    
                    map.swac_comp.addDataFromReference('ref://openMeteoData/' + filename); 
                    
                    console.log('x = ' + currentData.latitude + '| y = ' + currentData.longitude);
                }
            } catch (error) {
                console.error('Fehler:', error);
            }            
        }       
    }, 1000); 
});

/*
 * Sends json-data and the filename to write to to the sever endpoint /updateJson in the class OpenMeteoJsonUpdateServlet
 * 
 * @ {Object} - currentData the json data to send
 * @ {string} - the filename of the file to write to
 */
function sendJsonData(currentData, filename) {
    const dataToSend = {
        currentData: currentData,  
        filename: filename
    };

    fetch('/Werre/updateJson', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch((error) => console.error('Error:', error));
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



