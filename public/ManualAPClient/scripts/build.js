var versionTag = "Archipelago Web Client v0.4.4 Build 20240129 Built by <a style='color:white;' href='https://github.com/rampantepsilon'>RampantEpsilon</a>";

document.getElementById('buildText').innerHTML = versionTag;

document.getElementById('changelog').innerHTML = `<h4>Please note: Manual Archipelago is not part of the main Archipelago. Any issues with the web client or manuals in general should be asked in the <a href='https://discord.gg/T5bcsVHByx' style='color:white'>Manual Archipelago Discord Server</a></h4>
<h3>Changes to ` + versionTag + `</h3>
<ul>
<li>Fixed bug where some games with the new category support would fail to show checks. (New method checks what locations are available after connecting and only using the apmanual file as the template.)</li>
<li>Added basic DeathLink support.</li>
<li>Added Text Only client to the site.</li>
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