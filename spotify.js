//ids needed for spotify API
const client_id = 'f7cfe8cfaace4308b94aa278c99ce07e';
const client_secret = '0e07a19d71f44e5180bc8f58ebfda9a3';




// Function to get the Spotify Access Token (less scopes)
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
        accessToken = data.access_token; // Stores token globally
        console.log('Access Token:', accessToken);
        return accessToken;
    }   catch (error) {
        alert('Failed to get access token:', error);
    }
};
let accessToken = getSpotifyToken(); // Store globally

//returns songs in spotify's library best matching user's query
const searchSongs = async (query) => {
    if (!accessToken) {
        console.warn('No access token. Fetching a new one...');
        await getSpotifyToken(); // creates new token if none is provided
    }
//returns top 3 songs matching user's search
    const searchEndpoint = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=3`;

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


// Function to Display Search Results
const displayResults = (tracks) => {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clears old results if any

//creates a div element for each track found with cover art, artist, title and link to song.html for playback
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
            songItem.classList.add('fade-in');
        }, 500 * (index + 1));
    });
};

// Creates the Search Bar
document.addEventListener('DOMContentLoaded', async () => {
    if(!accessToken) {
        await getSpotifyToken(); // Get token before user searches (if needed)
    }
    const searchInput = document.getElementById('input');
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') { // Search when Enter is pressed
            searchSongs(searchInput.value);
            setTimeout(() => {
                searchInput.value = '';
            },600);
        }
    });
});
// next step: add a link to the cover art that goes to playback/lyrics/binary translation page? still not sure on the details of this yet-