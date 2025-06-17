import { useState, useEffect } from 'react';

export default function Home() {
  const [combo, setCombo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agentStats, setAgentStats] = useState([]);
  const [thoughts, setThoughts] = useState([]);

  // 1️⃣ Trigger the background loop (once)
  useEffect(() => {
    fetch('/api/agents/trigger').catch(console.error);
  }, []);

  // 2️⃣ Fetch agent status
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/agents/status');
        const data = await res.json();
        setAgentStats(data);
      } catch {
        setAgentStats([]);
      }
    };
    fetchStats();
    const id = setInterval(fetchStats, 5000);
    return () => clearInterval(id);
  }, []);

  // 3️⃣ Fetch thought log
  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        const res = await fetch('/api/agents/feed');
        const data = await res.json();
        setThoughts(data);
      } catch {
        setThoughts([]);
      }
    };
    fetchThoughts();
    const id = setInterval(fetchThoughts, 10000);
    return () => clearInterval(id);
  }, []);

  // 4️⃣ On-demand prediction
  const getNumbers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/predict');
      const data = await res.json();
      setCombo(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f5f5f7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        padding: '3rem 1rem',
        color: '#000',
      }}
    >
      <h1
        style={{
          fontSize: '2.75rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em',
        }}
      >
        Mega Millions Predictor 🎯
      </h1>

      <button
        onClick={getNumbers}
        disabled={loading}
        style={{
          padding: '0.8rem 2.4rem',
          fontSize: '1.05rem',
          borderRadius: '16px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          cursor: loading ? 'wait' : 'pointer',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          opacity: loading ? 0.6 : 1,
          marginBottom: '2rem',
        }}
      >
        {loading ? 'Thinking...' : 'Generate My Winning Numbers'}
      </button>

      {combo && (
        <section style={{ marginBottom: '3rem', maxWidth: 800, textAlign: 'left' }}>
          <p style={{ fontSize: '1.25rem' }}>
            <strong>Main Numbers:</strong> {combo.main.join(', ')}
          </p>
          <p style={{ fontSize: '1.25rem' }}>
            <strong>Mega Ball:</strong> {combo.mega}
          </p>
          {combo.explanation && (
            <div
              style={{
                marginTop: '1.5rem',
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 0 20px rgba(0,0,0,0.05)',
                lineHeight: 1.6,
                fontSize: '0.95rem',
                whiteSpace: 'pre-wrap',
              }}
            >
              <strong>🤖 GPT Agent Reasoning:</strong>
              <div style={{ marginTop: '0.8rem' }}>{combo.explanation}</div>
            </div>
          )}
        </section>
      )}

      <section style={{ width: '100%', maxWidth: 900, marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📡 Agent System Monitor</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {agentStats.length === 0 && (
            <p style={{ fontStyle: 'italic', color: '#666' }}>Loading agent activity...</p>
          )}
          {agentStats.map((agent, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                padding: '1rem',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <strong>{agent.name}</strong>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Last update: {agent.lastUpdated}
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Status:{' '}
                <span style={{ color: agent.status === 'OK' ? 'green' : 'orange' }}>
                  {agent.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ width: '100%', maxWidth: 900 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🧠 Agent Thought Log</h2>
        <div
          style={{
            background: '#111',
            color: '#0f0',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            padding: '1rem',
            borderRadius: '12px',
            maxHeight: 300,
            overflowY: 'auto',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          }}
        >
          {thoughts.length === 0 ? (
            <p style={{ color: '#888', margin: 0 }}>Waiting for thoughts...</p>
          ) : (
            thoughts.map((t, i) => (
              <div key={i} style={{ marginBottom: '0.5rem' }}>
                [{new Date(t.time).toLocaleTimeString()}]{' '}
                <strong>{t.agent}</strong>: {t.message}
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
