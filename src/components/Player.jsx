
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

    // Audio Context State
    const [audioCtx, setAudioCtx] = useState(null);

    useEffect(() => {
        // Initialize AudioContext on mount (or first interaction)
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        setAudioCtx(ctx);
        return () => {
            if (ctx.state !== 'closed') ctx.close();
        };
    }, []);

    useEffect(() => {
        if (isPlaying && timeLeft > 0 && timeLeft <= 3) {
            playBeep();
        }
    }, [timeLeft, isPlaying]);

    const playBeep = () => {
        if (!audioCtx) return;

        // Ensure context is running (needed for mobile browsers)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime); // Increase volume
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15);
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
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
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        opacity: currentIndex === 0 ? 0.3 : 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="19 20 9 12 19 4 19 20" fill="currentColor" stroke="none"></polygon>
                        <line x1="5" y1="19" x2="5" y2="5"></line>
                    </svg>
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
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {isPlaying ? (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                    ) : (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5 3.86828C5 2.54142 6.42586 1.70327 7.5857 2.34515L20.897 9.71343C22.0837 10.3702 22.0837 12.0829 20.897 12.7397L7.5857 20.108C6.42586 20.7499 5 19.9117 5 18.5849V3.86828Z" />
                        </svg>
                    )}
                </button>

                <button
                    onClick={() => {
                        if (currentIndex < routine.length - 1) {
                            const next = currentIndex + 1;
                            setCurrentIndex(next);
                            setTimeLeft(routine[next].duration);
                        }
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        opacity: currentIndex === routine.length - 1 ? 0.3 : 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" stroke="none"></polygon>
                        <line x1="19" y1="5" x2="19" y2="19"></line>
                    </svg>
                </button>
            </div>
        </div>
    );
}
