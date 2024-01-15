
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
    yAxisAttrNames: ['Temperatur 1','Temperatur 2'],
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
    yAxisAttrNames: ['Regenmenge 1','Regenmenge 2'],
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
 * Adds temperature data from two different locations to a temperature comparison chart. 
 * It fetches the temperature data based on coordinates and date range for 
 * both locations and processes this data to be displayed in the comparison chart.
 * 
 * @param {Object} data1 - The data object for the first location.
 * @param {Object} data2 - The data object for the second location.
 * @param {string} name - The name to be used as a label for the dataset in the chart.
 */
function addToCompChartTemp(data1, data2, name) {
    let chart = document.querySelector('#compClimateChartsTemp');
    
    var startDate = document.getElementById('compStartDate').value;
    var endDate = document.getElementById('compEndDate').value;
    var interval = document.getElementById('compInterval').value;
    
    var lng1 = data1.longitude;
    var lat1 = data1.latitude;
    var lng2 = data2.longitude;
    var lat2 = data2.latitude;   

    /**
     * Adds datasets for two temperature series to the comparison chart.
     *
     * @param {Array} time - An array of time points, representing the time axis for the chart.
     * @param {Array} temp1 - An array of temperature values from the first location, 
     *                        corresponding to each time point.
     * @param {Array} temp2 - An array of temperature values from the second location, 
     *                        corresponding to each time point.
     */
    function processDataset(time, temp1, temp2) {        
        chart.swac_comp.removeAllData();       
        for(let i = 0; i < time.length; i++){
            let set = {
                time: time[i],
                'Temperatur 1': temp1[i],
                'Temperatur 2': temp2[i]
            };
            chart.swac_comp.addSet(name, set); 
        }
        console.log('Datasets added for ' + name);
    }
    
 
    if(interval === 'hourly') {
        Promise.all([
            fetchOpenMeteoTimeseriesHourly(lat1, lng1, startDate, endDate, interval).then(data => data[interval]),
            fetchOpenMeteoTimeseriesHourly(lat2, lng2, startDate, endDate, interval).then(data => data[interval])
        ])
        .then(([dat1, dat2]) => {
            processDataset(dat1['time'], dat1['temperature_2m'], dat2['temperature_2m']);
        });
    } else {          
        Promise.all([
            fetchOpenMeteoTimeseriesDaily(lat1, lng1, startDate, endDate, interval).then(data => data[interval]),
            fetchOpenMeteoTimeseriesDaily(lat2, lng2, startDate, endDate, interval).then(data => data[interval])
        ])
        .then(([dat1, dat2]) => {
            processDataset(dat1['time'], dat1['temperature_2m_max'], dat2['temperature_2m_max']);
        });
    }
}

/**
 * Adds rain data from two different locations to a rain comparison chart. 
 * It fetches the rain data based on coordinates and date range for 
 * both locations and processes this data to be displayed in the comparison chart.
 * 
 * @param {Object} data1 - The data object for the first location.
 * @param {Object} data2 - The data object for the second location.
 * @param {string} name - The name to be used as a label for the dataset in the chart.
 */
function addToCompChartRain(data1, data2, name) {
    let chart = document.querySelector('#compClimateChartsRain');
    
    var startDate = document.getElementById('compStartDate').value;
    var endDate = document.getElementById('compEndDate').value;
    var interval = document.getElementById('compInterval').value;
    
    var lng1 = data1.longitude;
    var lat1 = data1.latitude;
    var lng2 = data2.longitude;
    var lat2 = data2.latitude;   

    /**
     * Adds datasets for two rain series to the comparison chart.
     *
     * @param {Array} time - An array of time points, representing the time axis for the chart.
     * @param {Array} rain1 - An array of rain values from the first location, 
     *                        corresponding to each time point.
     * @param {Array} rain2 - An array of rain values from the second location, 
     *                        corresponding to each time point.
     */
    function processDataset(time, rain1, rain2,) {        
        chart.swac_comp.removeAllData();       
        for(let i = 0; i < time.length; i++){
            let set = {
                time: time[i],
                'Regenmenge 1': rain1[i],
                'Regenmenge 2': rain2[i]
            };
            chart.swac_comp.addSet(name, set); 
        }
        console.log('Datasets added for ' + name);
    }
    
 
    if(interval === 'hourly') {
        Promise.all([
            fetchOpenMeteoTimeseriesHourly(lat1, lng1, startDate, endDate, interval).then(data => data[interval]),
            fetchOpenMeteoTimeseriesHourly(lat2, lng2, startDate, endDate, interval).then(data => data[interval])
        ])
        .then(([dat1, dat2]) => {
            processDataset(dat1['time'], dat1['rain'], dat2['rain']);
        });
    } else {          
        Promise.all([
            fetchOpenMeteoTimeseriesDaily(lat1, lng1, startDate, endDate, interval).then(data => data[interval]),
            fetchOpenMeteoTimeseriesDaily(lat2, lng2, startDate, endDate, interval).then(data => data[interval])
        ])
        .then(([dat1, dat2]) => {
            processDataset(dat1['time'], dat1['rain_sum'], dat2['rain_sum']);
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
        addToCompChartTemp(data1, data2, "Messpunkt");   
        addToCompChartRain(data1, data2, "Messpunkt");  
    })
    .catch(error => console.error('Fehler beim Laden der Dateien:', error));
};




