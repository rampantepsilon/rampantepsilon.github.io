var versionTag = "Archipelago Web Client v0.4.4 Build 20240118 Built by <a style='color:white;' href='https://github.com/rampantepsilon'>RampantEpsilon</a>";

document.getElementById('buildText').innerHTML = versionTag;

document.getElementById('changelog').innerHTML = `<h4>Please note: Manual Archipelago is not part of the main Archipelago. Any issues with the web client or manuals in general should be asked in the <a href='https://discord.gg/T5bcsVHByx' style='color:white'>Manual Archipelago Discord Server</a></h4>
<h3>Changes to ` + versionTag + `</h3>
<ul>
<li>HOTFIX: Fixed issue where game specific filler and __Manual Game Complete__ weren't showing properly.</li>
<li>Rework of backend to accomodate to the .APMANUAL files now provided with all Manual APs.</li>
<li>Removed Deathlink tag when logging in. (Will probably bring this back once I look into Deathlink more.)</li>
<li>Change the build to show 0.4.4 when connecting.</li>
<li>Added Tag "ManualWeb" to show that it's the web client connecting.</li>
<li>Added Color Coding for items and player names. (ALPHA VERSION) [Issues may exist.]</li>
</ul>
<h4>Known Issues</h4>
<ul>
<li>If two people are running the same Manual but different players, the tracker might "remove" checks from one of the players. The checks are not marked and you will need to use the Python tracker found in the Discord or server commands to release the check. (Issue is possibly fixed, but more testing is needed.</li>
<li>Items changing color on click not functioning. Currently unsure as to why this is happening, but should be fixed in the next update.</li>
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