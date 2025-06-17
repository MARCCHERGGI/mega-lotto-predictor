import { useState } from 'react';

export default function Home() {
  const [combo, setCombo] = useState(null);

  const getNumbers = async () => {
    const res = await fetch('/api/predict');
    const data = await res.json();
    setCombo(data);
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
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          borderRadius: '12px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
        }}
        onMouseOver={(e) => (e.target.style.opacity = 0.8)}
        onMouseOut={(e) => (e.target.style.opacity = 1)}
      >
        Get My Numbers
      </button>

      {combo && (
        <div style={{ marginTop: '2rem', fontSize: '1.25rem' }}>
          <p>
            <strong>Main Numbers:</strong> {combo.main.join(', ')}
          </p>
          <p>
            <strong>Mega Ball:</strong> {combo.mega}
          </p>
        </div>
      )}
    </main>
  );
}
