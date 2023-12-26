import { DefaultEventsMap } from '@socket.io/component-emitter';
import io, {Socket} from 'socket.io-client';

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const connectToSocket = () => {
  socket = io("http://localhost:5000", { transports: ['websocket'] });

  socket.on('connect', () => {
    console.log('Connected to the server');

    fetch('http://localhost:5000/generate_code')
      .then(response => response.json())
      .then(data => {
        socket.emit('pair', { code: data.code });
        chrome.storage.local.set({ pairingCode: data.code });
      })
      .catch(error => console.error('Error fetching pairing code:', error));
  });

  socket.on('gesture_event', (data) => {
    console.log('Gesture received:', data.gesture);
    // Implement the logic to simulate a keypress or other action based on the gesture
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from the server');
    // Handle reconnection logic if necessary
  });
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