import { DefaultEventsMap } from '@socket.io/component-emitter';
import io, {Socket} from 'socket.io-client';

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
let heartbeatInterval: number;

const startHeartbeat = () => {
  if (heartbeatInterval) clearInterval(heartbeatInterval);

  heartbeatInterval = setInterval(() => {
    if (socket && socket.connected) {
      socket.emit('heartbeat', { message: 'keepalive' });
      console.log("heartbeat");
    } else {
      clearInterval(heartbeatInterval);
    }
  }, 25000);
};


const connectToSocket = () => {
  socket = io("http://localhost:5000", { transports: ['websocket'] });

  socket.on('connect', () => {
    console.log('Connected to the server');
    startHeartbeat();
    requestNewCode();
  });

  socket.on('gesture_event', (data) => {
    console.log('Gesture received:', data.gesture);
    // Implement the logic to simulate a keypress or other action based on the gesture
  });

  socket.on('error', (data) => {
    if (data.status === 'invalid_code') {
      console.error('Invalid code, requesting a new one');
      requestNewCode();
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from the server');
    clearInterval(heartbeatInterval);
    // Handle reconnection logic if necessary
  });
};

const requestNewCode = () => {
  fetch('http://localhost:5000/generate_code')
    .then(response => response.json())
    .then(data => {
      socket.emit('pair', { code: data.code });
      chrome.storage.local.set({ pairingCode: data.code });
    })
    .catch(error => console.error('Error fetching pairing code:', error));
};

chrome.runtime.onInstalled.addListener(() => {
  connectToSocket();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getPairingCode') {
    chrome.storage.local.get('pairingCode', (result) => {
      sendResponse(result.pairingCode);
    });
    return true;
  }
});