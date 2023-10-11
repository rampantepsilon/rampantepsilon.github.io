//Arrays for info from server
var locationIds = [];
var locationNames = [];
var itemIds = [];
var itemNames = [];

//Tracking for Async resync
var checkedLocations = [];

//Sorting Arrays
var locations = sessionStorage.getItem('locations').split(',');
var uniqueCat = sessionStorage.getItem('uniqueCat').split(',');
var itemsList = [];
var uniqueItems = sessionStorage.getItem('uniqueItems').split(',').sort();
var catCount = sessionStorage.getItem('count').split(',');

function itemsListVar() {
    var temp = sessionStorage.getItem('items').split(',');

    var k = 0;

    for (var j = 0; j < catCount.length; j++) {
        var tempList = [];
        for (var i = 0; i < catCount[j]; i++) {
            tempList.push(temp[k])
            k += 1;
        }
        itemsList.push(tempList);
    }
    itemsList.push(["Game Filler"])
    catCount.push('1');
}
itemsListVar();

function disconnect() {
    sessionStorage.removeItem('locations', '');
    sessionStorage.removeItem('uniqueCat', '');
    sessionStorage.removeItem('items', '');
    sessionStorage.removeItem('uniqueItems', '');

    window.location.href = './index.html'
}

//Allow grouping from APWorld
$("#style").on("change", function (evt) {
    var zip = new JSZip();

    zip.loadAsync(this.files[0])
        .then(function (zip) {
            var fileList = [];
            for (let [filename, file] of Object.entries(zip.files)) {
                fileList.push(filename);
            }

            var rootDir = fileList[0].substring(0, fileList[0].indexOf('/'));

            const file_locations = zip.file(rootDir + `/data/locations.json`);
            const file_items = zip.file(rootDir + `/data/items.json`);
            if (file_locations) {
                file_locations.async('string')
                    .then((content) => {
                        var locationTemp = JSON.parse(content);
                        var locationsTemp = [];
                        var uniqueCatTemp = [];

                        for (var i = 0; i < locationTemp.length; i++) {
                            locationsTemp.push(locationTemp[i]['category'][0]);
                            if (!uniqueCatTemp.includes(locationsTemp[i])) {
                                uniqueCatTemp.push(locationsTemp[i]);
                            }
                        }

                        sessionStorage.setItem('locations', locationsTemp);
                        sessionStorage.setItem('uniqueCat', uniqueCatTemp);
                    });
            } else {
                console.log("An error has occurred.")
            }

            if (file_items) {
                file_items.async('string')
                    .then((content) => {
                        var itemTemp = JSON.parse(content);
                        var itemsTemp = [];
                        var uniqueItemTemp = [];
                        var itemCatCount = [];

                        for (var i = 0; i < itemTemp.length; i++) {
                            var itemsMultiTemp = [];

                            itemCatCount.push(itemTemp[i]['category'].length);

                            for (var j = 0; j < itemTemp[i]['category'].length; j++) {
                                itemsMultiTemp.push(itemTemp[i]['category'][j])
                                if (!uniqueItemTemp.includes(itemTemp[i]['category'][j])) {
                                    uniqueItemTemp.push(itemTemp[i]['category'][j]);
                                }
                            }
                            itemsTemp.push(itemsMultiTemp);
                        }
                        itemsTemp.push('Game Filler');
                        uniqueItemTemp.push('Game Filler');

                        sessionStorage.setItem('items', itemsTemp);
                        sessionStorage.setItem('uniqueItems', uniqueItemTemp);
                        sessionStorage.setItem('count', itemCatCount);
                    })
            }
        })
    setTimeout(() => {
        reload();
    }, 500);
})

function itemCounter() {
    for (var i = 0; i < uniqueItems.length; i++) {
        styleSplit = uniqueItems[i].split(' ');
        var styleCombine = '';

        for (var l = 0; l < styleSplit.length; l++) {
            styleCombine += styleSplit[l];
        }

        var parseName = '.' + styleCombine + ":visible";
        var visible = $(parseName).length;
        document.getElementById(uniqueItems[i] + '2').innerHTML = visible;
    }
}

function reload() {
    window.location.href = './index.html'
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
}

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