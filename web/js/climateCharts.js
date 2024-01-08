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

document.addEventListener('DOMContentLoaded', async function() {
    setTimeout(async function() {
        let chart = document.querySelector('#climateCharts');   

        async function processDataToChart(lat, lng, startDate, endDate, interval) {

            if(interval === 'hourly') {
                fetchOpenMeteoTimeseriesHourly(lat, lng, startDate, endDate, interval).then((data) => {
                    let time = data[interval]['time'];
                    let temp = data[interval]['temperature_2m'];
                    let rain = data[interval]['rain'];

                    chart.swac_comp.removeAllData();   // Gibt hier noch Probleme. x achse wird nicht vollständig entfernt.

                    for(let i=0;i<=time.length;i++){
                        let set = {time: time[i], temp: temp[i], rain:rain[i]};
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

                    chart.swac_comp.removeAllData(); 

                    for(let i=0;i<=time.length;i++){
                        let set = {time: time[i], temp: temp[i], rain:rain[i]};
                        chart.swac_comp.addSet('Verlauf',set);
                        console.log(set);
                    }
                    console.log('Done!');
                });
            }
        }

        // Sollte wirklich ein Diagramm bei jedem klicken auf einen Messpunkt geladen werden???
        // 
        //document.addEventListener('swac_measurePoints_marker_click', function (e) {
        //    let lat = e.detail.latlng.lat;
        //    let lng = e.detail.latlng.lng;

        //    let startDate = document.getElementById('startDate').value;
        //    let endDate = document.getElementById('endDate').value;
        //    let interval = document.getElementById('interval').value;

        //    processDataToChart(lat, lng, startDate, endDate, interval);
        //});

        document.getElementById('ChartSubmitBtn').addEventListener('click', async function() {
            let data = await getChartMeasurePoint();
            let lat = data.latitude;
            let lng = data.longitude;

            let startDate = document.getElementById('startDate').value;
            let endDate = document.getElementById('endDate').value;
            let interval = document.getElementById('interval').value;

            processDataToChart(lat, lng, startDate, endDate, interval);
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


              