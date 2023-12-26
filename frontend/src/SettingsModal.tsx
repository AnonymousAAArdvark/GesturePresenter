import React, { useState } from 'react';
import axios from "axios";
import logo from './assets/logo.png';
import instruction from './assets/instruction.png';

interface SettingsModalProps {
  onPairingCodeSubmit: (code: string) => void;
  onToggleGestureSwap: () => void;
  flipped: boolean;
  pairingCode: string;
}

interface PairingResponse {
  status: string;
  message?: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
   onPairingCodeSubmit,
   onToggleGestureSwap,
   flipped,
   pairingCode,
 }) => {
  const [pairingCodeInput, setPairingCodeInput] = useState<string>(pairingCode);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handlePairingCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.match(/^\d{0,4}$/)) {
      setPairingCodeInput(input);
      setErrorMessage('');
    }
  };

  const validatePairingCode = async (code: string): Promise<boolean> => {
    try {
      const response = await axios.post('http://localhost:5000/validate_code', { code });
      return response.data.status === 'valid';
    } catch (error) {
      console.error('Error validating code:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    const isValid = await validatePairingCode(pairingCodeInput);
    if (isValid) {
      console.log('Pairing code is valid');
      setErrorMessage('');
      onPairingCodeSubmit(pairingCodeInput);
    } else {
      console.log('Invalid pairing code');
      setErrorMessage('Invalid pairing code. Please try again.');
      setPairingCodeInput('');
    }
  };

  const isMobileSafari = () => {
    return /iP(ad|od|hone)/i.test(navigator.platform) && /Safari/i.test(navigator.userAgent) && !/CriOS/i.test(navigator.userAgent);
  };

  return (
    <div className="settings-modal">
      <div className="title-container">
        <h2>GesturePresenter</h2>
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <p className="instructions">Enter your pairing code and adjust gesture settings. </p>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div>
        <label htmlFor="pairingCode">Pairing Code:</label>
        <input
          id="pairingCode"
          type="tel"
          pattern="[0-9]*"
          inputMode="numeric"
          value={pairingCodeInput}
          onChange={handlePairingCodeInputChange}
          autoComplete="off"
        />
      </div>
      <label htmlFor="gestureSwap">Swap Gesture Directions:</label>
      <div className="swap-container" onClick={onToggleGestureSwap}>
        <div className="instruction-container">
          <img src={instruction} alt="Instruction Left" className="instruction-img img-flip" />
          <span className="swap-label" style={{ color: flipped ? '#0ab20a' : '#ff0000'}}>
            {flipped ? 'Next' : 'Back'}
          </span>
        </div>
        <input
          id="gestureSwap"
          type="checkbox"
          checked={flipped}
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
      <button
        onClick={() => handleSubmit()}
        disabled={pairingCodeInput.length !== 4}
        className={`submit-button ${pairingCodeInput.length !== 4 ? 'disabled' : ''}`}
      >
        Submit
      </button>
    </div>
  );
};

export default SettingsModal;