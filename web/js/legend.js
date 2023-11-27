function toggleImage() {
    var legend = document.getElementById('legend');
    if (legend.style.display === 'none') {
        legend.style.display = 'block';
    } else {
        legend.style.display = 'none';
    }
}

setTimeout(function() {
    var legend = document.getElementById('legend');
    legend.src = 'images/legende_bodenbedeckung.png';
}, 500); 

