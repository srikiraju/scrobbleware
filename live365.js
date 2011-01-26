//Let's look for what's playing and tell our extension that

var song_title; var title_changed = false;
var song_album; var album_changed = false;
var song_artist; var artist_changed = false;
var song_status;

//enable all of these only if playing status is playing
function check_scrobble()
{
    if( title_changed && album_changed && artist_changed )
    {
        //Scrobble old one and set new song playing status in last.fm
        console.log( "Scrobbling "+ song_title + "|" + song_album + "|" +
                song_artist + "|" + song_status );
        chrome.extension.sendRequest( { artist:song_artist,
            title:song_title, album:song_album, sstatus:song_status } );
        title_changed = false;
        artist_changed = false;
        album_changed = false;
    }
}

function update(){
    var title = $("#artistInfo  span.title").text();
    if( title != null && title != "" && title != song_title ) {
        song_title =  title;
        title_changed = true;
    }
    var artist = $("#artistInfo  span.artist").text();
    if( artist != null && artist != "" && artist != song_artist ) {
        song_artist =  artist;
        artist_changed = true;
    }
    var album = $("#artistInfo  span.album").text();
    if( album != null && album != "" && album != song_album ) {
        song_album =  album;
        album_changed = true;
    }
    check_scrobble();
}

function playStatusChanged( )
{
    var sstatus = $("#playOrStopButton").attr("title");
    if( sstatus && sstatus != song_status )
    {
        song_status = sstatus;
        console.log( "Song status changed to:" + song_status );
        if( song_status == "Stop" )
        {
            //Stuff is playing
            update();

            //bind callbacks for changes
            $("#artistInfo").bind( "DOMSubtreeModified", update );
        }
        else
        {
            //unbind
            $("#artistInfo").unbind( "DOMSubtreeModified", update );
        }
    }
}

$("#playerControls").bind( "DOMSubtreeModified", playStatusChanged );
playStatusChanged( );

//OnChange( play status )
//if( playing ), check w/ last.fm gettrackinfo + send playing to last.fm
//sendreq to background.html
//OnChange( title )
//if( playing && title change ) send scrobble to last.fm through background.html

