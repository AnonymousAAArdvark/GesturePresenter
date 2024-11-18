import React, { useState } from 'react';
import logo from './assets/logo.png';
import instruction from './assets/instruction.png';

interface SettingsModalProps {
  onPairingCodeSubmit: (code: string) => void;
  onToggleGestureSwap: () => void;
  flipped: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onPairingCodeSubmit, onToggleGestureSwap, flipped }) => {
  const [pairingCode, setPairingCode] = useState('');

  const isMobileSafari = () => {
    return /iP(ad|od|hone)/i.test(navigator.platform) && /Safari/i.test(navigator.userAgent) && !/CriOS/i.test(navigator.userAgent);
  };

  return (
    <div className="settings-modal">
      <div className="title-container">
        <h2>GesturePresent</h2>
        <img src={logo} alt="Logo" className="logo" />
      </div>
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
      <label htmlFor="gestureSwap">Swap Gesture Directions:</label>
      <div className="swap-container">
        <div className="instruction-container">
          <img src={instruction} alt="Instruction Left" className="instruction-img img-flip" />
          <span className="swap-label" style={{ color: flipped ? '#0ab20a' : '#ff0000'}}>
            {flipped ? 'Next' : 'Back'}
          </span>
        </div>
        <input
          id="gestureSwap"
          type="checkbox"
          onChange={onToggleGestureSwap}
        />
        <div className="instruction-container">
          <span className="swap-label" style={{ color: flipped ? '#ff0000' : '#0ab20a'}}>
            {flipped ? 'Back' : 'Next'}
          </span>
          <img src={instruction} alt="Instruction Right" className="instruction-img" />
        </div>
      </div>
      {isMobileSafari() && (
        <p className="safari-note">iOS Safari users: hide the toolbar by tapping the
          "<span style={{ fontSize: '.6rem' }}>A</span>A" icon on the bar,
          and then selecting the "Hide Toolbar" option.</p>
      )}
      <button onClick={() => onPairingCodeSubmit(pairingCode)}>Submit</button>
    </div>
  );
};

export default SettingsModal;