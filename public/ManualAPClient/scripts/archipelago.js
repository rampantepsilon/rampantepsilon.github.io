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
        build: 4,
        major: 0,
        minor: 4,
    },
    tags: JSON.parse(sessionStorage.getItem('tags'))//tags: ['AP', 'DeathLink', '(WIP)']
};

// Set up event listeners
client.addListener(SERVER_PACKET_TYPE.CONNECTED, (packet) => {
    console.log("Connected to server: ", packet);

    //Get Checked Locations
    for (var i = 0; i < packet['checked_locations'].length; i++) {
        checkedLocations.push(packet['checked_locations'][i])
    }

    setTimeout(() => {
        console.log(client.items.received);
        hideLocations();
    }, 500);
});

function hideLocations() {
    var visLocations = client.locations.missing;
    var tempLocs = JSON.parse(sessionStorage.getItem('locIDs'));

    setTimeout(() => {
        for (i in tempLocs) {
            if (!visLocations.includes(tempLocs[i])) {
                document.getElementById(tempLocs[i]).style.display = 'none';
            }
        }
        catCounter();
    }, 500);
}

function getHints() {
    setTimeout(() => {
        findingPlayer = [];
        receivingPlayer = [];
        hintLocation = [];
        hintItem = [];
        hintFound = [];

        for (i in client.hints.mine) {
            findingPlayer.push(client.players.name(client.hints.mine[i]['finding_player']));
            receivingPlayer.push(client.players.name(client.hints.mine[i]['receiving_player']));
            hintLocation.push(client.locations.name(client.players.game(client.hints.mine[i]['finding_player']), client.hints.mine[i]['location']));
            hintItem.push(client.items.name(client.players.game(client.hints.mine[i]['receiving_player']), client.hints.mine[i]["item"]));
            console.log(client.hints.mine[i]);
            hintFlags.push(client.hints.mine[i]['item_flags']);
        }

        updateText();
    }, 250);
}

//Add listener for marking checks on the server
document.querySelectorAll('.locations').forEach(el => el.addEventListener('click', event => {
    if (event.target.getAttribute('data-el') != locIDs[locIDs.length - 1]) {
        client.locations.check(parseInt(event.target.getAttribute('data-el')));
    } else {
        for (var i = 0; i < locIDs.length - 1; i++) {
            client.locations.check(parseInt(locIDs[i]));
            document.getElementById(locIDs[i]).style.display = 'none';
        }
    }
    document.getElementById(event.target.getAttribute('data-el')).style.display = 'none';
}));

//Add listener to show items as found
document.querySelectorAll('.itemsStyle').forEach(el => el.addEventListener('change', event => {
    var currentID = parseInt(event.target.getAttribute('data-id'));
    if (currentID != 0) {
        document.getElementById(currentID + "2").setAttribute('style', 'is-hidden')
    }
}))

//Listener for marking items as used in the tracker (Not all games support this)
//document.querySelectorAll('.itemsStyle').forEach(el => el.addEventListener('click', changeColor));

//Call to close all location categories
setTimeout(() => {
    catCounter();
}, 500)

var hintItemsFound = []; //Variable just for hints

//Listener for DeathLink packets
client.addListener(SERVER_PACKET_TYPE.BOUNCED, (packet) => {
    console.log(packet);

    var deathTxt = "DEATH SENT BY " + packet['data']['source'];

    var oldmsg = document.getElementById('log').innerHTML;
    document.getElementById('log').innerHTML = "<div class='textMsg'>" + deathTxt + "</div>" + oldmsg + "";
})

//Mark Received Items
client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, (packet) => {
    var packetItems = packet.items;

    for (i in packet.items) {
        hintItemsFound.push(packet.items[i]["item"]);
    }

    //Parse items and locations
    for (var i = 0; i < packetItems.length; i++) {
        var receivedItem = packetItems[i]['item'];

        //Show items received upon connection
        for (var j = 0; j < document.getElementsByClassName(receivedItem).length; j++) {
            var currentCount = parseInt(document.getElementsByClassName(receivedItem)[j].innerHTML);
            document.getElementsByClassName(receivedItem)[j].innerHTML = currentCount + 1;
            if (receivedItem != 0) {
                if (document.getElementsByClassName(receivedItem + "2")[j]) {
                    document.getElementsByClassName(receivedItem + "2")[j].classList.remove('is-hidden');
                }
            }
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
    getHints();
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
    //console.log(packet);

    //Update Hints
    getHints();

    var testMessage = message;

    //Determine newMessage depending on chat message or server message
    if (packet['type'] == 'Chat') {
        testMessage = packet['data'][0]['text'];//Color Code for player
        let playerName = sessionStorage.getItem('player');
        var playerReplace = "<span style='color: rgb(0, 173, 145);'>" + playerName + "</span>";
        let playerRegex = new RegExp(`${playerName}`);
        testMessage = testMessage.replace(playerRegex, playerReplace);
    } else if (packet['type'] == 'Join') {
        testMessage = packet['data'][0]['text'];//Color Code for player
        let playerName = sessionStorage.getItem('player');
        var playerReplace = "<span style='color: rgb(0, 173, 145);'>" + playerName + "</span>";
        let playerRegex = new RegExp(`${playerName}`);
        testMessage = testMessage.replace(playerRegex, playerReplace);
    } else if (packet['type'] == 'ItemSend') {
        var tempTxt = '';

        for (i in packet['data']) {
            if (packet['data'][i]['type'] == 'player_id') {
                tempTxt += "<span style='color: rgb(0, 173, 145);'>" + client.players.name(parseInt(packet['data'][i]['text'])) + "</span>";
            } else if (packet['data'][i]['type'] == 'item_id') {
                //Progression Items
                if (packet['data'][i]['flags'] == '1') {
                    tempTxt += "<span style='color:gold'>" + client.items.name(client.players.game(packet['data'][i]['player']), parseInt(packet['data'][i]['text'])) + "</span>"
                }

                //Useful Items
                if (packet['data'][i]['flags'] == '2') {
                    tempTxt += "<span style='color:lawngreen'>" + client.items.name(client.players.game(packet['data'][i]['player']), parseInt(packet['data'][i]['text'])) + "</span>"
                }

                //Filler Items
                if (packet['data'][i]['flags'] == '0') {
                    tempTxt += "<span style='color:cornflowerblue'>" + client.items.name(client.players.game(packet['data'][i]['player']), parseInt(packet['data'][i]['text'])) + "</span>"
                }

                //Trap Items (Needs Testing)
                if (packet['data'][i]['flags'] == '4') {
                    tempTxt += "<span style='color:lightcoral'>" + client.items.name(client.players.game(packet['data'][i]['player']), parseInt(packet['data'][i]['text'])) + "</span>"
                }
            } else if (packet['data'][i]['type'] == 'location_id') {
                tempTxt += client.locations.name(client.players.game(packet['data'][i]['player']), parseInt(packet['data'][i]['text']))
            } else {
                tempTxt += packet['data'][i]['text'];
            }
        }
        testMessage = tempTxt;
    } else if (packet['type'] == 'Hint') {
        var tempTxt = '';
        var colorTemp = '';

        for (i in packet['data']) {
            if (packet['data'][i]['type'] == 'player_id') {
                if (client.players.name(parseInt(packet['data'][i]['text'])) == sessionStorage.getItem('player')) {
                    tempTxt += "<span style='color: rgb(0, 173, 145);'>" + client.players.name(parseInt(packet['data'][i]['text'])) + "</span>";
                } else {
                    tempTxt += "<span style='color: lightblue;'>" + client.players.name(parseInt(packet['data'][i]['text'])) + "</span>";
                }
            } else if (packet['data'][i]['type'] == 'item_id') {
                //Progression Items
                if (packet['data'][i]['flags'] == '1') {
                    tempTxt += "<span style='color:gold'>" + client.items.name(client.players.game(packet['data'][i]['player']), parseInt(packet['data'][i]['text'])) + "</span>";
                    colorTemp = '1';
                }

                //Useful Items
                if (packet['data'][i]['flags'] == '2') {
                    tempTxt += "<span style='color:lawngreen'>" + client.items.name(client.players.game(packet['data'][i]['player']), parseInt(packet['data'][i]['text'])) + "</span>";
                    colorTemp = '2';
                }

                //Filler Items
                if (packet['data'][i]['flags'] == '0') {
                    tempTxt += "<span style='color:cornflowerblue'>" + client.items.name(client.players.game(packet['data'][i]['player']), parseInt(packet['data'][i]['text'])) + "</span>";
                    colorTemp = '0';
                }

                //Trap Items (Needs Testing)
                if (packet['data'][i]['flags'] == '4') {
                    tempTxt += "<span style='color:lightcoral'>" + client.items.name(client.players.game(packet['data'][i]['player']), parseInt(packet['data'][i]['text'])) + "</span>";
                    colorTemp = '4';
                }
            } else {
                tempTxt += packet['data'][i]['text'];
            }
        }
        testMessage = tempTxt;
    }

    //Return message to player
    var newMessage = testMessage;
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