import io from 'socket.io-client';

chrome.runtime.onInstalled.addListener(() => {
  const socket = io("http://localhost:5000", { transports: ['websocket'] });

  fetch('http://localhost:5000/generate_code')
    .then(response => response.json())
    .then(data => {
      socket.emit('pair', { code: data.code });
      chrome.storage.local.set({ pairingCode: data.code });
    })
    .catch(error => console.error('Error fetching pairing code:', error));

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'getPairingCode') {
      chrome.storage.local.get('pairingCode', (result) => {
        sendResponse(result.pairingCode);
      });
      return true;
    }
  });
});