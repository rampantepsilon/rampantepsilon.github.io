var versionTag = "Archipelago Web Client v0.4.4 Build 20240123 Built by <a style='color:white;' href='https://github.com/rampantepsilon'>RampantEpsilon</a>";

document.getElementById('buildText').innerHTML = versionTag;

document.getElementById('changelog').innerHTML = `<h4>Please note: Manual Archipelago is not part of the main Archipelago. Any issues with the web client or manuals in general should be asked in the <a href='https://discord.gg/T5bcsVHByx' style='color:white'>Manual Archipelago Discord Server</a></h4>
<h3>Changes to ` + versionTag + `</h3>
<ul>
<li>HOTFIX 20240123: Fixed issue where older apmanuals wouldn't work with the previous update.</li>
<li>UPDATE 20240123: Changed hints to show proper coloring when displayed. (Should persist between sessions.)</li>
<li>UPDATE 20240123: Updated Trap Item Colors. This still needs testing with games that have trap items.</li>
<li>UPDATE 20240123: Fixed issue where categories that are hidden were still showing.</li>
<li>HOTFIX 20240122a: Fixed issue where you couldn't close the items group when doing checks.</li>
<li>HOTFIX 20240122: Fixed issue where the client wouldn't load .apmanual files.</li>
<li>Added Text Only client to the site.</li>
<li>Removed Deathlink tag when logging in. (Will probably bring this back once I look into Deathlink more.)</li>
<li>Added Tag "ManualWeb" to show that it's the web client connecting.</li>
</ul>
<h4>Known Issues</h4>
<ul>
<li>Possible issue with Traps not showing proper colors.</li>
<li>Hints not showing proper coloring. (Should be updated on the next release.)</li>
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