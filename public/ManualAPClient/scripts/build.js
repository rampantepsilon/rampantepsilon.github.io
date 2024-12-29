var versionTag = "Archipelago Web Client v0.5.1 Build 20241228 Built by <a style='color:white;' href='https://github.com/rampantepsilon'>RampantEpsilon</a>";

document.getElementById('buildText').innerHTML = versionTag;

document.getElementById('changelog').innerHTML = `<h4>Please note: Manual Archipelago is not part of the main Archipelago. Any issues with the web client or manuals in general should be asked in the <a href='https://discord.gg/T5bcsVHByx' style='color:white'>Manual Archipelago Discord Server</a></h4>
<h3>Changes to ` + versionTag + `</h3>
<ul>
<li>Added update for v0.5.1 of Archipelago</li>
<li>Updated layout to clean up the view of the client. Items, Locations, and Hints can be toggled to view. Chat will remain constantly viewable.</li>
<li>Updated Text Only to reflect v0.5.1</li>
<li>Updated tags to display the website and to show you are using the Web Client</li>
<li>Updated Chatbox to have styling to match the rest of the page</li>
</ul>
<h4>Known Issues</h4>
<ul>
<li>Victory button cannot be hidden.</li>
<li>Hints not retaining marked status upon chat refresh.</li>
<li>Possible issue with Traps not showing proper colors.</li>
<li>Hints not showing proper coloring. (Should be updated on the next release.)</li>
<li>Items not retaining marked status upon refresh.</li>
</ul>`

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function changeLog() {
    modal.style.display = "block";
}