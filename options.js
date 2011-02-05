function save() {    
    localStorage.username = document.getElementById("username").value;
    localStorage.password = document.getElementById("password").value;
    chrome.extension.getBackgroundPage().window.location.reload();
    update('User set to ' + localStorage.username );
    return false;
}

function clear() {
    localStorage.clear();
    chrome.extension.getBackgroundPage().window.location.reload();
    update("User deleted.");
}


function update( msg ) {
    document.getElementById("status").innerHTML=msg;
    document.getElementById("status").style.display="block";
}

function load() {
    if (localStorage.username != null) {
        update('User set to ' + localStorage.username );
    }
}

