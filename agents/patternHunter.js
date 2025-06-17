import { parseCSV } from '../utils/parseCSV';
import fs from 'fs';
import path from 'path';

export default async function runPatternHunter() {
  const data = await parseCSV();
  const freqMap = {};

  // Count frequency of each number
  data.forEach(draw => {
    draw.main.split(' ').forEach(num => {
      const n = parseInt(num);
      freqMap[n] = (freqMap[n] || 0) + 1;
    });
  });

  // Sort by frequency
  const sorted = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .map(([num, count]) => ({ number: Number(num), count }));

  // Save to public logs
  const outputPath = path.join(process.cwd(), 'public', 'logs', 'patternHunter.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2));

  return sorted;
}
