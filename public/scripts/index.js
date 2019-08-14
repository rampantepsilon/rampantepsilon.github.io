function redirect(location){
  window.location.href = location;
}

function newTab(location){
  window.open(location, '_blank');
}

function cursor(){
  var links = document.getElementsByClassName("link");
  for (var i=0; i<links.length; i++){
    links[i].style.cursor = 'pointer';
  }
}
