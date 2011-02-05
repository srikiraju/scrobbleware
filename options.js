/* Copyright (c) 2011 Srikanth Raju, http://srikanthraju.in/scrobbleware
 * Released under MIT license. See LICENSE file for more information */

function save() {    
    localStorage.username = document.getElementById("username").value;
    localStorage.password = document.getElementById("password").value;
    chrome.extension.getBackgroundPage().window.location.reload();
    return false;
}

function clear() {
    localStorage.clear();
    chrome.extension.getBackgroundPage().window.location.reload();
}


function update( msg ) {
    document.getElementById("status").innerHTML=msg;
    document.getElementById("status").style.display="block";
}

function load() {
    if (localStorage.username != null) {
        update("User set to " + localStorage.username + ". "
             + ( localStorage.auth_success == 1 ? "Auth success" : "Auth failed" ) );
    }
}

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        load();
        sendResponse({});
    }
);
