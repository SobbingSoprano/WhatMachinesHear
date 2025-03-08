document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get("track_id");

    if (!trackId) {
        document.getElementById("song-details").innerText = "No track found.";
        return;
    }

    // Get the access token with the necessary scopes
    const accessToken = "BQCCl9mEnN4uqsXLGKUynBnjh8MnFnKDj12Yxkt7AVyD3Ooxo5qFhLLXelOXX4-5rA1DRLJi4XO-O7qKBfe4xeJqzIvQJCZH-USYh4QqMVXAIht11jsNjYOiFYCo7Z69Td9yPXSz8WGD6kwRqoThSVr578vmgc_fj_rS8YL9_4S35Gsr_Sci9YuRu8vHyUyMC7xJ2KtPZ22GTGDmI7x0XQqQpHcB-Pm-hRiO4HKKDZotUBVWWqCI3UZlOCAZRgIp";

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

            // Transfer playback to Web SDK
            await fetch("https://api.spotify.com/v1/me/player", {
                method: "PUT",
                headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
                body: JSON.stringify({ device_ids: [device_id], play: false })
            });

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
                    console.error("Error rewinding and playing:", error);
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
