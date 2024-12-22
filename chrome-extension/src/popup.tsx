import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Popup = () => {
  const [pairingCode, setPairingCode] = useState('');

  const updatePairingCode = () => {
    chrome.storage.local.get('pairingCode', (result) => {
      if (result.pairingCode) {
        setPairingCode(result.pairingCode);
      }
    });
  };

  useEffect(() => {
    updatePairingCode();

    chrome.storage.onChanged.addListener((changes, namespace) => {
      if ('pairingCode' in changes) {
        updatePairingCode();
      }
    });
  }, []);

  return (
    <div style={styles.popupContainer}>
      <h1 style={styles.title}>Pairing Code</h1>
      <div style={styles.codeContainer}>{pairingCode}</div>
      <p style={styles.instructions}>
        Please open <a href="https://your-placeholder-link.com" target="_blank" rel="noopener noreferrer">
        https://your-placeholder-link.com</a> on your mobile device and enter the pairing code.
      </p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  popupContainer: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '14px',
    color: '#333',
    backgroundColor: '#f7f7f7',
    width: '300px'
  },
  title: {
    margin: '0 0 20px 0',
    color: '#4a4a4a'
  },
  codeContainer: {
    fontSize: '24px',
    margin: '10px 0',
    padding: '10px 0',
    backgroundColor: '#eaeaea',
    borderRadius: '4px',
    color: '#333'
  },
  instructions: {
    marginTop: '20px',
    lineHeight: '1.5',
    color: '#555'
  }
};

ReactDOM.render(<Popup />, document.getElementById('root'));