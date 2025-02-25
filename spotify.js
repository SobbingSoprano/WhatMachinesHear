const client_id = 'f7cfe8cfaace4308b94aa278c99ce07e';
const client_secret = '0e07a19d71f44e5180bc8f58ebfda9a3';


 // Store globally

// Function to get the Spotify Access Token
const getSpotifyToken = async () => {
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
    const encodedCredentials = btoa(`${client_id}:${client_secret}`);

    try {
        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ grant_type: 'client_credentials' })
        });

        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

        const data = await response.json();
        accessToken = data.access_token; // Store the token globally
        console.log('Access Token:', accessToken);
        return data.access_token;
    } catch (error) {
        console.error('Failed to get access token:', error);
    }
};
let accessToken = getSpotifyToken();
// Function to Search for Songs on Spotify
const searchSongs = async (query) => {
    if (!accessToken) {
        console.warn('No access token. Fetching a new one...');
        await getSpotifyToken(); // Ensure token is available
    }

    const searchEndpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`;

    try {
        const response = await fetch(searchEndpoint, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);

        const data = await response.json();
        displayResults(data.tracks.items);
    } catch (error) {
        console.error('Search failed:', error);
    }
};


// Function to Display Search Results with Staggered Fade-In
const displayResults = (tracks) => {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear old results

    tracks.forEach((track, index) => {
        const songItem = document.createElement('div');
        songItem.classList.add('song-item', 'hide');

        const coverArt = track.album.images[1]?.url;
        const trackId = track.id; // Get track ID

        songItem.innerHTML = `
            <p>
                <strong>${track.name}</strong> 
                by <span class="artist-name">${track.artists.map(a => a.name).join(', ')}</span>
            </p>
            <a href="song.html?track_id=${trackId}">
                <img src="${coverArt}" alt="${track.name} Cover Art" class="cover-art"/>
            </a>
        `;

        resultsDiv.appendChild(songItem);
        songItem.querySelector(".cover-art").addEventListener("click", function () {
            updatePlayButton(track.id); // Update play button to play the selected track
        });
        
        setTimeout(() => {
            songItem.classList.remove('hide');
        }, 500 * (index + 1));
    });
};

const updatePlayButton = (trackId) => {
    const playButton = document.getElementById("play-button");
    playButton.onclick = async () => {
        await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
            body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }) // Always play the selected track
        });
    };
};



// Event Listener for Search Bar
document.addEventListener('DOMContentLoaded', async () => {
    await getSpotifyToken(); // Get token before user searches

    const searchInput = document.getElementById('input');
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') { // Search when Enter is pressed
            searchSongs(searchInput.value);
        }
    });
});

// next step: add a link to the cover art that goes to playback/lyrics/binary translation page? still not sure on the details of this yet-

