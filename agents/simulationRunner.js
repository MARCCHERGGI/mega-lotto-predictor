import fs from 'fs';
import path from 'path';

export default async function runSimulationRunner() {
  const patternPath = path.join(process.cwd(), 'public', 'logs', 'patternHunter.json');
  if (!fs.existsSync(patternPath)) {
    console.warn('PatternHunter data not found.');
    return [];
  }

  const patternData = JSON.parse(fs.readFileSync(patternPath, 'utf8'));
  const topNumbers = patternData.slice(0, 10).map(n => n.number);

  let hits = 0;
  const simulations = [];

  for (let i = 0; i < 10000; i++) {
    const draw = new Set();
    while (draw.size < 5) {
      draw.add(Math.floor(Math.random() * 70) + 1);
    }
    const overlap = [...draw].filter(n => topNumbers.includes(n));
    if (overlap.length >= 2) hits++; // 2+ match with top pattern numbers
    simulations.push({ draw: [...draw], matches: overlap.length });
  }

  const output = {
    totalSimulations: simulations.length,
    match2Plus: hits,
    matchRate: `${((hits / simulations.length) * 100).toFixed(2)}%`
  };

  // Save to logs
  const outputPath = path.join(process.cwd(), 'public', 'logs', 'simulationRunner.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  return output;
}
