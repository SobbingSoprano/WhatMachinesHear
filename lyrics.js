// async function getCurrentTrack() {
//     const token = 'BQA0fzwhuBRXSEVQ4hywd5vCddqkJA6GBcvUlsbiMvfQ2Y8_6xwfB8GHHYQdCVn2pVEEpd6sjupEXu1Q3KQbtsc2h-KVgyzlA8ee8ojS9L_xb08MjymE6IsySFbH8HrPXEX1NAiCSTP683hRX2jILrJzBU8brAP6G0GHGx3UX2gly-Alrxo-BBiouWdiN0h6rlZh3m1V4TxhgbQfMIHdsxdYWUQ0qLdZwsl-IWAztO81wWox0zZwXR69emGIhVva'; // Replace with a valid token

//     const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     });

//     const data = await response.json();
//     if (data && data.item) {
//         const songUrl = data.item.external_urls.spotify;
//         console.log('Spotify Song URL:', songUrl);
//         return songUrl;
//     } else {
//         console.log('No track currently playing.');
//         return null;
//     }
// }

// export async function fetchLyrics(trackName, artistName) {
//     const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(trackName)}`;

//     try {
//         const response = await fetch(url);
//         const data = await response.json();

//         if (data.lyrics) {
//             document.querySelector('.lyrics').innerText = data.lyrics;
//         } else {
//             document.querySelector('.lyrics').innerText = "Lyrics not found.";
//         }
//     } catch (error) {
//         console.error('Error fetching lyrics:', error);
//         document.querySelector('.lyrics').innerText = "Error retrieving lyrics.";
//     }
// }




