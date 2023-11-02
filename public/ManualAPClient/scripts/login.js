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

function connect() {
    var host = document.getElementById('hostname').value;
    var port = document.getElementById('port').value;
    var game = document.getElementById('game').value;
    var player = document.getElementById('player').value;

    if (game.includes('Manual_')) {
        if (document.getElementById('style').files.length == 0) {
            document.getElementById('err').innerHTML = "No APWorld supplied. Please supply the .apworld file pertaining to the game to continue."
        } else {
            complete(host, port, game, player);
        }
    } else {
        document.getElementById('err').innerHTML = "Invalid Game! Game must be a Manual AP world formatted as 'Manual_{Game}_{Creator}' or 'Manual_{Game}' (Second instance is rare).<br>Please correct and try again."
    }
}

function complete(host, port, game, player) {
    sessionStorage.setItem('host', host);
    sessionStorage.setItem('port', port);
    sessionStorage.setItem('game', game);
    sessionStorage.setItem('player', player);
    if (!sessionStorage.getItem('locations')) {
        sessionStorage.setItem('locations', '');
    }
    if (!sessionStorage.getItem('uniqueCat')) {
        sessionStorage.setItem('uniqueCat', '');
    }
    if (!sessionStorage.getItem('items')) {
        sessionStorage.setItem('items', '');
    }
    if (!sessionStorage.getItem('uniqueItems')) {
        sessionStorage.setItem('uniqueItems', '');
    }
    if (!sessionStorage.getItem('count')) {
        sessionStorage.setItem('count', '')
    }

    window.location.href = './apclient.html'
}

//Allow grouping from APWorld
$("#style").on("change", function (evt) {
    if (document.getElementById('style').value.includes('.apworld')) {
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
                const game_name = zip.file(rootDir + `/data/game.json`);

                if (game_name) {
                    game_name.async('string')
                        .then((content) => {
                            var gameTemp = JSON.parse(content);
                            if (gameTemp['creator']) {
                                document.getElementById('game').value = "Manual_" + gameTemp['game'] + "_" + gameTemp['creator'];
                            }
                            if (gameTemp['player']) {
                                document.getElementById('game').value = "Manual_" + gameTemp['game'] + "_" + gameTemp['player'];
                            }
                            //Override for Manual_SMOFestival
                            if (gameTemp['game'] == "SMO" && gameTemp['player']) {
                                console.log('true')
                                document.getElementById('game').value = "Manual_" + gameTemp['game'] + gameTemp['player'];
                            }

                            var bckgrndRadio = document.getElementsByName('bckgrnd');
                            var checked = Array.from(bckgrndRadio).find((radio) => radio.checked);

                            if (checked.value == 'yes') {
                                if (gameTemp['background-image']) {
                                    sessionStorage.setItem('background', gameTemp['background-image'])
                                }
                            }
                        })
                }

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
                            itemsTemp.push('No Category');
                            uniqueItemTemp.push('No Category');

                            sessionStorage.setItem('items', itemsTemp);
                            sessionStorage.setItem('uniqueItems', uniqueItemTemp);
                            sessionStorage.setItem('count', itemCatCount);
                        })
                }
            })
    } else if (document.getElementById('style').value.includes('.apmanual')) {
        const [file] = document.getElementById('style').files;
        const reader = new FileReader()

        reader.addEventListener(
            "load",
            () => {
                //B64 Decryption
                var decoded = JSON.parse(atob(reader.result));

                //Set Game & Player Name
                document.getElementById('game').value = decoded['game'];
                document.getElementById('player').value = decoded['player_name'];
                document.getElementById('player').disabled = true;

                //Set Background
                var bckgrndRadio = document.getElementsByName('bckgrnd');
                var checked = Array.from(bckgrndRadio).find((radio) => radio.checked);
                if (checked.value == 'yes') {
                    if (decoded['background-image']) {
                        sessionStorage.setItem('background', decoded['background-image'])
                    }
                }

                //Get information JSONs
                var locations = decoded['location_table'];
                var items = decoded['item_table'];
                parseInfo(locations, items);
            },
            false,
        );

        if (file) {
            reader.readAsText(file);
        }
    }
})

function parseInfo(locations, items) {
    //Location parser
    var locationsTemp = [];
    var uniqueCatTemp = [];

    for (var i = 0; i < locations.length - 1; i++) {
        locationsTemp.push(locations[i]['category'][0]);
        if (!uniqueCatTemp.includes(locationsTemp[i])) {
            uniqueCatTemp.push(locationsTemp[i]);
        }
    }
    locationsTemp.push('Game Completion');
    uniqueCatTemp.push('Game Completion');

    sessionStorage.setItem('locations', locationsTemp);
    sessionStorage.setItem('uniqueCat', uniqueCatTemp);

    //Item parser
    var itemsTemp = [];
    var uniqueItemTemp = [];
    var itemCatCount = [];

    console.log(items);

    for (var i = 0; i < items.length - 1; i++) {
        if (items[i]['name'] != 'Victory') {
            var itemsMultiTemp = [];

            var itemsCounter = items[i]['category'];
            itemCatCount.push(itemsCounter.length);

            if (items[i]['category'].length == 0) {
                itemsMultiTemp.push("No Category")
                if (!uniqueItemTemp.includes("No Category")) {
                    uniqueItemTemp.push("No Category");
                }
                itemsTemp.push(itemsMultiTemp);
            } else {
                for (var j = 0; j < items[i]['category'].length; j++) {
                    itemsMultiTemp.push(items[i]['category'][j])
                    if (!uniqueItemTemp.includes(items[i]['category'][j])) {
                        uniqueItemTemp.push(items[i]['category'][j]);
                    }
                }
                itemsTemp.push(itemsMultiTemp);
            }
        }
    }
    itemsTemp.push('No Category');
    if (!uniqueItemTemp.includes("No Category")) {
        uniqueItemTemp.push('No Category');
    }

    sessionStorage.setItem('items', itemsTemp);
    sessionStorage.setItem('uniqueItems', uniqueItemTemp);
    sessionStorage.setItem('count', itemCatCount);
}