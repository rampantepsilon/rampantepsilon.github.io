import {
    Client,
    ITEMS_HANDLING_FLAGS,
    SERVER_PACKET_TYPE,
    CLIENT_PACKET_TYPE,
    LocationsManager,
} from "../scripts/archipelago.js@1.0.0.js";

// Create a new Archipelago client
const client = new Client();

const connectionInfo = {
    hostname: sessionStorage.getItem('host'), // Replace with the actual AP server hostname.
    port: parseInt(sessionStorage.getItem('port')), // Replace with the actual AP server port.
    game: sessionStorage.getItem('game'), // Replace with the game name for this player.
    name: sessionStorage.getItem('player'), // Replace with the player slot name.
    items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL,
    version: {
        build: 3,
        major: 0,
        minor: 4,
    },
    tags: ['AP', 'DeathLink', '(WIP)']
};

// Set up event listeners
client.addListener(SERVER_PACKET_TYPE.CONNECTED, (packet) => {
    console.log("Connected to server: ", packet);

    //Get Checked Locations
    for (var i = 0; i < packet['checked_locations'].length; i++) {
        checkedLocations.push(packet['checked_locations'][i])
    }
});

client.addListener(SERVER_PACKET_TYPE.DATA_PACKAGE, (packet) => {
    //console.log("Locations: ", packet)

    var game = sessionStorage.getItem('game');
    var i = 0;

    //Get location names
    for (i in packet["data"]["games"][game]['location_id_to_name']) {
        locationNames.push(packet["data"]["games"][game]['location_id_to_name'][i])
    }

    //Get location IDs
    for (i in packet["data"]["games"][game]['location_name_to_id']) {
        locationIds.push(packet["data"]["games"][sessionStorage.getItem('game')]['location_name_to_id'][i])
    }

    //Get Item Names
    for (i in packet["data"]["games"][game]['item_id_to_name']) {
        itemNames.push(packet["data"]["games"][sessionStorage.getItem('game')]['item_id_to_name'][i])
    }

    //Get Item IDs
    for (i in packet["data"]["games"][game]['item_name_to_id']) {
        itemIds.push(packet["data"]["games"][sessionStorage.getItem('game')]['item_name_to_id'][i])
    }

    //Add All found checks to display
    addToDisplay();
})

//Variable for styling items
var styleSplit;

function addToDisplay() {
    var items = document.getElementById('items');
    var locationsPage = document.getElementById('locations');

    items.innerHTML = '';
    locationsPage.innerHTML = '';

    //Get Unique Item Categories
    if (uniqueItems.length > 1) {
        for (var j = 0; j < uniqueItems.length; j++) {
            //Setup Categories
            if (j == 0) {
                items.innerHTML += "<div align='center' class='items' id='" + uniqueItems[j] + `' style='font-weight: bold;' onclick='itemCatClose("` + j + `")'>` + uniqueItems[j] + " (<span id='" + uniqueItems[j] + "2'>0</span>)</div><br>";
            } else {
                items.innerHTML += "<br><div align='center' class='items' id='" + uniqueItems[j] + `' style='font-weight: bold;' onclick="itemCatClose('` + j + `')">` + uniqueItems[j] + " (<span id='" + uniqueItems[j] + "2'>0</span>)</div><br>";
            }
            //Add Items to categories
            for (var i = 0; i < itemIds.length; i++) {
                for (var k = 0; k < catCount[i]; k++) {
                    if (itemsList[i][k] == uniqueItems[j]) {
                        styleSplit = uniqueItems[j].split(' ');
                        var styleCombine = '';

                        for (var l = 0; l < styleSplit.length; l++) {
                            styleCombine += styleSplit[l].replaceAll("[", '').replaceAll(']', '').replaceAll("'", "");
                        }

                        items.innerHTML += "<span class='" + itemIds[i] + "2 " + styleCombine + "' style='display:none;'><div class='items itemsStyle' id='" + uniqueItems[j] + "' data-id='" + itemIds[i] + "'>" + itemNames[i] + " (<span class='" + itemIds[i] + "'>0</span>)</div></span>";
                    }
                }
            }
        }
    }
    // Unused (Was used before APWorlds were required)
    else {
        for (var i = 0; i < itemIds.length; i++) {
            items.innerHTML += "<div>" + itemNames[i] + " (<span class='itemCount' id='" + itemIds[i] + "'>0</span>)</div>";
        }
    }

    //Get Location Unique Categories
    if (uniqueCat.length > 1) {
        for (var j = 0; j < uniqueCat.length; j++) {
            //Set up Location Categories
            if (j == 0) {
                locationsPage.innerHTML += `<div align='center' style='font-weight:bold; cursor: pointer;' onclick='locCatClose("` + j + `")'>` + uniqueCat[j] + " (<span id='locCat" + j + "'>0</span>)</div><br>";
            } else {
                locationsPage.innerHTML += `<br><div align='center' style='font-weight:bold; cursor: pointer;' onclick='locCatClose("` + j + `")'>` + uniqueCat[j] + " (<span id='locCat" + j + "'>0</span>)</div><br>";
            }
            //Add locations to categories
            for (var i = 0; i < locationIds.length; i++) {
                var splitStyle = uniqueCat[j].split(' ');
                var combineStyle = '';
                for (var l = 0; l < splitStyle.length; l++) {
                    combineStyle += splitStyle[l].replaceAll("[", '').replaceAll(']', '').replaceAll("'", "").replaceAll('(', '').replaceAll(')', '');
                }

                if (locations[i] == uniqueCat[j]) {
                    locationsPage.innerHTML += `<div class="locations ` + combineStyle + `" id="` + locationIds[i] + `" data-el="` + locationIds[i] + `" data-vis="` + uniqueCat[j] + `">` + locationNames[i] + "</div>";
                }
            }
        }
    }
    //Unused (Was used before APWorlds were required)
    else {
        for (var i = 0; i < locationIds.length; i++) {
            locationsPage.innerHTML += "<div id='" + locationIds[i] + "' data-el='" + locationIds[i] + `' class='locations')">` + locationNames[i] + "</div>";
        }
    }

    //Add listener for marking checks on the server
    document.querySelectorAll('.locations').forEach(el => el.addEventListener('click', event => {
        if (event.target.getAttribute('data-el') != locationIds[locationIds.length - 1]) {
            client.locations.check(parseInt(event.target.getAttribute('data-el')));
        } else {
            for (var i = 0; i < locationIds.length - 1; i++) {
                client.locations.check(parseInt(locationIds[i]));
                document.getElementById(locationIds[i]).style.display = 'none';
            }
        }
        document.getElementById(event.target.getAttribute('data-el')).style.display = 'none';
    }));

    //Add listener to show items as found
    document.querySelectorAll('.itemsStyle').forEach(el => el.addEventListener('change', event => {
        var currentID = parseInt(event.target.getAttribute('data-id'));
        if (currentID != 0) {
            document.getElementById(currentID + "2").style.display = 'block'
        }
    }))

    //Listener for marking items as used in the tracker (Not all games support this)
    document.querySelectorAll('.itemsStyle').forEach(el => el.addEventListener('click', changeColor));

    //Call to close all location categories
    setTimeout(() => {
        catCounter();
        for (var i = 0; i < uniqueCat.length; i++) {
            locCatClose(i);
        }
    }, 500)
}

//Mark Received Items
client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, (packet) => {
    var packetItems = packet.items;

    //Parse items and locations
    for (var i = 0; i < packetItems.length; i++) {
        var receivedItem = packetItems[i]['item'];
        var receivedLocation = packetItems[i]['location'];

        //Show items received upon connection
        for (var j = 0; j < document.getElementsByClassName(receivedItem).length; j++) {
            var currentCount = parseInt(document.getElementsByClassName(receivedItem)[j].innerHTML);
            document.getElementsByClassName(receivedItem)[j].innerHTML = currentCount + 1;
            if (receivedItem != 0) {
                if (document.getElementsByClassName(receivedItem + "2")[j]) {
                    document.getElementsByClassName(receivedItem + "2")[j].style.display = 'block'
                }
            }
        }

        //Mark locations as found when connecting (based on items in own world)
        if (document.getElementById(receivedLocation)) {
            document.getElementById(receivedLocation).style.display = 'none';
        }
    }

    //Mark locations as found when connecting (any other locations)
    for (var i = 0; i < checkedLocations.length; i++) {
        var receivedLocation2 = checkedLocations[i];
        document.getElementById(receivedLocation2).style.display = 'none';
    }

    //Give player category count (doesn't do total items yet)
    itemCounter();
    catCounter();
})

//Listen for chat activity from player
document.getElementById('chatBox').addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        client.say($("#chatBox").val())
        document.getElementById('chatBox').value = '';
    }
})

//Chat Log
client.addListener(SERVER_PACKET_TYPE.PRINT_JSON, (packet, message) => {
    var newMessage;

    //Determine newMessage depending on chat message or server message
    if (packet['type'] == 'Chat') {
        newMessage = packet['data'][0]['text'];
    } else {
        newMessage = message;
    }

    //Color Code for player
    if (newMessage.includes(sessionStorage.getItem('player'))) {
        var splitMsg = newMessage.split(sessionStorage.getItem('player'))
        var remMessage = splitMsg[1];

        //Handle coding depending on where player's name is
        if (newMessage.indexOf(sessionStorage.getItem('player')) == 0) {
            newMessage = `<span style="color: rgb(0, 173, 145);">` + sessionStorage.getItem('player') + `</span>` + remMessage;
            if (splitMsg[2]) {
                newMessage += `<span style="color: rgb(0, 173, 145);">` + sessionStorage.getItem('player') + `</span>` + splitMsg[2];
            }
        } else {
            newMessage = newMessage.substring(0, newMessage.indexOf(sessionStorage.getItem('player'))) + `<span style="color: rgb(0, 173, 145);">` + sessionStorage.getItem('player') + `</span>` + remMessage;
            if (splitMsg[2]) {
                newMessage += `<span style="color: rgb(0, 173, 145);">` + sessionStorage.getItem('player') + `</span>` + splitMsg[2];
            }
        }
        //Item Color (WIP) [TEMPORARILY DISABLED]
        /*for (var i = 0; i < itemNames.length; i++) {
            if (newMessage.includes(itemNames[i])) {
                if (newMessage.includes('found') || newMessage.includes('sent')) {
                    var itemSplit = newMessage.split(itemNames[i]);
                    newMessage = newMessage.substring(0, newMessage.indexOf(itemNames[i])) + `<span style="color: rgb(255, 94, 94);">` + itemNames[i] + `</span>`;
                    for (var j = 1; j < itemSplit.length; j++) {
                        if (j != itemSplit.length - 1) {
                            newMessage += itemSplit[j] + itemNames[i]
                        } else {
                            newMessage += itemSplit[j]
                        }
                    }
                }
            }
        }*/
    }

    //Return message to player
    var oldmsg = document.getElementById('log').innerHTML;
    document.getElementById('log').innerHTML = "<div class='textMsg'>" + newMessage + "</div>" + oldmsg + "";
});

// Connect to the Archipelago server
client
    .connect(connectionInfo)
    .then(() => {
        console.log("Connected to the server");
        // You are now connected and authenticated to the server. You can add more code here if need be.
    })
    .catch((error) => {
        console.error("Failed to connect:", error);
        document.getElementById('log').innerHTML = "<li>Failed to connect: " + error + " (Player: " + sessionStorage.getItem('player') + " is not a valid player for " + sessionStorage.getItem('game') + ")</li>";
        // Handle the connection error.
    });

// Disconnect from the server when unloading window.
window.addEventListener("beforeunload", () => {
    client.disconnect();
});