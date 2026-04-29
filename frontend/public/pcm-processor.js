/**
 * PCM Audio Worklet Processor
 * Captures raw 16-bit PCM audio from the microphone at 16kHz.
 * Posts Float32Array chunks to the main thread.
 */

class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._bufferSize = 2048;
    this._buffer = new Float32Array(this._bufferSize);
    this._writeIndex = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0];

    for (let i = 0; i < channelData.length; i++) {
      this._buffer[this._writeIndex++] = channelData[i];

      if (this._writeIndex >= this._bufferSize) {
        // Send a copy of the buffer to the main thread
        this.port.postMessage({
          type: "pcm_data",
          data: this._buffer.slice(),
        });
        this._writeIndex = 0;
      }
    }

    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
