import { useState } from 'react';

export default function Home() {
  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(false);

  const getNumbers = async () => {
    setLoading(true);
    const res = await fetch('/api/predict');
    const data = await res.json();
    setCombo(data);
    setLoading(false);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f8f8f8, #eaeaea)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        color: '#111',
        padding: '2rem',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          fontWeight: 600,
          marginBottom: '1.5rem',
          letterSpacing: '-0.03em',
        }}
      >
        Mega Millions Predictor
      </h1>

      <button
        onClick={getNumbers}
        disabled={loading}
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          borderRadius: '12px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          cursor: loading ? 'wait' : 'pointer',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Thinking...' : 'Get My Numbers'}
      </button>

      {combo && (
        <div style={{ marginTop: '2rem', fontSize: '1.25rem', maxWidth: '800px', textAlign: 'left' }}>
          <p>
            <strong>Main Numbers:</strong> {combo.main.join(', ')}
          </p>
          <p>
            <strong>Mega Ball:</strong> {combo.mega}
          </p>

          {combo.explanation && (
            <div
              style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 0 15px rgba(0,0,0,0.05)',
                whiteSpace: 'pre-wrap',
                overflowX: 'auto',
                fontSize: '0.95rem',
                lineHeight: '1.5',
              }}
            >
              <strong>🧠 Agent Reasoning:</strong>
              <div style={{ marginTop: '0.5rem' }}>{combo.explanation}</div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
