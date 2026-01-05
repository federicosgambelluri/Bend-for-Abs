import React, { useState } from 'react';
import Home from './components/Home';
import RoutineDetail from './components/RoutineDetail';
import Player from './components/Player';
import SplashScreen from './components/SplashScreen';
import './index.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [duration, setDuration] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // App States:
  // 1. Splash Screen
  // 2. Home (duration === null)
  // 3. Detail (duration !== null, isPlaying === false)
  // 4. Player (duration !== null, isPlaying === true)

  const handleSelectDuration = (val) => {
    setDuration(val);
    setIsPlaying(false);
  };

  const handleStart = () => {
    setIsPlaying(true);
  };

  const handleBack = () => {
    setDuration(null);
    setIsPlaying(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="app-container">
      {!duration ? (
        <Home onSelectDuration={handleSelectDuration} />
      ) : !isPlaying ? (
        <RoutineDetail duration={duration} onStart={handleStart} onBack={handleBack} />
      ) : (
        <Player duration={duration} onExit={handleBack} />
      )}
    </div>
  );
}

export default App;
