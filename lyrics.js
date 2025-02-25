async function lyrics(audio) {
    const accessToken ="";
    const formData = new FormData()
    formData.append("accessTo",accessToken);
    formData.append("url", audio);
    formData.append('return', "apple_music,spotify");
}

try {
    const response = await fetch('https://api.audd.io/', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    console.log(data);

    if (data.result && data.result.lyrics) {
        console.log("Lyrics:", data.result.lyrics);
        return data.result.lyrics;
    } else {
        console.log("Lyrics not found.");
        return null;
    }
} catch (error) {
    console.error('Error fetching lyrics:', error);
}
