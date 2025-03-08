let audioContext;
let analyser;
let microphone;
let canvas;
let canvasContext;
let dataArray;

function startRecording() {
    // Check if browser supports Web Audio API
    if (!navigator.mediaDevices || !window.AudioContext) {
        alert('Your browser does not support the required audio features.');
        return;
    }

    // Create a new AudioContext
    audioContext = new AudioContext();

    // Create an analyser node for real-time frequency analysis
    analyser = audioContext.createAnalyser();
    analyser.smoothingTimeConstant = 0.88;
    analyser.fftSize = 512;  // You can adjust the fftSize for different visualizations

    // Get the canvas element and set its context
    canvas = document.getElementById('soundwave');
    canvasContext = canvas.getContext('2d');

    // Get user media (microphone)
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Create a media stream source from the microphone input
            microphone = audioContext.createMediaStreamSource(stream);
            
            // Connect the microphone to the analyser node
            microphone.connect(analyser);
            
            // Start visualizing audio
            visualize();
        })
        .catch(err => {
            console.error('Error accessing microphone: ', err);
            alert('Failed to access microphone.');
        });
}

function visualize() {
    // Create an array to hold the frequency data
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Function to continuously update the visualization
    function draw() {
        requestAnimationFrame(draw);  // Keep calling this function for continuous updates

        analyser.getByteFrequencyData(dataArray);  // Get the frequency data from the analyser

        // Clear the canvas and redraw the soundwave
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);

        // Set up the visual properties (optional)
        const barWidth = canvas.width / dataArray.length;
        let barHeight;
        let x = 0;

        // Analyze the frequencies (Find the most prominent ones)
        let maxFrequency = 0;
        let maxIndex = 0;
        let threshold = 50;  // Only consider frequencies that are above a certain threshold

        // Loop through the frequency bins and find the maximum amplitude
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i] > maxFrequency && dataArray[i] > threshold) {
                maxFrequency = dataArray[i];
                maxIndex = i;
            }
        }

        // Map the frequency bin index to a specific frequency (Hz)
        let frequency = maxIndex * audioContext.sampleRate / analyser.fftSize;
        // Draw the bars
        for (let i = 0; i < dataArray.length; i++) {
            barHeight = dataArray[i];

            // Highlight the most prominent frequencies (e.g., if it's above a certain threshold)
            if (i === maxIndex) {
                canvasContext.fillStyle = 'rgb(255, 255, 255)';  // Red for the most prominent frequency
            } else {
                canvasContext.fillStyle = 'rgb(0,50,50)';
            }

            // Draw the bar
            canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 5;
        }
    }

    // Start the draw loop
    draw();
}


document.addEventListener("DOMContentLoaded",() => {
    startRecording();
    const humanButton = document.querySelector("#translateh");
    const robotButton = document.querySelector("#translater");
    const soundwaveCanvas = document.getElementById("soundwave");
    const openSpotifyButton = document.querySelectorAll("a");

    // When the human button is clicked, remove the 'hide' class
    humanButton.addEventListener("click", () => {
        soundwaveCanvas.classList.remove("hide");
        soundwaveCanvas.classList.add("show");
    });

    // When the robot button is clicked, add the 'hide' class
    robotButton.addEventListener("click", () => {
        soundwaveCanvas.classList.add("hide");
        soundwaveCanvas.classList.remove("show");
    });

    if (openSpotifyButton) {
        openSpotifyButton.addEventListener("click", () => {
            soundwaveCanvas.classList.remove("hide");
        });
    }
});
