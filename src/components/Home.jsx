
import React from 'react';

export default function Home({ onSelectDuration }) {
    const options = [
        { label: '5 Minuti', value: 5, color: 'var(--accent-pink)' },
        { label: '10 Minuti', value: 10, color: 'var(--accent-green)' },
        { label: '15 Minuti', value: 15, color: 'var(--accent-yellow)' },
        { label: '20 Minuti', value: 20, color: 'var(--accent-orange)' },
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Allenamento Addominali</h1>
            </header>

            <section>
                <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '20px', letterSpacing: '1px' }}>
                    Durata
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => onSelectDuration(opt.value)}
                            style={{
                                backgroundColor: 'var(--card-bg)',
                                borderRadius: '20px',
                                padding: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                            }}
                        >
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    backgroundColor: opt.color,
                                    marginRight: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {/* Icon placeholder */}
                                <span style={{ fontSize: '20px', color: '#000' }}>{opt.value}</span>
                            </div>

                            <div>
                                <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600' }}>Allenamento {opt.value} min</h3>
                                <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                    Circuito completo
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
