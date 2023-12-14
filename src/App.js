import React, { useState } from 'react';
import LocationAndOrientation from './navigation/LocationOrientation';
import VideoCapture from './video/VideoCapture';
import NavigationDropdown from './navigation/NavigationDropdown';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [alpha, setAlpha] = useState(0); // State to hold the alpha value
  const [sessionId, setSessionId] = useState(uuidv4()); // Unique session ID

  const handleAlphaChange = (newAlpha) => {
    setAlpha(newAlpha); // Update the alpha state
  };

  const handleNavigationResult = (path, directions) => {
    console.log("Navigated Path:", path);
    console.log("Directions:", directions);
  };

  return (
    <div className="App">
      <header className="App-header">
        <LocationAndOrientation onAlphaChange={handleAlphaChange} />
        <VideoCapture sessionId={sessionId} onAlphaChange={handleAlphaChange} />
        <NavigationDropdown sessionId={sessionId} alpha={alpha} onNavigate={handleNavigationResult} />
      </header>
    </div>
  );
};

export default App;
