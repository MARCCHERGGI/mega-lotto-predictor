import { parseCSV } from '../utils/parseCSV';
import fs from 'fs';
import path from 'path';

export default async function runRepetitionSniper() {
  const data = await parseCSV();
  const recentDraws = data.slice(-20).map(draw =>
    draw.main.split(' ').map(Number)
  );

  const frequency = {};
  recentDraws.flat().forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
  });

  const repeats = Object.entries(frequency)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([num, count]) => ({
      number: Number(num),
      count,
      percentage: ((count / 20) * 100).toFixed(2)
    }));

  const result = {
    timestamp: new Date().toISOString(),
    drawsAnalyzed: 20,
    repeats,
    top: repeats.slice(0, 5).map(n => n.number)
  };

  const outputPath = path.join('/tmp', 'repetitionSniper.json'); // ✅ Vercel-safe
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  return result;
}
