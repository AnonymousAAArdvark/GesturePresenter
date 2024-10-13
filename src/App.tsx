import React, { useState } from 'react';
import Camera from './Camera';
import SettingsModal from "./SettingsModal";

const App: React.FC = () => {
  const [flipped, setFlipped] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const handlePairingCodeSubmit = (code: string) => {
    console.log("Pairing code submitted:", code);
    // Handle the pairing code submission logic here
  };

  const handleToggleGestureSwap = () => {
    setFlipped(!flipped);
  };

  return (
    <div>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      {isModalVisible && <div className="modal-overlay"></div>}
      {isModalVisible &&  <SettingsModal
        onPairingCodeSubmit={handlePairingCodeSubmit}
        onToggleGestureSwap={handleToggleGestureSwap}
      />}
      <Camera flipped={flipped}/>
    </div>
  );
};

export default App;