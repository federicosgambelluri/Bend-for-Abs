
import React, { useState, useEffect } from 'react';
import { generateRoutine } from '../data/exercises';

export default function Player({ duration, onExit }) {
    const [routine, setRoutine] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [showSecondImage, setShowSecondImage] = useState(false);

    // Improved Audio Context
    const [audioContext, setAudioContext] = useState(null);

    useEffect(() => {
        const r = generateRoutine(duration);
        setRoutine(r);
        if (r.length > 0) {
            setTimeLeft(r[0].duration);
            setIsReady(true);
        }
    }, [duration]);

    // Initialize AudioContext on user interaction (start)
    const initAudio = () => {
        if (!audioContext) {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            setAudioContext(ctx);
            // Resume if suspended (browser policy)
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
        } else if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    };

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

    // Image Alternator
    useEffect(() => {
        let interval = null;
        if (isPlaying && !routine[currentIndex]?.isRest && routine[currentIndex]?.image2) {
            interval = setInterval(() => {
                setShowSecondImage(prev => !prev);
            }, 3000);
        } else {
            setShowSecondImage(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentIndex, routine]);


    // Audio Effect
    useEffect(() => {
        if (isPlaying && timeLeft > 0 && timeLeft <= 3) {
            playBeep();
        }
    }, [timeLeft, isPlaying]);

    const playBeep = () => {
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz beep

        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    };

    if (!isReady || routine.length === 0) return <div>Caricamento...</div>;

    const currentExercise = routine[currentIndex];

    // Counters
    // Count only actual exercises (not rests)
    const totalExercises = routine.filter(e => !e.isRest).length;
    const currentExerciseNumber = routine.slice(0, currentIndex + 1).filter(e => !e.isRest).length;
    // For rest, show progress to next exercise
    const displayCount = currentExercise.isRest ? currentExerciseNumber : currentExerciseNumber;
    // Wait, if rest, we are BETWEEN exercise X and X+1. User sees "Rest". Logic:
    // If rest, we act as if we are still on previous index or preparing for next? 
    // User requested: "1 of 15". If rest, maybe hide or show "Next: 2 of 15"
    // Let's just show the number of the *upcoming* exercise if rest, or current if exercise.
    // If I just finished Ex 1, now Rest. Next is Ex 2. So showing "2 of 15" during rest makes sense as preparation?
    // Or just show total: "x / y" where y is total EXERCISES.

    const countText = currentExercise.isRest
        ? `Riposo`
        : `${currentExerciseNumber} di ${totalExercises}`;

    // Circular Timer Logic
    const radius = 134; // Slightly roughly fits inside 280px (280/2 = 140) minus stroke
    const circumference = 2 * Math.PI * radius;
    const initialDuration = currentExercise.duration;
    // We need to track initial duration because timeLeft changes.
    // However, exercises have 'duration' prop which is fixed IN THIS CASE (exercises.js returns new objects)
    // BUT routine[currentIndex].duration IS fixed. timeLeft is state.
    const progress = timeLeft / routine[currentIndex].duration;
    const strokeDashoffset = circumference - (progress * circumference);
    // User wants circle to REDUCE as time drops (or exact opposite).
    // "riducesso man mano che il tempo cala" -> Reduce as time drops.
    // If progress is 1 (full), offset should be 0 (full circle).
    // If progress is 0, offset should be circumference (empty).
    // Current formula: offset = C - (1 * C) = 0. Correct.
    // offset = C - (0 * C) = C. Correct.

    // Next Exercise Preview (for Rest)
    const nextExercise = currentIndex < routine.length - 1 ? routine[currentIndex + 1] : null;

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: '#000'
        }}>
            {/* Header */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
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
                    {countText}
                </div>
                <div style={{ width: '40px' }}></div>
            </div>

            {/* Rest Preview Card */}
            {currentExercise.isRest && nextExercise && (
                <div style={{
                    position: 'absolute',
                    top: '90px',
                    right: '25px',
                    background: 'var(--card-bg)',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                    maxWidth: '220px',
                    zIndex: 20
                }}>
                    <img src={nextExercise.image} alt="Next" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '2px' }}>Prossimo</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: '1.2' }}>{nextExercise.name}</div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative'
            }}>

                {/* Timer Text */}
                <div style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '16px', fontVariantNumeric: 'tabular-nums' }}>
                    {timeLeft}
                </div>

                {/* Circle Container */}
                <div style={{
                    width: '280px',
                    height: '280px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '40px',
                    position: 'relative'
                }}>
                    {/* SVG Circle */}
                    <svg
                        width="280"
                        height="280"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            transform: 'rotate(-90deg)'
                        }}
                    >
                        <circle
                            cx="140"
                            cy="140"
                            r={radius}
                            stroke="#333"
                            strokeWidth="6"
                            fill="none"
                        />
                        <circle
                            cx="140"
                            cy="140"
                            r={radius}
                            stroke={currentExercise.isRest ? 'var(--accent-green)' : 'var(--accent-pink)'}
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 1s linear' }}
                        />
                    </svg>

                    {/* Image Inner Circle */}
                    <div style={{
                        width: '250px',
                        height: '250px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backgroundColor: '#1c1c1e',
                        zIndex: 1
                    }}>
                        <img
                            src={showSecondImage && currentExercise.image2 ? currentExercise.image2 : currentExercise.image}
                            alt={currentExercise.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transform: 'scale(1.3)'
                            }}
                        />
                    </div>
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
                    onClick={() => {
                        if (!isPlaying) initAudio();
                        setIsPlaying(!isPlaying);
                    }}
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
