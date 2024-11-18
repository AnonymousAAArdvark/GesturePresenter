import React, {useEffect, useState} from 'react';
import io, { Socket } from 'socket.io-client';
import logo from './assets/logo.png';
import instruction from './assets/instruction.png';

const SOCKET_SERVER_URL = 'http://localhost:5000';

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
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('paired', (data: PairingResponse) => {
        if (data.status === 'success') {
          console.log('Pairing successful');
          onPairingCodeSubmit(pairingCodeInput);
        } else {
          console.log('Pairing failed:', data.message);
        }
      });

      socket.on('error', (data: PairingResponse) => {
        console.error('Pairing error:', data.message);
      });

      return () => {
        socket.off('paired');
        socket.off('error');
      };
    }
  }, [socket, pairingCodeInput, onPairingCodeSubmit]);

  const handlePairingCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.match(/^\d{0,4}$/)) {
      setPairingCodeInput(input);
    }
  };

  const handleSubmit = () => {
    if (socket) {
      socket.emit('pair', { code: pairingCodeInput });
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
      <button onClick={() => handleSubmit()}>Submit</button>
    </div>
  );
};

export default SettingsModal;