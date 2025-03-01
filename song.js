document.addEventListener("DOMContentLoaded", async () => { 
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get("track_id");
    
    if (!trackId) {
        document.getElementById("song-details").innerText = "No track found.";
        return;
    }

    // Make sure to request the correct scopes
    const accessToken = await getSpotifyToken({
    scope: 'user-read-playback-state user-modify-playback-state streaming user-library-read'
    });
 // ✅ Ensure we get the token before using it
    console.log("Fetched Access Token:", accessToken);

    if (!accessToken) {
        document.getElementById("song-details").innerText = "Failed to get access token.";
        return;
    }

    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    const track = await response.json();
    document.getElementById("song-details").innerHTML = `
        <h2>${track.name}</h2>
        <p>by ${track.artists.map(a => a.name).join(", ")}</p>
        <img src="${track.album.images[0].url}" alt="${track.name} Cover Art" class="cover-art"/>
        <p><a href="${track.external_urls.spotify}" target="_blank">Play in Spotify to Enable Transcription</a></p>
    `;

    // // Handle Spotify Web Playback SDK
    // window.onSpotifyWebPlaybackSDKReady = () => {
    //     const token = accessToken;
    //     const player = new Spotify.Player({
    //         name: 'Web Playback SDK Quick Start Player',
    //         getOAuthToken: cb => { cb(token); },
    //         volume: 0.5
    //     });

    //     player.connect()
        
    //     document.getElementById('play-button').onclick = function() {
    //         player.togglePlay();
    //       };
        
    //     document.getElementById('pause-button').onclick = function() {
    //         player.togglePause();
    //       };
          
    // };
});
