/* Copyright (c) 2011 Srikanth Raju, http://srikanthraju.in/scrobbleware
 * Released under MIT license. See LICENSE file for more information */

var song_details = {};
var cache = LastFMCache();
var lastfm = new LastFM({
    apiKey: 'e2ab4f19dcc05968add2c22efd69cf53',
    apiSecret: 'a67ac7517161be33a08b473c64800ab3',
    cache : cache
});

var session;

function auth() 
{
    console.log( localStorage.username );
    console.log( localStorage.password );
    if( localStorage.username != null && localStorage.password != null )
    {
        lastfm.auth.getMobileSession( { username:localStorage.username, password:localStorage.password }, { success: function( data ) {
                console.log( data.session );
                session = data.session;
                localStorage.auth_success = 1;
                chrome.tabs.getSelected(null, function(tab) {
                    chrome.tabs.sendRequest(tab.id, {});
                });
                listenForSongs();
            }, error: function( data ) {
                localStorage.auth_success = 2;
                chrome.tabs.getSelected(null, function(tab) {
                    chrome.tabs.sendRequest(tab.id, {});
                });
            }
         } );
    }
    else
    {
        console.log( "Need to enter credentials in options page" );
    }
}

function scrobble()
{
    var now_time = parseInt(new Date().getTime() / 1000.0);
    if( song_details.title && song_details.title != "" &&
        song_details.artist && song_details.artist != "" &&
        song_details.album && song_details.album != "" && session != null
        && now_time - song_details.start_time > 30 )
    {
        lastfm.track.scrobble( { track:song_details.title,
            artist:song_details.artist, album:song_details.album,
            timestamp:song_details.start_time }, session );
    }
}

function playingstatus()
{
    if( session != null )
        lastfm.track.updateNowPlaying( { track:song_details.title,
            artist:song_details.artist,
            album:song_details.album }, session );
}

function listenForSongs() {
    chrome.extension.onRequest.addListener(
        function( request, sender, sendResponse ) {
            switch( request.type )
            {
                case "playing_song":
                    scrobble();//Scrobble previous song if any
                    //Verify new song
                    //Update infos and set last.fm playing status
                    console.log( request );
                    song_details.title = request.title;
                    song_details.album = request.album;
                    song_details.artist = request.artist;
                    song_details.start_time = parseInt(new Date().getTime() / 1000.0);
                    playingstatus();
                    break;
                case "stopped_song":
                    song_details = {};
                    break;
            }
            sendResponse({});
        }
    );

    chrome.tabs.onRemoved.addListener( function( ) {
            //scrobble();
        }
    );
}
console.log( "Done loading extension" );
auth();//Auth on startup
