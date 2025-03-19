document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get("track_id");
    //Alerts user if no track is found from search
    if (!trackId) {
        alert("No track found.");
        return;
    }
    // Get the access token with the necessary scopes
    const fullAccessToken = "BQAAVhYocrPCKpWFNnNNrby8XN1sHrQydVzcR_-qqRUQm_8IbkrHqhpihIIeMwVG_zF8c515TtvUWflJC6w3Li18uF1GlsLQxLM6epTmpW1F6u6bmv7onFl2Au5yRiqzgkPsIciInn8nnNhRBvvabDHTU3V-B0m9HrHL6SmKN3Nd0Iv-XWB6dGvmDhuNPzVp52CMy17Wdu79tU8BqJPDPHbeGXPAOPIX0lHc1zU85NdWwcNeQe0oIZ9pq4MaR7SW";
    // Fetch track details (artist, title)
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${fullAccessToken}` }
    });
    const track = await response.json();
    document.getElementById("song-details").innerHTML = `
        <h2>${track.name}</h2>
        <p>by ${track.artists.map(a => a.name).join(", ")}</p>
        <img src="${track.album.images[0].url}" alt="${track.name} Cover Art" class="cover-art"/>
    `;

    // Initializing the Spotify Web Playback SDK
    window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new Spotify.Player({
            name: 'Web Playback SDK Player',
            getOAuthToken: cb => { cb(fullAccessToken); },
            volume: 0.5
        });

        // Checks if spotify player is ready to go
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.addListener('ready', async ({ device_id }) => {
            console.log('Player is ready with Device ID:', device_id);

            // Transfer playback to Web SDK Player and automatically start playback
            await fetch("https://api.spotify.com/v1/me/player", {
                method: "PUT",
                headers: { "Authorization": `Bearer ${fullAccessToken}`, "Content-Type": "application/json" },
                body: JSON.stringify({ device_ids: [device_id], play: false })
            });
            await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=0`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${fullAccessToken}`,
                    "Content-Type": "application/json"
                }
            });
            await fetch(`https://api.spotify.com/v1/me/player/play`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${fullAccessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({uris: [`spotify:track:${trackId}`]})
            });
            // Controls for streaming
            document.getElementById("rewind-button").onclick = async () => { //logic for rewind button
                try {
                    // Seek to the beginning of the current track
                    await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=0`, {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${fullAccessToken}`,
                            "Content-Type": "application/json"
                        }
                    });
            
                    // Plays Current Song
                    await fetch(`https://api.spotify.com/v1/me/player/play`, {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${fullAccessToken}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({uris: [`spotify:track:${trackId}`]})
                    });
                    //Alerts user if there's an error with rewind
                } catch (error) {
                    alert("Error rewinding and playing:", error);
                }
            };

            document.getElementById("play-button").onclick = async () => { //logic for play button
                currentTrackId = trackId;
                await fetch(`https://api.spotify.com/v1/me/player/play`, {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${fullAccessToken}`, "Content-Type": "application/json" },
                    body: JSON.stringify({})
                });
            };

            document.getElementById("pause-button").onclick = async () => { //logic for pause button
                await fetch("https://api.spotify.com/v1/me/player/pause", {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${fullAccessToken}` }
                });
            };
        });

        player.connect();
    };

    // Load Spotify SDK
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(script);
    // remove hover effects on cover art on playback page
    const element = document.querySelector('.cover-art');
    if (element) {
        element.style.pointerEvents = 'none';
    }
});
