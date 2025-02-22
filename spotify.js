const client_id = 'f7cfe8cfaace4308b94aa278c99ce07e';
const client_secret = '0e07a19d71f44e5180bc8f58ebfda9a3';


let accessToken = 'BQCwwg8o5bvNE7EU_xH-WvCRHHi8yey_qA0iNWHGRMS77_wthzFqD1xJaR6ZEyH-xvKPyPx5ufUmlo1X8_0MBFjv1674NTiwjUcEH5of3T-jZ9zDpaayGdgWjexOTiwKtjFtqbN5Behqr07gXEZaKvdeH5SE-LX5xMGLPfmI485KhyOL057zTUrJg1d6EgJrH_S_v4tLQuLompU6dJGksDw4geqr0ma2_oDyWVPlv2-Sy0z5_XWXbCC2FKfn3vdU'; // Store globally
window.onSpotifyWebPlaybackSDKReady = () => {
    const token = accessToken; // Replace with a valid OAuth token

    const player = new Spotify.Player({
        name: 'My Web Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    // Connect the player
    player.connect();

    // Handle player state
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
    });

    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    player.addListener('player_state_changed', state => {
        if (!state) return;
        console.log('Player state changed:', state);
    });
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
        const songItem = document.createElement('div');
        songItem.classList.add('song-item', 'hide');

        const coverArt = track.album.images[1]?.url;
        const trackUri = track.uri; // Get the track URI for playback

        songItem.innerHTML = `
            <p>
                <strong>${track.name}</strong> 
                by <span class="artist-name">${track.artists.map(a => a.name).join(', ')}</span>
            </p>
            <div class="cover-container">
                <img src="${coverArt}" alt="${track.name} Cover Art" class="cover-art" onclick="togglePlayback('${trackUri}')"/>
                <button class="play-button" onclick="togglePlayback('${trackUri}')">▶️</button>
            </div>
        `;

        resultsDiv.appendChild(songItem);

        // Staggered fade-in effect
        setTimeout(() => {
            songItem.classList.remove('hide');
        }, 500 * (index + 1));
    });
};
