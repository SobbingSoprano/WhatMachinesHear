document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get("track_id");
    //Alerts user if no track is found from search
    if (!trackId) {
        alert("No Track Was Found!");
        return;
    }
    // Get the access token with the necessary scopes
    const fullAccessToken = "BQBNvw3qG1UfZwFO7JAORR6DtM3GGs4iZJAgbzhpQv7IZ8NCw35wLDNRpRkP1YnJ2bTha8GT8Zqfp3R-wS7e5WjJaTQzasa0tMLXiMgDJtZZ7idOl5O2WbdWhZ5C-jQAPQhsTAeIX-bsGBRN4kqn6U_DKO93eq6gEO8vlMZevm9UQXAVexOOQhdtdoIK6YetOLd8XFn9vxrtXoScyLGNCKlPobEi_R2mp45VMnnX9vwwym58u9-7BHNT5JA52B02";

    // Fetch track details
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${fullAccessToken}` }
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
    //function dedicated to translation of audio data into binary counterpart
    async function binaryTranslation() {
        const binaryContainer = document.getElementById("binaryTranslation");
        //function makes the microphone record real time audio to turn into binary code- binary code is determined by the resing and falling of amplitude values
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256; // frequency adjuster
    
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            //used to check and update binary values
            function refreshBinary() {
                analyser.getByteFrequencyData(dataArray);
                let binaryString = Array.from(dataArray)
                    .map(num => num.toString(2).padStart(8, "0")) // Convert each byte to binary
                    .join(" ");
    
                binaryContainer.textContent = binaryString.substring(0, 500); // Limit display length
                requestAnimationFrame(refreshBinary); //forces binary code container to constantly update the values
            }
    
            refreshBinary();
        } catch (err) {
            alert("Error accessing microphone:", err);
        }
    }
    //translation is started when "robot" button is clicked
    document.getElementById("translater").addEventListener("click", binaryTranslation);
    
    // Initialize the Spotify Web Playback SDK
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

        // Transfer playback to Web SDK and Start Playing Searched Song as soon as song.html is opened
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

        //Control logic for rewinding, playing, and pausing
            document.getElementById("rewind-button").onclick = async () => {
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
            
            document.getElementById("play-button").onclick = async () => {
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
    