import React, { useState } from 'react';
import Camera from './Camera';
import SettingsModal from "./SettingsModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChrome, faGithub} from "@fortawesome/free-brands-svg-icons";

const App: React.FC = () => {
  const [flipped, setFlipped] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [pairingCode, setPairingCode] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const handlePairingCodeSubmit = (code: string) => {
    console.log("Pairing code submitted:", code);
    setPairingCode(code);
    setIsModalVisible(false);
  };

  const handleToggleGestureSwap = () => {
    setFlipped(!flipped);
  };

  return (
    <div>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      {isModalVisible && <div className="modal-overlay">
        <div className="additional-links">
          <a href="https://chromewebstore.google.com/detail/twiblocker-video-adblocke/mdohdkncgoaamplcaokhmlppgafhlima" target="_blank" rel="noopener noreferrer" title="Download Chrome Extension">
            <FontAwesomeIcon icon={faChrome} />
          </a>
          <a href="https://github.com/AnonymousAAArdvark/GesturePresenter" target="_blank" rel="noopener noreferrer" title="GitHub Repository">
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
      </div>}
      {isModalVisible &&  <SettingsModal
        onPairingCodeSubmit={handlePairingCodeSubmit}
        onToggleGestureSwap={handleToggleGestureSwap}
        flipped={flipped}
        pairingCode={pairingCode}
      />}
      <Camera
        pairingCode={pairingCode}
        flipped={flipped}
        onSettingsClick={showModal}
        modalVisible={isModalVisible}
      />
    </div>
  );
};

export default App;