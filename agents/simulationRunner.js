import fs from 'fs';
import path from 'path';
import { logThought } from '../utils/logThought';

export default async function runSimulationRunner() {
  const patternPath = path.join('/tmp', 'patternHunter.json'); // ✅ Vercel-safe temp storage
  if (!fs.existsSync(patternPath)) {
    logThought('SimulationRunner', '⚠️ PatternHunter data not found.');
    return { error: 'Pattern data unavailable' };
  }

  const patternData = JSON.parse(fs.readFileSync(patternPath, 'utf8'));
  const topNumbers = patternData.topNumbers || patternData.slice(0, 10).map(n => n.number);

  logThought('SimulationRunner', `🔄 Running 10,000 simulations with top ${topNumbers.length} numbers.`);

  const simulations = [];
  let hits = 0;

  for (let i = 0; i < 10000; i++) {
    const draw = new Set();
    while (draw.size < 5) {
      draw.add(Math.floor(Math.random() * 70) + 1);
    }

    const matchCount = [...draw].filter(n => topNumbers.includes(n)).length;
    if (matchCount >= 2) hits++;

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
    sampleDraws: simulations,
  };

  const outputPath = path.join('/tmp', 'simulationRunner.json'); // ✅ Vercel-safe
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  logThought('SimulationRunner', `✅ Simulation complete with match rate: ${output.matchRate}`);

  return output;
}
