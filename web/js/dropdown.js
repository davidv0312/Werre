
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

function addMeasurePointsToDropdown() {
    let n = 15; // TODO -> nicht hardcoden
    let name = '';
    for (let i = 1 ; i <= n ; i++) {
        fetch('data/openMeteoData/' + "mp" + i + '.json')
        .then(response => response.json())
        .then(data => {
            name = data.name;
            addToMPDropdown("Messpunkt " + i + ": " + name, "mp" + i);
        })
        .catch(error => console.error('Fehler beim Laden der Datei:', error));
        
    }
}

document.addEventListener('DOMContentLoaded', async function() { 
    addMeasurePointsToDropdown();
});


document.getElementById("submitBtn").onclick = function() {
    var option = document.getElementById("mpDropdown").value;
    
    // Weitere Aktionen, option ist jetzt der Name des ausgewählten Messpunkts als String. Was soll damit gemacht werden???
    
    // Einfach Werte eintragen
    fetch('data/openMeteoData/' + option + '.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('longOutput').innerHTML = data.longitude;
            document.getElementById('latOutput').innerHTML = data.latitude;
            document.getElementById('tempOutput').innerHTML = data.temp;
            document.getElementById('soilTemp0cmOutput').innerHTML = data.soil_temperature_0cm;
            document.getElementById('soilTemp6cmOutput').innerHTML = data.soil_temperature_6cm ;
            document.getElementById('soilTemp18cmOutput').innerHTML = data.soil_temperature_18cm;
            document.getElementById('soilTemp54cmOutput').innerHTML = data.soil_temperature_54cm;
    })
    .catch(error => console.error('Fehler beim Laden der Datei:', error));
};


