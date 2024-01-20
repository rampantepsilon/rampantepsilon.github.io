//Disconnect
function disconnect() {
    sessionStorage.removeItem('locCat');
    sessionStorage.removeItem('locNames');
    sessionStorage.removeItem('locIDs');
    sessionStorage.removeItem('uniqueLocCat');
    sessionStorage.removeItem('itemCat');
    sessionStorage.removeItem('itemNames');
    sessionStorage.removeItem('itemIDs');
    sessionStorage.removeItem('uniqueItemCat');
    sessionStorage.removeItem('itemType');
    sessionStorage.removeItem('background');

    window.location.href = './index.html'
}

//Background
if (sessionStorage.getItem('background')) {
    document.documentElement.style.backgroundImage = "url(" + sessionStorage.getItem('background') + ")";
    document.documentElement.style.backgroundRepeat = 'no-repeat';
    document.documentElement.style.backgroundSize = "auto 100vh";
}

//Arrays for items & locations
var locIDs = JSON.parse(sessionStorage.getItem('locIDs'));
var locNames = JSON.parse(sessionStorage.getItem('locNames'));
var locCat = JSON.parse(sessionStorage.getItem('locCat'));
var uniqueLocCat = JSON.parse(sessionStorage.getItem('uniqueLocCat'));
var itemIDs = JSON.parse(sessionStorage.getItem('itemIDs'));
var itemNames = JSON.parse(sessionStorage.getItem('itemNames'));
var itemCat = JSON.parse(sessionStorage.getItem('itemCat'));
var uniqueItemCat = JSON.parse(sessionStorage.getItem('uniqueItemCat')).sort();
var itemType = JSON.parse(sessionStorage.getItem('itemType'));
uniqueItemCat.push("No Category");
uniqueLocCat.push("No Category");

//Patch to make Game Based Filler show
for (i in itemCat) {
    if (itemCat[i] == null) {
        itemCat[i] = ["No Category"];
    }
}

//Patch to show __Manual Game Complete__
for (i in locCat) {
    if (locCat[i] == null) {
        locCat[i] = ["No Category"];
    }
}

//Tracking for Async resync
var checkedLocations = [];

//Layout Items
var items = document.getElementById('items');
items.innerHTML = '';

//Setup Categories
for (i in uniqueItemCat) {
    if (i == 0) {
        items.innerHTML += "<div align='center' class='items' id='" + uniqueItemCat[i] + `' style='font-weight: bold;' onclick='itemCatClose("` + i + `")'>` + uniqueItemCat[i] + " (<span id='" + uniqueItemCat[i] + "2'>0</span>)</div><br>"
    } else {
        items.innerHTML += "<br><div align='center' class='items' id='" + uniqueItemCat[i] + `' style='font-weight: bold;' onclick='itemCatClose("` + i + `")'>` + uniqueItemCat[i] + " (<span id='" + uniqueItemCat[i] + "2'>0</span>)</div><br>";
    }
    //Add Items
    for (j in itemNames) {
        for (k in itemCat[j]) {
            if (itemCat[j][k] == uniqueItemCat[i]) {
                styleSplit = uniqueItemCat[i].split(' ');
                var styleCombine = '';

                for (var l = 0; l < styleSplit.length; l++) {
                    styleCombine += styleSplit[l].replaceAll("[", '').replaceAll(']', '').replaceAll("'", "").replaceAll(" ", "");
                }

                items.innerHTML += "<span class='itemCard " + itemIDs[j] + "2 " + styleCombine + "' style='display:none'><div class='items itemsStyle' id='" + uniqueItemCat[i] + "' data-id='" + itemIDs[j] + "'>" + itemNames[j] + " (<span class='" + itemIDs[j] + "'>0</span>)</div></span>"
            } else if (itemCat[j] == null) {
                styleSplit = uniqueItemCat[i].split(' ');
                var styleCombine = '';

                for (var l = 0; l < styleSplit.length; l++) {
                    styleCombine += styleSplit[l].replaceAll("[", '').replaceAll(']', '').replaceAll("'", "").replaceAll(" ", "");
                }

                items.innerHTML += "<span class='itemCard " + itemIDs[j] + "2 " + styleCombine + "' style='display:none'><div class='items itemsStyle' id='" + uniqueItemCat[i] + "' data-id='" + itemIDs[j] + "'>" + itemNames[j] + " (<span class='" + itemIDs[j] + "'>0</span>)</div></span>"
            }
        }
    }
    itemCatClose(i);
}

//Close & Open Item Cateorgies by clicking
function itemCatClose(category) {
    // Locate the card elements
    let cards = document.querySelectorAll('.itemCard')
    // Locate the search input
    let search_query = uniqueItemCat[category].replaceAll("[", '').replaceAll(']', '').replaceAll("'", "").replaceAll(" ", "");
    // Loop through the cards
    for (var i = 0; i < cards.length; i++) {
        var items = cards[i].className;
        let regex = new RegExp(`\\s${search_query}`);
        if (regex.test(items) == true) {
            if (cards[i].classList.contains('is-hidden')) {
                cards[i].classList.remove("is-hidden");
            } else {
                cards[i].classList.add("is-hidden");
            }
        }
    }
}

//Layout Checks
var locDisplay = document.getElementById('locations');
locDisplay.innerHTML = '';

//console.log(locCat)

//Setup Categories
for (i in uniqueLocCat) {
    if (i == 0) {
        locDisplay.innerHTML += `<div align='center' style='font-weight:bold; cursor: pointer;' onclick='locCatClose("` + i + `")'>` + uniqueLocCat[i] + " (<span id='locCat" + i + "'>0</span>)</div><br>";
    } else {
        locDisplay.innerHTML += `<br><div align='center' style='font-weight:bold; cursor: pointer;' onclick='locCatClose("` + i + `")'>` + uniqueLocCat[i] + " (<span id='locCat" + i + "'>0</span>)</div><br>";
    }
    //Add Locations
    for (j in locNames) {
        for (k in locCat[j]) {
            if (locCat[j][k] === uniqueLocCat[i]) {
                var splitStyle = uniqueLocCat[i].split(' ');
                var combineStyle = '';

                for (var l = 0; l < splitStyle.length; l++) {
                    combineStyle += splitStyle[l].replaceAll("[", '').replaceAll(']', '').replaceAll("'", "").replaceAll('(', '').replaceAll(')', '');
                }

                var visTrigger = locCat[j][k].replaceAll("[", '').replaceAll(']', '').replaceAll("'", "").replaceAll(" ", "").replaceAll("(", "").replaceAll(")", "");

                locDisplay.innerHTML += `<div class='locations ` + combineStyle + `' id="` + locIDs[j] + `" data-el="` + locIDs[j] + `" data-vis="` + visTrigger + `">` + locNames[j] + "</div>";
            }
        }
    }
    locCatClose(i);
}

//Close & Open Location Categories by clicking
function locCatClose(category) {
    // Locate the card elements
    let cards = document.querySelectorAll('.locations')
    // Locate the search input
    let search_query = uniqueLocCat[category].replaceAll("[", '').replaceAll(']', '').replaceAll("'", "").replaceAll(" ", "").replaceAll("(", "").replaceAll(")", "");
    // Loop through the cards
    for (var i = 0; i < cards.length; i++) {
        var items = cards[i].getAttribute('data-vis');
        let regex = new RegExp(`^${search_query}$`);
        if (regex.test(items) == true) {
            if (cards[i].classList.contains('is-hidden')) {
                cards[i].classList.remove("is-hidden");
            } else {
                cards[i].classList.add("is-hidden");
            }
        }
    }
}

//Filter Location Scripting
function liveSearch() {
    // Locate the card elements
    let cards = document.querySelectorAll('.locations')
    // Locate the search input
    let search_query = document.getElementById("searchbox").value;
    // Loop through the cards
    for (var i = 0; i < cards.length; i++) {
        // If the text is within the card...
        if (cards[i].innerText.toLowerCase()
            // ...and the text matches the search query...
            .includes(search_query.toLowerCase())) {
            // ...remove the `.is-hidden` class.
            cards[i].classList.remove("is-hidden");
        } else {
            // Otherwise, add the class.
            cards[i].classList.add("is-hidden");
        }
    }
    if (search_query == '') {
        for (var i = 0; i < uniqueCat.length; i++) {
            locCatClose(uniqueCat[i]);
        }
    }
}

//Filter Items Scripting (by category)
function itemSearch() {
    // Locate the card elements
    let cards = document.querySelectorAll('.items')
    // Locate the search input
    let search_query = document.getElementById("searchbox2").value;
    // Loop through the cards
    for (var i = 0; i < cards.length; i++) {
        // If the text is within the card...
        if (cards[i].id.toLowerCase()
            // ...and the text matches the search query...
            .includes(search_query.toLowerCase())) {
            // ...remove the `.is-hidden` class.
            cards[i].classList.remove("is-hidden");
        } else {
            // Otherwise, add the class.
            cards[i].classList.add("is-hidden");
        }
    }
}

//Counter Scripting
function catCounter() {
    if (document.getElementById('locCat0')) {
        for (var i = 0; i < uniqueLocCat.length; i++) {
            var styleSplit = uniqueLocCat[i].split(' ');
            var styleCombine = '';

            for (var l = 0; l < styleSplit.length; l++) {
                styleCombine += styleSplit[l].replaceAll("[", '').replaceAll(']', '').replaceAll("'", "").replaceAll('(', '').replaceAll(')', '');
            }

            var parseName = '.' + styleCombine;
            var visible = 0;
            for (var k = 0; k < $(parseName).length; k++) {
                if (!document.getElementsByClassName(styleCombine)[k].getAttribute('style')) {
                    visible += 1;
                }
            }
            document.getElementById('locCat' + i).innerHTML = visible;
        }
    }
}
function itemCounter() {
    if (document.getElementById(uniqueItemCat[0] + '2')) {
        for (var i = 0; i < uniqueItemCat.length; i++) {
            styleSplit = uniqueItemCat[i].split(' ');
            var styleCombine = '';

            for (var l = 0; l < styleSplit.length; l++) {
                styleCombine += styleSplit[l].replaceAll("[", '').replaceAll(']', '').replaceAll("'", "");
            }

            var parseName = '.' + styleCombine + ":visible";
            var visible = $(parseName).length;
            document.getElementById(uniqueItemCat[i] + '2').innerHTML = visible;
        }
    }
}

function changeColor() {
    if (!this.style.backgroundColor) {
        this.style.backgroundColor = 'red';
        this.style.color = 'white'
    } else if (this.style.backgroundColor == 'rgb(0, 173, 145)') {
        this.style.backgroundColor = 'red';
        this.style.color = 'white'
    } else if (this.style.backgroundColor == 'red') {
        this.style.backgroundColor = 'rgb(0, 173, 145)';
        this.style.color = 'black'
    }
}
function changeHintColor() {
    if (!this.style.backgroundColor) {
        this.setAttribute('databg', 'marked')
        this.style.backgroundColor = 'red';
        this.style.color = 'white'
    } else if (this.getAttribute('databg') == 'default') {
        this.setAttribute('databg', 'marked')
        this.style.backgroundColor = 'red';
        this.style.color = 'white'
    } else if (this.getAttribute('databg') == 'marked') {
        this.setAttribute('databg', 'default')
        this.style.backgroundColor = 'rgb(63,63,63)';
        this.style.color = 'white'
    }
}

//Listener for marking items as used in the tracker (Not all games support this)
document.querySelectorAll('.itemsStyle').forEach(el => el.addEventListener('click', changeColor));

//HINTS (WIP)//

//Variables
var findingPlayer = [];
var receivingPlayer = [];
var hintLocation = [];
var hintItem = [];
var hintFound = [];

function updateText() {
    document.getElementById('hints').innerHTML = '';
    var hintTxt = '';
    /* Should look like
    [Hint]: [receiving_player]'s [hintItem] is at [hintLocation] in [finding_player]'s World. (FOUND/NOT FOUND)
    END*/
    //vars just for text
    /*REMOVING FOUND/NOT FOUND BECAUSE OF BUGS
    var findTog = [];
    for (k in hintFound) {
        if (hintFound[k] == true) {
            findTog.push("FOUND");
        } else {
            findTog.push("NOT FOUND");
        }
    }*/

    //Parse Info into readable text
    for (p in findingPlayer) {
        hintTxt += `<div class='hintMsg'>` + receivingPlayer[p] + `'s ` + hintItem[p] + ` is at ` + hintLocation[p] + ` in ` + findingPlayer[p] + `'s World.</div>`
    }

    document.getElementById('hints').innerHTML = hintTxt;
    document.querySelectorAll('.hintMsg').forEach(el => el.addEventListener('click', changeHintColor));
}

//Show/Hide Hints
function showHide(field) {
    var fields = ['items', 'locations', 'hints']
    if (document.getElementById(field).style.display == 'none') {
        for (i in fields) {
            if (field != fields[i]) {
                document.getElementById(fields[i]).style.width = '38vw';
            }
            if (field == fields[i]) {
                document.getElementById(fields[i]).style.width = '20vw';
            }
        }
        document.getElementById(field).style.display = 'block';
    } else {
        for (i in fields) {
            if (field != fields[i]) {
                document.getElementById(fields[i]).style.width = '38vw';
            }
            if (field == fields[i]) {
                document.getElementById(fields[i]).style.width = '20vw';
            }
        }
        document.getElementById(field).style.display = 'none';
    }
}