/* 
 * This Javascript is supposed to fetch up-to-date-data from 
 * openMeteo from given Coordinates
 */

function getCurrentDateFormatted() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; 
    let day = currentDate.getDate();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return year + '-' + month + '-' + day;
}


async function processCoordinatesToOpenMeteoRequest(latitude, longitude) {

    let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm&timezone=Europe%2FBerlin&forecast_days=1`;
    
    console.log('OpenMeteo-URL:', url);
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        console.log('Empfangene Daten:', data);
        return data; 
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}



