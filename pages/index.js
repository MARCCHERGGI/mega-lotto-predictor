import { useState } from 'react';

export default function Home() {
  const [combo, setCombo] = useState(null);

  const getNumbers = async () => {
    const res = await fetch('/api/predict');
    const data = await res.json();
    setCombo(data);
  };

  return (
    <main style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Mega Millions Predictor</h1>
      <button onClick={getNumbers}>Get My Numbers</button>
      {combo && (
        <>
          <h2>Main Numbers: {combo.main.join(', ')}</h2>
          <h2>Mega Ball: {combo.mega}</h2>
        </>
      )}
    </main>
  );
}
