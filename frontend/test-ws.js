const WebSocket = require('ws');
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDXj47YfufW5mX0bW3z3cUHZxhvIiaV_YY';
const model = "gemini-2.5-flash-native-audio-preview-12-2025";
const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;

const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  ws.send(JSON.stringify({
    setup: {
      model: `models/${model}`,
      generationConfig: { responseModalities: ["AUDIO"] },
    }
  }));
});

let phase = 0;

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.setupComplete) {
    // Send a chunk of fake audio (silence)
    const fakePCM = new Uint8Array(16000 * 2); // 1 second of silence
    const base64 = Buffer.from(fakePCM).toString('base64');
    
    ws.send(JSON.stringify({
      realtimeInput: {
        mediaChunks: [{ mimeType: "audio/pcm;rate=16000", data: base64 }]
      }
    }));
    
    // Then send clientContent
    setTimeout(() => {
      ws.send(JSON.stringify({
        clientContent: {
          turns: [{ role: "user", parts: [{ text: "Hello" }] }],
          turnComplete: true
        }
      }));
    }, 1000);
  }
});

ws.on('close', (code, reason) => {
  console.log(`Closed: code=${code}, reason=${reason}`);
});
