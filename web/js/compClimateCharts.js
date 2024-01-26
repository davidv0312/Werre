
/*
 * Logic for toggling between single-linechart and compare-linechart.
 */
document.getElementById('chartSelector').addEventListener('change', function() {
    var selectedPart = this.value;
    document.getElementById('single').style.display = selectedPart === 'single' ? 'block' : 'none';
    document.getElementById('comp').style.display = selectedPart === 'comp' ? 'block' : 'none';
});

/*
 * Configuration-Object for the temperature-compare-linechart
 */
compClimateChartsTemp_options = {
    showWhenNoData: true,
    xAxisAtrrName: 'time',
    yAxisAttrNames: ['Temperatur'],
    plugins: new Map()
};
     
/*
 * Declaration of the temperature-compare-chart as a linechart.
 */
compClimateChartsTemp_options.plugins.set('Linechart', {
    id: 'Linechart',
    active: true
});

/*
 * Configuration-Object for the rain-compare-linechart
 */
compClimateChartsRain_options = {
    showWhenNoData: true,
    xAxisAtrrName: 'time',
    yAxisAttrNames: ['Regenmenge'],
    plugins: new Map()
};

/*
 * Declaration of the rain-compare-chart as a linechart.
 */
compClimateChartsRain_options.plugins.set('Linechart', {
    id: 'Linechart',
    active: true
});

/**
 * Adds temperature data from a location to a temperature comparison chart. 
 * It fetches the temperature data based on coordinates and date range
 * and processes this data to be displayed in the comparison chart.
 * 
 * @param {Object} data - The data object for the location.
 * @param {string} name - The name to be used as a label for the dataset in the chart.
 */
function addToCompChartTemp(data, name) {
    let chart = document.querySelector('#compClimateChartsTemp');
    
    var startDate = document.getElementById('compStartDate').value;
    var endDate = document.getElementById('compEndDate').value;
    var interval = document.getElementById('compInterval').value;
    
    var lng1 = data.longitude;
    var lat1 = data.latitude;
 

    /**
     * Adds datasets for two temperature series to the comparison chart.
     *
     * @param {Array} time - An array of time points, representing the time axis for the chart.
     * @param {Array} temp - An array of temperature values for the location. 
     *                       
     */
    function processDataset(time, temp) {              
        for(let i = 0; i < time.length; i++){
            let set = {
                time: time[i],
                'Temperatur': temp[i]
            };
            chart.swac_comp.addSet(name, set); 
        }
        console.log('Datasets added for ' + name);
    }
    
 
    if(interval === 'hourly') {
        Promise.all([
            fetchOpenMeteoTimeseriesHourly(lat1, lng1, startDate, endDate, interval).then(data => data[interval])
        ])
        .then(([dat1]) => {
            processDataset(dat1['time'], dat1['temperature_2m']);
        });
    } else {          
        Promise.all([
            fetchOpenMeteoTimeseriesDaily(lat1, lng1, startDate, endDate, interval).then(data => data[interval])
        ])
        .then(([dat1]) => {
            processDataset(dat1['time'], dat1['temperature_2m_max']);
        });
    }
}

/**
 * Adds rain data from a location to a rain comparison chart. 
 * It fetches the temperature data based on coordinates and date range
 * and processes this data to be displayed in the comparison chart.
 * 
 * @param {Object} data - The data object for the location.
 * @param {string} name - The name to be used as a label for the dataset in the chart.
 */
function addToCompChartRain(data, name) {
    let chart = document.querySelector('#compClimateChartsRain');
    
    var startDate = document.getElementById('compStartDate').value;
    var endDate = document.getElementById('compEndDate').value;
    var interval = document.getElementById('compInterval').value;
    
    var lng1 = data.longitude;
    var lat1 = data.latitude;


    /**
     * Adds datasets for two rain series to the comparison chart.
     *
     * @param {Array} time - An array of time points, representing the time axis for the chart.
     * @param {Array} rain - An array of rain values for the location. 
     */
    function processDataset(time, rain) {        
;       
        for(let i = 0; i < time.length; i++){
            let set = {
                time: time[i],
                'Regenmenge': rain[i]
            };
            chart.swac_comp.addSet(name, set); 
        }
        console.log('Datasets added for ' + name);
    }
    
 
    if(interval === 'hourly') {
        Promise.all([
            fetchOpenMeteoTimeseriesHourly(lat1, lng1, startDate, endDate, interval).then(data => data[interval])
        ])
        .then(([dat1]) => {
            processDataset(dat1['time'], dat1['rain']);
        });
    } else {          
        Promise.all([
            fetchOpenMeteoTimeseriesDaily(lat1, lng1, startDate, endDate, interval).then(data => data[interval])
        ])
        .then(([dat1]) => {
            processDataset(dat1['time'], dat1['rain_sum']);
        });
    }
}

/*
 * Calls the functions for drawing data on the compare-linecharts upon pressing the related button.
 */
document.getElementById("compBtn").onclick = function() {
    var option1 = document.getElementById("compDropdown1").value;
    var option2 = document.getElementById("compDropdown2").value;
    
    Promise.all([
        fetch('data/openMeteoData/' + option1 + '.json').then(response => response.json()),
        fetch('data/openMeteoData/' + option2 + '.json').then(response => response.json())
    ])
    .then(([data1, data2]) => {   
        document.querySelector('#compClimateChartsTemp').swac_comp.removeAllData();
        document.querySelector('#compClimateChartsRain').swac_comp.removeAllData();
        addToCompChartTemp(data1, "Messpunkt 1");
        addToCompChartRain(data1, "Messpunkt 1"); 
        if (option1 !== option2) {
            addToCompChartTemp(data2, "Messpunkt 2");  
            addToCompChartRain(data2, "Messpunkt 2"); 
        }
    })
    .catch(error => console.error('Fehler beim Laden der Dateien:', error));
};





