import {
    Client,
    ITEMS_HANDLING_FLAGS,
    SERVER_PACKET_TYPE,
    CLIENT_PACKET_TYPE,
    LocationsManager,
} from "../archipelago.js@1.0.0.js";

// Create a new Archipelago client
const client = new Client();

const connectionInfo = {
    hostname: sessionStorage.getItem('host'), // Replace with the actual AP server hostname.
    port: parseInt(sessionStorage.getItem('port')), // Replace with the actual AP server port.
    game: '', // Replace with the game name for this player.
    name: sessionStorage.getItem('player'), // Replace with the player slot name.
    items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL,
    version: {
        build: 1,
        major: 0,
        minor: 5,
    },
    tags: ['TextOnly', 'Web Client (WIP)', 'rampantepsilon.github.io/ManualAPClient'],//tags: ['AP', 'DeathLink', '(WIP)']
    slot_data: false
};

// Set up event listeners
client.addListener(SERVER_PACKET_TYPE.CONNECTED, (packet) => {
    console.log("Connected to server: ", packet);
});

client.addListener(SERVER_PACKET_TYPE.RECEIVED_ITEMS, (packet) => {
    var packetItems = packet.items;
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

        for (var i = 0; i < packet['data'].length; i++) {
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

        for (var i = 0; i < packet['data'].length; i++) {
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
                    colorTemp = '0';
                }
            } else if (packet['data'][i]['type'] == 'location_id') {
                if (colorTemp == '1') {
                    tempTxt += "<span style='color:gold'>" + client.locations.name(client.players.game(packet['data'][i]['player']), parseInt(packet['data'][i]['text'])) + "</span>";
                }

                if (colorTemp == '2') {
                    tempTxt += "<span style='color:lawngreen'>" + client.locations.name(client.players.game(packet['data'][i]['player']), parseInt(packet['data'][i]['text'])) + "</span>";
                }

                if (colorTemp == '0') {
                    tempTxt += "<span style='color:cornflowerblue'>" + client.locations.name(client.players.game(packet['data'][i]['player']), parseInt(packet['data'][i]['text'])) + "</span>";
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