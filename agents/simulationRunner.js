import fs from 'fs';
import path from 'path';

export default async function runSimulationRunner() {
  const patternPath = path.join('/tmp', 'patternHunter.json'); // ✅ Use Vercel-safe temp storage
  if (!fs.existsSync(patternPath)) {
    console.warn('⚠️ PatternHunter data not found.');
    return { error: 'Pattern data unavailable' };
  }

  const patternData = JSON.parse(fs.readFileSync(patternPath, 'utf8'));
  const topNumbers = patternData.slice(0, 10).map(n => n.number);

  const simulations = [];
  let hits = 0;

  for (let i = 0; i < 10000; i++) {
    const draw = new Set();
    while (draw.size < 5) {
      draw.add(Math.floor(Math.random() * 70) + 1);
    }

    const matchCount = [...draw].filter(n => topNumbers.includes(n)).length;
    if (matchCount >= 2) hits++;

    // Log every 1000th draw only (to save memory)
    if (i % 1000 === 0) {
      simulations.push({ id: i, draw: [...draw], matches: matchCount });
    }
  }

  const output = {
    timestamp: new Date().toISOString(),
    topPatternCount: topNumbers.length,
    totalSimulations: 10000,
    match2Plus: hits,
    matchRate: `${((hits / 10000) * 100).toFixed(2)}%`,
    sampleDraws: simulations
  };

  const outputPath = path.join('/tmp', 'simulationRunner.json'); // ✅ Vercel-safe
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  return output;
}
