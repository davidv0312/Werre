var measurePoints_options = {
    zoom: 18,
    plugins: new Map()
};

measurePoints_options.plugins.set('DataShowModal', {
    id: 'DataShowModal',
    active: true
});

window["DataShowModal_measurePoints_options"] = {
    attrsShown: ['latitude', 'longitude', 'name', 'description'],
    attrsFormat: new Map()
};


document.addEventListener('DOMContentLoaded', async function() { 
    setTimeout(async function() { 
        let map = document.querySelector('#measurePoints');   
        let n = 3; // Anzahl mp-Dateien             
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

function sendJsonData(currentData, filename) {
    const dataToSend = {
        currentData: currentData,  // Hier ist currentData selbst ein JSON-Objekt
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



