/* 
 * Generates the current date in the format YYYY-MM-DD
 * 
 * @return the current date in the format YYYY-MM-DD
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


/*
 * Sends a request to the OpenMeteoWeatherForecastAPI with given coordinates and recieves weather-data
 * 
 * @param {number} latitude - Latitude for the weather-data-location
 * @param {number} longitude - Longitude for the weather-data-location
 * @returns {Promise<Object>} - A promise that returns an object with OpenMeteoWeatherForecast-data from a successful request.
 */
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

/*
 * Sends a request to the OpenMeteoWeatherHistoricalAPI with given coordinates and dates and recieves weather-data
 * 
 * @param {number} latitude - Latitude for the weather-data-location
 * @param {number} longitude - Longitude for the weather-data-location
 * @param {string} startDate - StartDate of the timeseries
 * @param {string} endDate - EndDate of the timeseries
 * @param {string} interval - Interval of the data (can be hourly,monthly etc.) 
 * @returns {Promise<Object>} - A promise that returns an object with OpenMeteoWeatherForecast-data from a successful request.
 */
async function fetchOpenMeteoTimeseries(latitude, longitude, startDate, endDate, interval){
    
    let url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&${interval}=temperature_2m,rain`;

    try{
        let response = await fetch(url);
        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
    let data = await response.json();
    console.log('Empfangene Daten:', data);
    return data;
    
    }catch(error){
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}



