import React, { useState } from 'react';

interface SettingsModalProps {
  onPairingCodeSubmit: (code: string) => void;
  onToggleGestureSwap: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onPairingCodeSubmit, onToggleGestureSwap }) => {
  const [pairingCode, setPairingCode] = useState('');

  const isMobileSafari = () => {
    return /iP(ad|od|hone)/i.test(navigator.platform) && /Safari/i.test(navigator.userAgent) && !/CriOS/i.test(navigator.userAgent);
  };

  return (
    <div className="settings-modal">
      <h2>GesturePresent </h2>
      <p className="instructions">Enter your pairing code and adjust gesture settings. </p>
      <div>
        <label htmlFor="pairingCode">Pairing Code:</label>
        <input
          id="pairingCode"
          type="text"
          value={pairingCode}
          onChange={(e) => setPairingCode(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="gestureSwap">Swap Gesture Directions:</label>
        <input
          id="gestureSwap"
          type="checkbox"
          onChange={onToggleGestureSwap}
        />
      </div>
      {isMobileSafari() && (
        <p className="safari-note">iOS Safari users: hide the toolbar by tapping the
          "<span style={{ fontSize: '.5rem' }}>A</span>A" icon on the bar,
          and then selecting the "Hide Toolbar" option.</p>
      )}
      <button onClick={() => onPairingCodeSubmit(pairingCode)}>Submit</button>
    </div>
  );
};

export default SettingsModal;