import React from 'react';
import Camera from './Camera';


const App: React.FC = () => {
  return (
    <div>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <Camera flipped={false}/>
    </div>
  );
};

export default App;