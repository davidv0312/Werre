
/**
 * Adds the legend for the landcoverunits to the html page.
 */
setTimeout(function() {
    var legend = document.getElementById('legend');
    legend.src = 'images/legende_bodenbedeckung.png';
}, 2000); 

/**
 * Logic for displaying and undisplaying the legend for the landcoverunits.
 */
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("toggleLegend").addEventListener("change", function() {
        var packageElement = document.getElementById("legendBox");

        if (this.checked) {
            packageElement.style.display = "flex";
        } else {
            packageElement.style.display = "none";
        }
    });
});


/**
 * Logic for the checkboxes for flexible displaying and undisplaying a single type of landcoverunits.
 */
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("all").addEventListener("change", function() {
        var allChecked = this.checked;
        var checkboxes = document.getElementById("checkboxes").querySelectorAll("input[type=checkbox]");
    
        var allAlreadyChecked = true;
        for (var checkbox of checkboxes) {
            if (checkbox.id !== "all" && !checkbox.checked) {
                allAlreadyChecked = false;
                break;
            }
        }

        checkboxes.forEach(function(checkbox) {
            if (checkbox.id !== "all") {
                checkbox.checked = allAlreadyChecked ? false : allChecked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    });

    document.getElementById("0").addEventListener("change", handleCheckbox0);
    document.getElementById("1").addEventListener("change", handleCheckbox1);
    document.getElementById("1-1").addEventListener("change", handleCheckbox11);
    document.getElementById("1-2").addEventListener("change", handleCheckbox12);
    document.getElementById("2").addEventListener("change", handleCheckbox2);
    document.getElementById("2-2").addEventListener("change", handleCheckbox22);
    document.getElementById("2-2--1").addEventListener("change", handleCheckbox221);
    document.getElementById("3").addEventListener("change", handleCheckbox223);
    document.getElementById("3-1").addEventListener("change", handleCheckbox3);
    document.getElementById("3-1--1").addEventListener("change", handleCheckbox31);
    document.getElementById("3-1--3").addEventListener("change", handleCheckbox311);
    document.getElementById("3-1--3").addEventListener("change", handleCheckbox313);
    document.getElementById("3-2--1").addEventListener("change", handleCheckbox321);
    document.getElementById("3-2--2").addEventListener("change", handleCheckbox322);
    document.getElementById("4-2").addEventListener("change", handleCheckbox42);
    document.getElementById("4-2--1---1").addEventListener("change", handleCheckbox4211);
    document.getElementById("4-2--1---2").addEventListener("change", handleCheckbox4212);
    document.getElementById("4-2--2---7").addEventListener("change", handleCheckbox4227);
});

/**
 * Calls the related function of a checkbox id..
 * @param {string} checkboxId - The id of the checkbox to call.
 */
function triggerCheckboxFunction(checkboxId) {
    switch (checkboxId) {
        case "0":
            handleCheckbox0();
            break;
        case "1":
            handleCheckbox1();
            break;
        case "1-1":
            handleCheckbox11();
            break;
        case "1-2":
            handleCheckbox12();
            break;
        case "2":
            handleCheckbox2();
            break;
        case "2-2":
            handleCheckbox22();
            break;
        case "2-2--1":
            handleCheckbox221();
            break;
        case "2-2--3":
            handleCheckbox223();
            break;
        case "3":
            handleCheckbox3();
            break;
        case "3-1":
            handleCheckbox31();
            break;
        case "3-1--1":
            handleCheckbox311();
            break;
        case "3-1--3":
            handleCheckbox313();
            break;
        case "3-2--1":
            handleCheckbox321();
            break;
        case "3-2--2":
            handleCheckbox322();
            break;
        case "4-2":
            handleCheckbox42();
            break;
        case "4-2--1---1":
            handleCheckbox4211();
            break;
        case "4-2--1---2":
            handleCheckbox4212();
            break;
        case "4-2--2---7":
            handleCheckbox4227();
            break;
        default:
            break;
    }
}





