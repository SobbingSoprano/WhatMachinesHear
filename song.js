document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get("track_id");

    if (!trackId) {
        alert("No Track Was Found!");
        return;
    }

    // Get the access token with the necessary scopes
    const accessToken = "BQCKIOWs6yBlIK6pavDoi21TnmXO1n9-bJHP7s5A0ii_-rc7eNdwyZO2mg77c3-U-6cenNImSRhwnMbMfvKNSVZb4OdcF0A6vf7AJPH-VZ2HnyvKomCJCkAElQocsl2GUmgWnTHCXkEayi4082cqtuHZYKHEujHaV-8Ej20oyzUjJsnkoxk4meEXhSM6XOSmFT0q-AWKFV2__2l4EpWgulpGrjBxC78N6Cu5KjkxDnaLHW1Tg4K3PEnzw6ZrB5rR    ";

    // Fetch track details
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    const track = await response.json();
    document.getElementById("song-details").innerHTML = `
        <h2>${track.name}</h2>
        <p>by ${track.artists.map(a => a.name).join(", ")}</p>
        <img src="${track.album.images[0].url}" alt="${track.name} Cover Art" class="cover-art"/>
    `;
    const controlbuttonlayout = document.querySelector('horm')
    const translateH = document.getElementById('translateh');
    const translateR = document.getElementById('translater');
    const binaryContainer = document.getElementById("binaryTranslation");
    const soundwaveCanvas = document.getElementById("soundwave");
    binaryContainer.style.display = "none";

    translateH.addEventListener("click", () => {
        soundwaveCanvas.style.opacity = "100";  // Show soundwave
        binaryContainer.style.display = "none";
        controlbuttonlayout.style.marginLeft = "0";
    });

    translateR.addEventListener("click", () => {
        soundwaveCanvas.style.opacity = "0";   // Hide soundwave
        binaryContainer.style.display = "block";
        controlbuttonlayout.style.marginLeft = "95%"; // Show binary container
    });
    // Initialize the Spotify Web Playback SDK
    window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new Spotify.Player({
            name: 'Web Playback SDK Player',
            getOAuthToken: cb => { cb(accessToken); },
            volume: 0.5
        });

        // Error handling
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.addListener('ready', async ({ device_id }) => {
            console.log('Player is ready with Device ID:', device_id);

        // Transfer playback to Web SDK and Start Playing Searched Song as soon as song.html is opened
        await fetch("https://api.spotify.com/v1/me/player", {
                method: "PUT",
                headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
                body: JSON.stringify({ device_ids: [device_id], play: false })
            });
        await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=0`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });
        await fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({uris: [`spotify:track:${trackId}`]})
        });

        //Control logic for rewinding, playing, and pausing
            document.getElementById("rewind-button").onclick = async () => {
                try {
                    // Seek to the beginning of the current track
                    await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=0`, {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        }
                    });
            
                    // Send a play request
                    await fetch(`https://api.spotify.com/v1/me/player/play`, {
                        method: "PUT",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({uris: [`spotify:track:${trackId}`]})
                    });
            
                } catch (error) {
                    alert("Error rewinding and playing:", error);
                }
            };
            
            document.getElementById("play-button").onclick = async () => {
                currentTrackId = trackId;
                await fetch(`https://api.spotify.com/v1/me/player/play`, {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
                    body: JSON.stringify({})
                });
            };

            document.getElementById("pause-button").onclick = async () => {
                await fetch("https://api.spotify.com/v1/me/player/pause", {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });
            };
        });

        player.connect();
    };

    // Load Spotify SDK
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    document.body.appendChild(script);
});
    