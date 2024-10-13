import React, { useState } from 'react';

interface SettingsModalProps {
  onPairingCodeSubmit: (code: string) => void;
  onToggleGestureSwap: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onPairingCodeSubmit, onToggleGestureSwap }) => {
  const [pairingCode, setPairingCode] = useState('');

  return (
    <div className="settings-modal">
      <p>Settings for the Camera application. Enter your pairing code and adjust gesture settings.</p>
      <div>
        <label htmlFor="pairingCode">Pairing Code:</label>
        <input
          id="pairingCode"
          type="text"
          value={pairingCode}
          onChange={(e) => setPairingCode(e.target.value)}
        />
        <button onClick={() => onPairingCodeSubmit(pairingCode)}>Submit</button>
      </div>
      <div>
        <label htmlFor="gestureSwap">Swap Gesture Directions:</label>
        <input
          id="gestureSwap"
          type="checkbox"
          onChange={onToggleGestureSwap}
        />
      </div>
    </div>
  );
};

export default SettingsModal;