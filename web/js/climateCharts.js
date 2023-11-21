document.addEventListener('DOMContentLoaded', async function() { 
    setTimeout(async function() { 
        let map = document.querySelector('#measurePoints');
        
        // Register event handler
        document.addEventListener('swac_measurePoints_marker_click', function (e) {
            let lat = e.detail.latlng.lat;
            let lng = e.detail.latlng.lng;
            //TODO replace hardcoded values
            let startDate = "2023-11-05";
            let endDate = "2023-11-19";
            let interval = "hourly";
            
            let data = fetchOpenMeteoTimeseries(lat, lng, startDate, endDate, interval);
            
            
            console.log(data);
        });
   
        
        
    },1000);
});