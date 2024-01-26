
/*
 * Configuration-Object for the temperature-single-linechart
 */
climateChartsTemp_options = {
    showWhenNoData: true,
    xAxisAtrrName: 'time',
    yAxis2AttrName: 'Temperatur (°C)',
    plugins: new Map()
};
       
/*
 * Declaration of the temperature-single-chart as a linechart.
 */
climateChartsTemp_options.plugins.set('Linechart', {
    id: 'Linechart',
    active: true
});

/*
 * Configuration-Object for the rain-single-linechart
 */
climateChartsRain_options = {
    showWhenNoData: true,
    xAxisAtrrName: 'time',
    yAxis2AttrName: 'Regenmenge (mm)',
    plugins: new Map()
};
  
  
/*
 * Declaration of the rain-single-chart as a linechart.
 */
climateChartsRain_options.plugins.set('Linechart', {
    id: 'Linechart',
    active: true
});   


/*
 * Gets the selected Measure Point from the related dropdown-menu.
 * 
 * @returns {Promise<Object|null>} A promise that resolves to the data of the selected 
 * Measure Point as a JSON object. Returns null if the data cannot be loaded.
 */
async function getChartMeasurePoint() {
    var option = document.getElementById("chartDropdown").value;
    try {
        const response = await fetch('data/openMeteoData/' + option + '.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fehler beim Laden der Datei:', error);
        return null; 
    }
}


    
/*
 * Adds temperature data from the Measure Point of the related dropdown-menu to the Single-Linechart.
 * 
 * @param {number} lat - The latitude of the location for which temperature data is required.
 * @param {number} lng - The longitude of the location for which temperature data is required.
 * @param {string} startDate - The starting date of the time range for which data is required.
 * @param {string} endDate - The ending date of the time range for which data is required.
 * @param {string} interval - The time interval for the data ('hourly' or 'daily').
 */
function processDataToTempChart(lat, lng, startDate, endDate, interval) {
            
    let chart = document.querySelector('#climateChartsTemp');   
        
    if(interval === 'hourly') {
        fetchOpenMeteoTimeseriesHourly(lat, lng, startDate, endDate, interval).then((data) => {
            let time = data[interval]['time'];
            let temp = data[interval]['temperature_2m'];

            chart.swac_comp.removeAllData();

            for(let i=0;i<=time.length;i++){
                let set = {time: time[i], 'Temperatur (°C)': temp[i]};
                chart.swac_comp.addSet('Messpunkt',set);                        
                console.log(set);
            }
            console.log('Done!'); 
        });
    } else {
        fetchOpenMeteoTimeseriesDaily(lat, lng, startDate, endDate, interval).then((data) => {
            let time = data[interval]['time'];
            let temp = data[interval]['temperature_2m_max'];

            chart.swac_comp.removeAllData(); 

            for(let i=0;i<=time.length;i++){
                let set = {time: time[i], 'Temperatur (°C)': temp[i]};
                chart.swac_comp.addSet('Messpunkt',set);
                console.log(set);
            }
            console.log('Done!');
        });
    }
}
    
/*
 * Adds rain data from the Measure Point of the related dropdown-menu to the Single-Linechart.
 * 
 * @param {number} lat - The latitude of the location for which rain data is required.
 * @param {number} lng - The longitude of the location for which rain data is required.
 * @param {string} startDate - The starting date of the time range for which data is required.
 * @param {string} endDate - The ending date of the time range for which data is required.
 * @param {string} interval - The time interval for the data ('hourly' or 'daily').
 */
function processDataToRainChart(lat, lng, startDate, endDate, interval) {
            
    let chart = document.querySelector('#climateChartsRain');   
            
    if(interval === 'hourly') {
        fetchOpenMeteoTimeseriesHourly(lat, lng, startDate, endDate, interval).then((data) => {
            let time = data[interval]['time'];
            let rain = data[interval]['rain'];

            chart.swac_comp.removeAllData();

            for(let i=0;i<=time.length;i++){
                let set = {time: time[i], 'Regenmenge (mm)':rain[i]};
                chart.swac_comp.addSet('Messpunkt',set);                        
                console.log(set);
            }
            console.log('Done!'); 
        });
    } else {
        fetchOpenMeteoTimeseriesDaily(lat, lng, startDate, endDate, interval).then((data) => {
            let time = data[interval]['time'];
            let rain = data[interval]['rain_sum'];

            chart.swac_comp.removeAllData(); 

            for(let i=0;i<=time.length;i++){
                let set = {time: time[i], 'Regenmenge (mm)':rain[i]};
                chart.swac_comp.addSet('Messpunkt',set);
                console.log(set);
            }
            console.log('Done!');
        });
    }
}

/*
 * Calls the functions for drawing data on the single-linecharts upon pressing the related button.
 */
document.getElementById('ChartSubmitBtn').addEventListener('click', async function() {
    let data = await getChartMeasurePoint();
    let lat = data.latitude;
    let lng = data.longitude;

    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    let interval = document.getElementById('interval').value;

    processDataToTempChart(lat, lng, startDate, endDate, interval);
    processDataToRainChart(lat, lng, startDate, endDate, interval);
});

/**
 * Formats a Date object into a string in the format 'yyyy-mm-dd'.
 * This format is typically required for HTML date input fields and is useful for representing dates in a standardized form.
 * 
 * @param {Date} date - The Date object to be formatted.
 * @returns {string} - A string representing the formatted date in 'yyyy-mm-dd' format. If the input is invalid, an empty string is returned.
 */
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}


/**
 * Adds the correct dates to the date selections of all charts.
 */
document.addEventListener('DOMContentLoaded', function() {     
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    var dayBeforeYesterday = new Date(yesterday);
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);

    document.getElementById('compStartDate').value = formatDate(dayBeforeYesterday);
    document.getElementById('compEndDate').value = formatDate(yesterday);
    document.getElementById('startDate').value = formatDate(dayBeforeYesterday);
    document.getElementById('endDate').value = formatDate(yesterday);
});




      