let set = null;

document.addEventListener('DOMContentLoaded', async function() { 
    setTimeout(async function() { 
        let chart = document.querySelector('#climateCharts');
        
        // Register event handler
        document.addEventListener('swac_measurePoints_marker_click', function (e) {
            let lat = e.detail.latlng.lat;
            let lng = e.detail.latlng.lng;
            
            let startDate = document.getElementById('startDate').value;
            let endDate = document.getElementById('endDate').value;
            let interval = document.getElementById('interval').value;
            
            if(interval === 'hourly') {
                fetchOpenMeteoTimeseriesHourly(lat, lng, startDate, endDate, interval).then((data) => {
                    let time = data[interval]['time'];
                    let temp = data[interval]['temperature_2m'];
                    let rain = data[interval]['rain'];                

                    // Remove former Dataset
                    if(set !== null) {
                        chart.swac_comp.removeAllData();
                    }
                
                    for(let i=0;i<=time.length;i++){
                        set = {time: time[i], temp: temp[i], rain:rain[i]};
                        chart.swac_comp.addSet('Verlauf',set);
                        console.log(set);
                    }
                    console.log('Done!'); 
                });                
            } else {          
                fetchOpenMeteoTimeseriesDaily(lat, lng, startDate, endDate, interval).then((data) => {
                    let time = data[interval]['time'];
                    let temp = data[interval]['temperature_2m_max'];
                    let rain = data[interval]['rain_sum'];                

                    // Remove former Dataset
                    if(set !== null) {
                        chart.swac_comp.removeAllData();
                    }
                
                    for(let i=0;i<=time.length;i++){
                        set = {time: time[i], temp: temp[i], rain:rain[i]};
                        chart.swac_comp.addSet('Verlauf',set);
                        console.log(set);
                    }
                    console.log('Done!');     
                });
            }
        });
        
    },1000);
});

climateCharts_options = {
    showWhenNoData: true,
    xAxisAtrrName: 'time',
    yAxis2AttrName: 'temp',
    plugins: new Map()
};
            
climateCharts_options.plugins.set('Linechart', {
    id: 'Linechart',
    active: true
});


// Update der y-Achse, funktioniert noch nicht
document.addEventListener('DOMContentLoaded', async function() { 
    setTimeout(async function() { 
        let chart = document.querySelector('#climateCharts');
        document.getElementById('dataSelection').addEventListener('change', function() {
            //climateCharts_options.yAxis2AttrName = document.getElementById('dataSelection').value;  
            //chart.swac_comp.reload();
        });         
    },1000);
});


              