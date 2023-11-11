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
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        let mapElement = document.querySelector('#measurePoints');   
        // n = Anzahl mp-Dateien in data/openMeteoData
        let n = 3;             
        for (let i = 1; i <= n; i++) {
            let filename = 'mp' + i + '.json';
            let filepath = 'ref://openMeteoData/' + filename;
            mapElement.swac_comp.addDataFromReference(filepath);

            sendCoordinatesToAPI(filepath.replace('ref://', 'data/'));
        }       
    }, 1000); 
});


function sendCoordinatesToAPI(filepath) {
    fetch(filepath)
        .then(response => response.json())
        .then(data => {
            let latitude = data.latitude;
            let longitude = data.longitude;
               
            processCoordinates(latitude, longitude);
        })
        .catch(error => {
            console.error('Fehler beim Laden der JSON-Datei:', error);
        });
}



