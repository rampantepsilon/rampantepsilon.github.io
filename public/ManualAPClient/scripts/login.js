if (sessionStorage.getItem('host')) {
    document.getElementById('hostname').value = sessionStorage.getItem('host');
}
if (sessionStorage.getItem('port')) {
    document.getElementById('port').value = sessionStorage.getItem('port');
}
if (sessionStorage.getItem('game')) {
    document.getElementById('game').value = sessionStorage.getItem('game');
}
if (sessionStorage.getItem('player')) {
    document.getElementById('player').value = sessionStorage.getItem('player');
}

function connect(type) {
    var host = document.getElementById('hostname').value;
    var port = document.getElementById('port').value;
    var game = document.getElementById('game').value;
    var player = document.getElementById('player').value;

    if (type == 'manual') {
        if (game.includes('Manual_')) {
            if (document.getElementById('style').files.length == 0) {
                document.getElementById('err').innerHTML = "No APMANUAL supplied. Please supply the .APMANUAL file pertaining to the game to continue."
            } else {
                complete(host, port, game, player);
            }
        } else {
            document.getElementById('err').innerHTML = "Invalid Game! Game must be a Manual AP world formatted as 'Manual_{Game}_{Creator}' or 'Manual_{Game}' (Second instance is rare).<br>Please correct and try again."
        }
    }

    if (type == 'text') {
        completeText(host, port, player);
    }
}

function complete(host, port, game, player) {
    sessionStorage.setItem('host', host);
    sessionStorage.setItem('port', port);
    sessionStorage.setItem('game', game);
    sessionStorage.setItem('player', player);

    window.location.href = './apclient.html'
}

function completeText(host, port, player) {
    sessionStorage.setItem('host', host);
    sessionStorage.setItem('port', port);
    sessionStorage.setItem('player', player);

    window.location.href = './textclient.html'
}

//Allow grouping from APWorld
$("#style").on("change", function (evt) {
    if (document.getElementById('style').value.includes('.apmanual')) {
        const [file] = document.getElementById('style').files;
        const reader = new FileReader()

        reader.addEventListener(
            "load",
            () => {
                //B64 Decryption
                var decoded = JSON.parse(atob(reader.result));

                console.log(decoded);

                //Set Game & Player Name
                document.getElementById('game').value = decoded['game'];
                document.getElementById('player').value = decoded['player_name'];

                //Set Background
                /*var bckgrndRadio = document.getElementsByName('bckgrnd');
                var checked = Array.from(bckgrndRadio).find((radio) => radio.checked);
                if (checked.value == 'yes') {
                    if (decoded['background-image']) {
                        sessionStorage.setItem('background', decoded['background-image'])
                    }
                }*/

                //Get information JSONs
                var locations = decoded['locations'];
                var items = decoded['items'];
                var categories = '';
                if (decoded['categories']) {
                    categories = decoded['categories'];
                }
                parseInfo(locations, items, categories);
            },
            false,
        );

        if (file) {
            reader.readAsText(file);
        }
    }
})

function parseInfo(locations, items, categories) {
    //Make Object easier to parse
    var locMain = [];
    var itemMain = [];
    for (i in locations) {
        locMain.push(locations[i])
    }
    for (i in items) {
        itemMain.push(items[i]);
    }

    //Parse Unique Location Categories
    var uniqueLocCat = [];
    for (i in locMain) {
        var locCatTemp = [];
        for (j in locMain[i]["category"]) {
            if (!categories == '') {
                if (!categories[locMain[i]['category'][j]]) {
                    locCatTemp.push(locMain[i]["category"][j]);
                }
            } else {
                locCatTemp.push(locMain[i]["category"][j]);
            }
        }
        for (k in locCatTemp) {
            if (!uniqueLocCat.includes(locCatTemp[k])) {
                if (!categories == '') {
                    if (!categories[locCatTemp[k]]) {
                        uniqueLocCat.push(locCatTemp[k]);
                    }
                } else {
                    uniqueLocCat.push(locCatTemp[k]);
                }
            }
        }
    }

    //Parse Location Names
    var uniqueLocName = [];
    for (i in locMain) {
        uniqueLocName.push(locMain[i]["name"])
    }

    //Parse Locations
    var locCat = [];
    for (i in locMain) {
        locCat.push(locMain[i]["category"]);
    }

    //Parse Location IDs
    var uniqueLocID = [];
    for (i in locMain) {
        uniqueLocID.push(locMain[i]["id"])
    }

    sessionStorage.setItem('uniqueLocCat', JSON.stringify(uniqueLocCat));
    sessionStorage.setItem('locCat', JSON.stringify(locCat));
    sessionStorage.setItem('locNames', JSON.stringify(uniqueLocName));
    sessionStorage.setItem('locIDs', JSON.stringify(uniqueLocID));

    //Parse Unique Item Categories
    var uniqueItemCat = [];
    for (i in itemMain) {
        var itemCatTemp = [];
        for (j in itemMain[i]["category"]) {
            itemCatTemp.push(itemMain[i]["category"][j])
        }
        for (k in itemCatTemp) {
            if (!uniqueItemCat.includes(itemCatTemp[k])) {
                uniqueItemCat.push(itemCatTemp[k]);
            }
        }
    }

    //Parse Location Names
    var uniqueItemName = [];
    for (i in itemMain) {
        uniqueItemName.push(itemMain[i]["name"])
    }

    //Parse Locations
    var itemCat = [];
    for (i in itemMain) {
        itemCat.push(itemMain[i]["category"]);
    }

    //Parse Item IDs
    var uniqueItemID = [];
    for (i in itemMain) {
        uniqueItemID.push(itemMain[i]["id"])
    }

    //Parse Item type
    var itemType = [];
    for (i in itemMain) {
        if (itemMain[i]['progression'] == true) {
            itemType.push("Progression")
        } else if (itemMain[i]['progression_skip_balancing'] == true) {
            itemType.push("Progression")
        } else if (itemMain[i]['filler'] == true) {
            itemType.push("Filler")
        } else if (itemMain[i]['useful'] == true) {
            itemType.push("Useful")
        }
    }

    sessionStorage.setItem('uniqueItemCat', JSON.stringify(uniqueItemCat));
    sessionStorage.setItem('itemCat', JSON.stringify(itemCat));
    sessionStorage.setItem('itemNames', JSON.stringify(uniqueItemName));
    sessionStorage.setItem('itemIDs', JSON.stringify(uniqueItemID));
    sessionStorage.setItem('itemType', JSON.stringify(itemType));
}

//Radio Change
$('input[type=radio][name=clientType]').change(function () {
    if (this.value == 'manual') {
        $("#player").attr('disabled', 'disabled');
        $('#manualBtn').show();
        $('#textBtn').hide();
    } else if (this.value == 'text') {
        $("#player").removeAttr('disabled');
        $('#manualBtn').hide();
        $('#textBtn').show();
    }
})