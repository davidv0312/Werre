document.addEventListener('DOMContentLoaded', async function() { 
    setTimeout(async function() { 
        let chart = document.querySelector('#climateCharts');
        
        // Register event handler
        document.addEventListener('swac_measurePoints_marker_click', function (e) {
            let lat = e.detail.latlng.lat;
            let lng = e.detail.latlng.lng;
            //TODO replace hardcoded values
            let startDate = "2023-11-05";
            let endDate = "2023-11-19";
            let interval = "hourly";
            
            fetchOpenMeteoTimeseries(lat, lng, startDate, endDate, interval).then((data) => {
                let time = data['hourly']['time'];
                let temp = data['hourly']['temperature_2m'];
                let rain = data['hourly']['rain'];
                
                for(let i=0;i<=time.length;i++){
                    set = {time: time[i], temp: temp[i], rain:rain[i]};
                    chart.swac_comp.addSet('Test',set);
                    console.log(set);
                }
                console.log('Done!');

            });
        });
        
    },1000);
});

climateCharts_options = {
    showWhenNoData: true,
    xAxisAtrrName: 'time',
    yAxis1AttrName: 'rain',
    yAxis2AttrName: 'temp',
    plugins: new Map()
};
            
climateCharts_options.plugins.set('Linechart', {
    id: 'Linechart',
    active: true
});
                 

var exampledata_list = [
    {
        time : "2023-11-05T01:00",
        temp : 8.3,
        rain: 10.2
    },
    {
        time : "2023-11-07T02:00",
        temp : 10.0,
        rain: 11.3
    }
];