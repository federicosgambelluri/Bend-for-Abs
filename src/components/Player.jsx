
import React, { useState, useEffect } from 'react';
import { generateRoutine } from '../data/exercises';

export default function Player({ duration, onExit }) {
    const [routine, setRoutine] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const r = generateRoutine(duration);
        setRoutine(r);
        if (r.length > 0) {
            setTimeLeft(r[0].duration);
            setIsReady(true);
        }
    }, [duration]);

    useEffect(() => {
        let interval = null;
        if (isPlaying && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isReady && routine.length > 0) {
            // Move to next
            if (currentIndex < routine.length - 1) {
                const nextIndex = currentIndex + 1;
                setCurrentIndex(nextIndex);
                setTimeLeft(routine[nextIndex].duration);
            } else {
                setIsPlaying(false);
                // Completed
            }
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeLeft, currentIndex, routine, isReady]);

    useEffect(() => {
        if (isPlaying && timeLeft > 0 && timeLeft <= 3) {
            playBeep();
        }
    }, [timeLeft, isPlaying]);

    const playBeep = () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // 800Hz beep
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    };

    if (!isReady || routine.length === 0) return <div>Caricamento...</div>;

    const currentExercise = routine[currentIndex];
    // Calculate Progress
    const totalDuration = routine.reduce((acc, curr) => acc + curr.duration, 0);
    const completedDuration = routine.slice(0, currentIndex).reduce((acc, curr) => acc + curr.duration, 0) + (currentExercise.duration - timeLeft);
    const progress = (completedDuration / totalDuration) * 100;

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: '#000'
        }}>
            {/* Header */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={onExit}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        color: 'white',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '20px'
                    }}
                >
                    ×
                </button>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                    {currentIndex + 1} di {routine.length}
                </div>
                <div style={{ width: '40px' }}></div> {/* Spacer */}
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}>

                {/* Timer Text Outside */}
                <div style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '16px', fontVariantNumeric: 'tabular-nums' }}>
                    {timeLeft}
                </div>

                {/* Circle with Image Inside */}
                <div style={{
                    width: '280px',
                    height: '280px',
                    borderRadius: '50%',
                    border: `6px solid ${currentExercise.isRest ? 'var(--accent-green)' : 'var(--accent-pink)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '40px',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#1c1c1e'
                }}>
                    <img
                        src={currentExercise.image}
                        alt={currentExercise.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: 'scale(1.3)'
                        }}
                    />
                </div>

                <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>{currentExercise.name}</h2>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '300px' }}>
                    {currentExercise.description}
                </p>
            </div>

            {/* Controls */}
            <div style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center', gap: '30px', alignItems: 'center' }}>
                <button
                    onClick={() => {
                        if (currentIndex > 0) {
                            const prev = currentIndex - 1;
                            setCurrentIndex(prev);
                            setTimeLeft(routine[prev].duration);
                        }
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer', opacity: currentIndex === 0 ? 0.3 : 1 }}
                >
                    ⏮
                </button>

                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--card-bg)',
                        border: 'none',
                        color: 'white',
                        fontSize: '32px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>

                <button
                    onClick={() => {
                        if (currentIndex < routine.length - 1) {
                            const next = currentIndex + 1;
                            setCurrentIndex(next);
                            setTimeLeft(routine[next].duration);
                        }
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer', opacity: currentIndex === routine.length - 1 ? 0.3 : 1 }}
                >
                    ⏭
                </button>
            </div>
        </div>
    );
}
