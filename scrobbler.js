var song_details = {};
var cache = LastFMCache();
var lastfm = new LastFM({
    apiKey: 'e2ab4f19dcc05968add2c22efd69cf53',
    apiSecret: 'a67ac7517161be33a08b473c64800ab3',
    cache : cache
});

var session;
lastfm.auth.getMobileSession( { username:"user", password:"pw" }, { success: function( data ) {
    console.log( data.session );
    session = data.session;
} } );

function scrobble()
{
    if( song_details.title && song_details.title != "" &&
        song_details.artist && song_details.artist != "" &&
        song_details.album && song_details.album != "" )
    {
        lastfm.track.scrobble( { track:song_details.title,
            artist:song_details.artist, album:song_details.album,
            timestamp:song_details.start_time }, session );
    }
}

function playingstatus()
{
    lastfm.track.updateNowPlaying( { track:song_details.title,
            artist:song_details.artist,
            album:song_details.album }, session );
}

chrome.extension.onRequest.addListener(
    function( request, sender, sendResponse ) {
        scrobble();//Scrobble previous song
        //Verify new song
        //Update infos and set last.fm playing status
        console.log( request );
        song_details.title = request.title;
        song_details.album = request.album;
        song_details.artist = request.artist;
        song_details.start_time = parseInt(new Date().getTime() / 1000.0);
        playingstatus();
    }
);

//Handling multiple tabs
chrome.tabs.onUpdated.addListener( function( tabID, changeInfo, tab) {
    }
);

//Handling window close
chrome.tabs.onRemoved.addListener( function( tabId ) {
    }
);

console.log( "Done loading extension" );
