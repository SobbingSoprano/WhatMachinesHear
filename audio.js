let audioContext;
let analyser;
let microphone;
let canvas;
let canvasContext;
let dataArray;

//startRecording() is used to retrieve audio from external sources (via microphone)
function startRecording() {
    // Checks if the browser supports Web Audio API
    if (!navigator.mediaDevices || !window.AudioContext) {
        alert('Your browser does not support the required audio features.');
        return;
    }

    // Creating a new AudioContext for analysis
    audioContext = new AudioContext();

    // Creates an analyser node and node options for frequency analysis (aka the visualizer data & settings)
    analyser = audioContext.createAnalyser();
    analyser.smoothingTimeConstant = 0.88;
    analyser.fftSize = 512;  // adjust "frequency" of soundwave

    // Canvas element created to display the visualizer
    canvas = document.getElementById('soundwave');
    canvasContext = canvas.getContext('2d');

    // Gets user media source (aka the microphone)
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Creates a stream source from the microphone input
            microphone = audioContext.createMediaStreamSource(stream);
            
            // Connects the microphone to the analyser
            microphone.connect(analyser);
            
            // Start the visualizer
            visualize();
        })
        //checks and alerts the user if there is no access to the microphone.
        .catch(err => {
            console.error('Failed to access microphone: ', err);
            alert('Microphone not accessible.');
        });
}

function visualize() {
    // Creates an array to hold the frequency data retreived from the analyser
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    // Draw() continuously updates the visualization- aka the function that actually creates the soundwave from the analyser's sound data 
    function draw() {
        requestAnimationFrame(draw);  // For continuous updating

        analyser.getByteFrequencyData(dataArray);  // Gets the frequency data

        // Wipes the canvas for a "new" soundwave (repeatedly)
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);

        // Controls visual properties of the soundwave (i.e. height, width, max frequency)
        const waveWidth = canvas.width / dataArray.length;
        let waveHeight;
        let x = 0;
        let maxFrequency = 0;
        let maxIndex = 0;
        let freqLimit = 50;  // Only takes in frequencies above given value

        // Loops through frequency data to find the largest one
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i] > maxFrequency && dataArray[i] > freqLimit) {
                maxFrequency = dataArray[i];
                maxIndex = i;
            }
        }
        // Creates the bars of the soundwave visualizer
        for (let i = 0; i < dataArray.length; i++) {
            waveHeight = dataArray[i];

            // Repeatdely Colors the most prominent frequency white
            if (i === maxIndex) {
                canvasContext.fillStyle = 'rgb(255, 255, 255)';  // Red for the most prominent frequency
            } else {
                canvasContext.fillStyle = 'rgb(0,50,50)';
            }

            // Creates the Soundwave
            canvasContext.fillRect(x, canvas.height - waveHeight, waveWidth, waveHeight);
            x += waveWidth + 5;
        }
    }
    // Starts the loop for visuailzer creation
    draw();
}

//Website immediately accesses the microphone when DOM is Loaded
document.addEventListener("DOMContentLoaded",() => {
    startRecording();
    //variables created for human translation, and robot translation buttons.
    const humanButton = document.querySelector("#translateh");
    const robotButton = document.querySelector("#translater");

    //variable created for soundwave canvas (to hide or show it)
    const soundwaveCanvas = document.getElementById("soundwave");

    // When the human button is clicked, remove the 'hide' class
    humanButton.addEventListener("click", () => {
        soundwaveCanvas.classList.remove("hide");
        soundwaveCanvas.classList.add("show");
    });

    // When the robot button is clicked, add the 'hide' class to human button
    robotButton.addEventListener("click", () => {
        soundwaveCanvas.classList.add("hide");
        soundwaveCanvas.classList.remove("show");
    });
});
