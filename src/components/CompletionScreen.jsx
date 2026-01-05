import React, { useEffect } from 'react';

export default function CompletionScreen({ onHome }) {
    useEffect(() => {
        // Auto-redirect after 5 seconds? Or just let user click.
        // Let's just let user click.
    }, []);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: 'white',
            padding: '20px',
            textAlign: 'center'
        }}>
            <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'var(--accent-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '30px',
                boxShadow: '0 0 30px rgba(46, 213, 115, 0.4)'
            }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>

            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Ottimo Lavoro!</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '18px' }}>
                Hai completato il tuo allenamento di oggi.
            </p>

            <button
                onClick={onHome}
                style={{
                    background: 'var(--primary-gradient)',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '16px 40px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '100%',
                    maxWidth: '280px',
                    boxShadow: '0 4px 15px rgba(255, 71, 87, 0.3)'
                }}
            >
                Torna alla Home
            </button>
        </div>
    );
}
