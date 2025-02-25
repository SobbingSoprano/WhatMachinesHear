let accessToken = "BQAOq67dChHME8UdsuRZq3WHrKDSxU9AuAXGORGAn5ixVGYW3nePYUWPnL-9R1G__W_1uGTFto_NwIZIOdvScnuYlV5Evv_18EARGz-_Sste24wVYIgb2dc2h_urlZVjDA7wG5TxF_Ex1P38lEwzt8QKeQZI2k2khXAzwcDMMFPclMiuhrVhiyo9RsUcRyX6l8xOtecwVOpsKui9BTf8ubT8w0fDx38KMXatCS4L9SPgMrPe9Q2A_YOO1J7esEBq";

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get("track_id");

    if (!trackId) {
        document.getElementById("song-details").innerText = "No track found.";
        return;
    }

    const AccessToken = accessToken;

    // Fetch track details
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${AccessToken}` }
    });

    const track = await response.json();
    
    document.getElementById("song-details").innerHTML = `
        <h2>${track.name}</h2>
        <p>by ${track.artists.map(a => a.name).join(", ")}</p>
        <img src="${track.album.images[0].url}" alt="${track.name} Cover Art" class="cover-art"/>
        <p><a href="${track.external_urls.spotify}" target="_blank">Play in Spotify to Enable Transcription</a></p>
    `;

    document.getElementById("play-button").addEventListener("click", async () => {
        await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: { Authorization: `Bearer ${AccessToken}`, "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
    });
    document.getElementById("pause-button").addEventListener("click", async () => {
        await fetch("https://api.spotify.com/v1/me/player/pause", {
            method: "PUT",
            headers: { Authorization: `Bearer ${AccessToken}`, "Content-Type": "application/json" }
        });
    });
});
