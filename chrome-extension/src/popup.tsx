import React, {useEffect, useState} from 'react';
import logoImg from './assets/logo.png';
import './popupStyles.css';

interface GestureMessage {
  type: string;
  gesture?: string;
}

const Popup = () => {
  const [pairingCode, setPairingCode] = useState('');

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'getPairingCode' }, (response) => {
      updatePairingCode();
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if ('pairingCode' in changes) {
        updatePairingCode();
      }
    });

    const handleGestureMessage = (
      message: GestureMessage,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (message.type === 'gesture') {
        document.body.style.backgroundColor = message.gesture === 'Left' ? '#FFC1C1' : '#98FB98';
        setTimeout(() => {
          document.body.style.backgroundColor = 'white';
        }, 500);
      }
    };

    chrome.runtime.onMessage.addListener(handleGestureMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleGestureMessage);
    };
  }, []);

  const updatePairingCode = () => {
    chrome.storage.local.get('pairingCode', (result) => {
      if (result.pairingCode) {
        setPairingCode(result.pairingCode);
      }
    });
  };

  const requestNewCode = () => {
    chrome.runtime.sendMessage({ type: 'requestNewCode' }, (response) => {
      console.log(response.status);
    });
  };

  return (
    <div className="popupContainer">
      <div className="header">
        <h2 className="title">GesturePresenter</h2>
        <img src={logoImg} alt="Logo" className="logo" />
      </div>
      <h3 className="pairingCodeTitle">Pairing Code</h3>
      <div className="codeSection">
        <div className="codeContainer">{pairingCode}</div>
        <button onClick={() => requestNewCode()} className="refreshButton">
          <svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 512 512">
            <path fill="currentColor" d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32
            14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32
            32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5
            40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3
            1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7
            0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8
            59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2
            .1-4.8 .3s-3.1 .5-4.6 1z"/>
          </svg>
        </button>
      </div>
      <p className="instructions">
        Please open <a href="https://anonymousaaardvark.github.io/GesturePresenter/" target="_blank" rel="noopener noreferrer">
        your-placeholder-link.com</a> on your mobile device and enter the code.
      </p>
    </div>
  );
};

export default Popup;