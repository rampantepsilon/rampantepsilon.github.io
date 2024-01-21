//Disconnect
function disconnect() {
    sessionStorage.removeItem('locCat');
    sessionStorage.removeItem('locNames');
    sessionStorage.removeItem('locIDs');
    sessionStorage.removeItem('uniqueLocCat');
    sessionStorage.removeItem('itemCat');
    sessionStorage.removeItem('itemNames');
    sessionStorage.removeItem('itemIDs');
    sessionStorage.removeItem('uniqueItemCat');
    sessionStorage.removeItem('itemType');
    sessionStorage.removeItem('background');

    window.location.href = './index.html'
}