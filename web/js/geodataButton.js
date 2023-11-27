let filename = 'stadtgebiet.geojson';
let modelFileName = 'Stadtgebiet Bielefeld';

measurePoints_options.modelFiles = [
    {
        url: '/Werre/data/geodata/' + filename,
        name: modelFileName,
        fillColor: '0x67ADDFFF', 
        outlineColor: 'blue', 
        outlineWidth: 2
    }
 ];

let onChangeFunc = function() {

    let checkboxes = document.querySelectorAll('.leaflet-control-layers-selector');
    let geojsonCheckbox;

    checkboxes.forEach(function(checkbox) {
        if (checkbox.nextSibling && checkbox.nextSibling.textContent.includes(modelFileName)) {
            geojsonCheckbox = checkbox;
        }
    });

    if (geojsonCheckbox) {

        geojsonCheckbox.checked = !geojsonCheckbox.checked;
        var event = new Event('click');
        geojsonCheckbox.dispatchEvent(event);
    }
    
    toggleImage();
};


var select_geodata_options = {onChange: onChangeFunc};


var geodataButton = [
    {
        id: 1,
        name: "Landbedeckung ausblenden"
    }
];










