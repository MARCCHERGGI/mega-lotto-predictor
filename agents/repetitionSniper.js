import { parseCSV } from '../utils/parseCSV';
import fs from 'fs';
import path from 'path';

export default async function runRepetitionSniper() {
  const data = await parseCSV();

  // Only check last 20 draws
  const recentDraws = data.slice(-20).map(draw =>
    draw.main.split(' ').map(Number)
  );

  const frequency = {};
  recentDraws.flat().forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
  });

  // Focus only on numbers that appeared 2+ times recently
  const repeats = Object.entries(frequency)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([num, count]) => ({ number: Number(num), count }));

  // Save to logs
  const outputPath = path.join(process.cwd(), 'public', 'logs', 'repetitionSniper.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(repeats, null, 2));

  return repeats;
}
