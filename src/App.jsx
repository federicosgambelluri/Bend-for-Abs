
import React, { useState } from 'react';
import Home from './components/Home';
import RoutineDetail from './components/RoutineDetail';
import Player from './components/Player';
import './index.css';

function App() {
  const [duration, setDuration] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // App States:
  // 1. Home (duration === null)
  // 2. Detail (duration !== null, isPlaying === false)
  // 3. Player (duration !== null, isPlaying === true)

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
