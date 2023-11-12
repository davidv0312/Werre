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
    let startDate = '2023-10-01';
    let currentDate = '2023-10-10';

    let url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${currentDate}&hourly=temperature_2m,relative_humidity_2m,soil_temperature_0_to_7cm,soil_temperature_7_to_28cm,soil_temperature_28_to_100cm&timezone=Europe%2FBerlin`;
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



