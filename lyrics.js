async function getLyrics(artist, title) {
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.lyrics) {
            console.log("Lyrics:", data.lyrics);
            return data.lyrics;
        } else {
            console.log("Lyrics not found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        return null;
    }
}

