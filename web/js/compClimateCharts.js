document.getElementById('chartSelector').addEventListener('change', function() {
    var selectedPart = this.value;
    document.getElementById('single').style.display = selectedPart === 'single' ? 'block' : 'none';
    document.getElementById('comp').style.display = selectedPart === 'comp' ? 'block' : 'none';
});


compClimateCharts_options = {
    showWhenNoData: true,
    xAxisAtrrName: 'time',
    yAxisAttrNames: ['temp_mp1','temp_mp2'],
    plugins: new Map()
};
            
compClimateCharts_options.plugins.set('Linechart', {
    id: 'Linechart',
    active: true
});

function addToCompChart(data1, data2, name) {
    let chart = document.querySelector('#compClimateCharts');
    
    var startDate = document.getElementById('compStartDate').value;
    var endDate = document.getElementById('compEndDate').value;
    var interval = document.getElementById('compInterval').value;
    
    var lng1 = data1.longitude;
    var lat1 = data1.latitude;
    var lng2 = data2.longitude;
    var lat2 = data2.latitude;

    function processDataset(time, temp1, temp2, rain1, rain2,) {
        for(let i = 0; i < time.length; i++){
            let set = {
                id: name + "_" + i, 
                time: time[i],
                temp_mp1: temp1[i],
                temp_mp2: temp2[i],
                rain_mp1: rain1[i],
                rain_mp2: rain2[i]
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
            processDataset(dat1['time'], dat1['temperature_2m'], dat2['temperature_2m'], dat1['rain'], dat2['rain']);
        });
    } else {          
        Promise.all([
            fetchOpenMeteoTimeseriesDaily(lat1, lng1, startDate, endDate, interval).then(data => data[interval]),
            fetchOpenMeteoTimeseriesDaily(lat2, lng2, startDate, endDate, interval).then(data => data[interval])
        ])
        .then(([dat1, dat2]) => {
            processDataset(dat1['time'], dat1['temperature_2m_max'], dat2['temperature_2m_max'], dat1['rain_sum'], dat2['rain_sum']);
        });
    }
}

document.getElementById("compBtn").onclick = function() {
    var option1 = document.getElementById("compDropdown1").value;
    var option2 = document.getElementById("compDropdown2").value;
    
    Promise.all([
        fetch('data/openMeteoData/' + option1 + '.json').then(response => response.json()),
        fetch('data/openMeteoData/' + option2 + '.json').then(response => response.json())
    ])
    .then(([data1, data2]) => {
        
        addToCompChart(data1, data2, "Verlauf");                
    })
    .catch(error => console.error('Fehler beim Laden der Dateien:', error));
};




