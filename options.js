/* Copyright (c) 2011 Srikanth Raju, http://srikanthraju.in/scrobbleware
 * Released under MIT license. See LICENSE file for more information */

function save_func() {
    localStorage.username = document.getElementById("username").value;
    localStorage.password = document.getElementById("password").value;
    chrome.extension.getBackgroundPage().window.location.reload();
}

function clear_func() {
    localStorage.clear();
    chrome.extension.getBackgroundPage().window.location.reload();
    document.getElementById("username").removeAttribute("disabled");
    document.getElementById("password").removeAttribute("disabled");
    document.getElementById("submit").removeAttribute("disabled");
    document.getElementById("status").style.display='none';
}


function update( msg ) {
    document.getElementById("status").innerHTML=msg;
}

function load() {
    if (localStorage.username != null) {
        update("User set to " + localStorage.username + ". "
             + ( localStorage.auth_success == 1 ? "Auth success. Hit Clear to unregister" : "Auth failed. Try Again" ) );
    }
    if( localStorage.auth_success == 1 )
    {
	document.getElementById("username").setAttribute("disabled","disabled");
	document.getElementById("password").setAttribute("disabled","disabled");
	document.getElementById("submit").setAttribute("disabled","disabled");
        document.getElementById("status").style.display='';
    }
    else if( localStorage.auth_success == 2 )
    {
        localStorage.clear();
        document.getElementById("status").style.display='';
    }
    else
    {
        document.getElementById("status").style.display='none';
    }
}

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        load();
        sendResponse({});
    }
);
