const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export const soundSettings = {
  disableSound: false,
}

export function playRandomizedSound(soundFile, volume) {
    if (soundSettings.disableSound) {
      return;
    }

    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    const pitchShiftNode = audioContext.createBiquadFilter();
  
    // Load sound file
    fetch(soundFile)
      .then(response => response.arrayBuffer())
      .then(data => audioContext.decodeAudioData(data))
      .then(buffer => {
        source.buffer = buffer;
  
        // Connect nodes
        source.connect(pitchShiftNode);
        pitchShiftNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
  
        // Set volume
        const randomizedVolume = volume;
        gainNode.gain.value = randomizedVolume;
  
        // Apply pitch modulation
        const pitchModulation = Math.random() * 500; 
        pitchShiftNode.detune.value = pitchModulation * 200; // Adjust the factor as needed
        // Play the sound
        source.start();
      })
      .catch(error => console.error('Error loading sound:', error));
}