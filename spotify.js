const client_id = 'f7cfe8cfaace4308b94aa278c99ce07e';
const client_secret = '0e07a19d71f44e5180bc8f58ebfda9a3';


let accessToken = 'BQA3ZiHf1eutng29LqLWy2G4NxiVS1cJaKdPXRmha4oUc3l8fxoAmYnchhvB-MLPT4aLzf700dKFlTj6oI1KtnLBa8aDviUNsgj9A0e4KC6fCyBNoYWVzjbNLQtZqyFzS-uMKU4eaYVYHRy1F1gAYle2yoriZJfgLO4d7v3MwhRo1EQIJNCfcuRuOFwCqF1BljButn_jWheVNEELcjMfnLrEIqAiQY4-zgr-BQPZAklszqRsOL002z9Cb8Cb5WPz'; // Store globally

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
    } catch (error) {
        console.error('Failed to get access token:', error);
    }
};

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
        // Create a container div for each song with the 'hide' class
        const songItem = document.createElement('div');
        songItem.classList.add('song-item', 'hide'); // Add 'hide' class initially
        const coverArt = track.album.images[1]?.url;
        songItem.innerHTML = `
            <p>
                <strong>${track.name}</strong> 
                by <span class="artist-name">${track.artists.map(a => a.name).join(', ')}</span>
            </p>
            <img src="${coverArt}" alt="${track.name} Cover Art" class="cover-art"/>
        `;

        resultsDiv.appendChild(songItem);

        // Use setTimeout to stagger the removal of 'hide' class
        setTimeout(() => {
            songItem.classList.remove('hide'); // Remove 'hide' class to trigger fade-in
        }, 500 * (index + 1)); // Stagger the fade-in effect (500ms per item)
    });
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

