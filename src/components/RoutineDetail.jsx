
import React from 'react';
import { generateRoutine } from '../data/exercises';

export default function RoutineDetail({ duration, onStart, onBack }) {
    const routine = React.useMemo(() => generateRoutine(duration), [duration]);

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
            {/* Header */}
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
                <button
                    onClick={onBack}
                    style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', padding: '0' }}
                >
                    ✕
                </button>
                <span style={{ flex: 1, textAlign: 'center', fontWeight: '600', fontSize: '18px' }}>
                    Addominali {duration} Min
                </span>
                <div style={{ width: '24px' }}></div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px 20px' }}>
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                        {duration} MINUTI
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.4' }}>
                        Una routine intensa per scolpire i tuoi addominali.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {routine.map((ex, idx) => (
                        <div key={ex.uniqueId} style={{ display: 'flex', alignItems: 'center', opacity: ex.isRest ? 0.7 : 1 }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                backgroundColor: '#2c2c2e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '16px',
                                overflow: 'hidden',
                                border: ex.isRest ? '1px solid #444' : 'none'
                            }}>
                                <img src={ex.image} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'cover', padding: '8px' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600', fontSize: '16px' }}>{ex.name}</div>
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                {ex.duration < 60 ? `0:${ex.duration}` : '1:00'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Button Fixed Bottom */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px',
                background: 'linear-gradient(to top, #000 80%, transparent)',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <button
                    onClick={onStart}
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        backgroundColor: '#3b82f6', // Bright blue from screenshot
                        color: 'white',
                        border: 'none',
                        padding: '16px',
                        borderRadius: '30px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    INIZIA
                </button>
            </div>
        </div>
    );
}
