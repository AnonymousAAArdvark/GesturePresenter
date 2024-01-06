import { DefaultEventsMap } from '@socket.io/component-emitter';
import io, {Socket} from 'socket.io-client';

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
let heartbeatInterval: number;
let currentPairingCode: string | null = null;
let lastHeartbeatTime: Date = new Date();
let lastGestureTime: Date = new Date();

const startHeartbeat = () => {
  if (heartbeatInterval) clearInterval(heartbeatInterval);

  heartbeatInterval = setInterval(() => {
    if (socket && socket.connected && currentPairingCode) {
      socket.emit('heartbeat', { code: currentPairingCode });
      lastHeartbeatTime = new Date();
      console.log("Heartbeat sent for code:", currentPairingCode);
    } else {
      clearInterval(heartbeatInterval);
    }
  }, 25000);
};

const shouldRegenerateCode = () => {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60000);
  const oneHourAgo = new Date(now.getTime() - 60 * 60000);
  return lastHeartbeatTime < fifteenMinutesAgo || lastGestureTime < oneHourAgo;
};

const connectToSocket = () => {
  socket = io("https://gesture-presenter-bc9d819e6d43.herokuapp.com", { transports: ['websocket'] });

  socket.on('connect', () => {
    console.log('Connected to the server');
    startHeartbeat();
    requestNewCode();
  });

  socket.on('gesture_event', (data) => {
    console.log('Gesture received:', data.gesture);
    lastGestureTime = new Date();

    chrome.runtime.sendMessage({ type: 'gesture', gesture: data.gesture });

    chrome.tabs.query({active: true, currentWindow: true, url: 'https://docs.google.com/presentation/*'}, function(tabs) {
      if (tabs.length === 0) {
        console.log('No active tab found');
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, { gesture: data.gesture });
    });
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
  });
};

const requestNewCode = () => {
  fetch('https://gesture-presenter-bc9d819e6d43.herokuapp.com/generate_code')
    .then(response => response.json())
    .then(data => {
      currentPairingCode = data.code;
      lastHeartbeatTime = new Date();
      lastGestureTime = new Date();
      socket.emit('pair', { code: data.code });
      chrome.storage.local.set({ pairingCode: data.code });
      console.log("New pairing code:", data.code);
    })
    .catch(error => console.error('Error fetching pairing code:', error));
};

chrome.runtime.onInstalled.addListener(() => {
  connectToSocket();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getPairingCode') {
    if (shouldRegenerateCode()) {
      requestNewCode();
    }
    sendResponse({ status: 'codeRequested'});
    return true;
  } else if (message.type === 'requestNewCode') {
    requestNewCode();
    sendResponse({ status: 'newCodeRequested' });
    return true;
  }
});