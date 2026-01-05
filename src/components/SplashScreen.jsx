import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

export default function SplashScreen({ onFinish }) {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpacity(0);
            setTimeout(onFinish, 1000); // Wait for fade out
        }, 2000); // Show for 2 seconds

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            opacity: opacity,
            transition: 'opacity 1s ease-in-out',
            pointerEvents: 'none'
        }}>
            <img src={logo} alt="Bend Abs Logo" style={{ width: '150px', height: '150px', marginBottom: '20px', borderRadius: '20%' }} />
            <h1 style={{
                fontSize: '32px',
                background: 'linear-gradient(to right, var(--accent-pink), var(--accent-green))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
            }}>Bend Abs</h1>
        </div>
    );
}
