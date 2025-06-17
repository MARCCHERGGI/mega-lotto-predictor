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
    .map(([num, count]) => ({
      number: Number(num),
      count,
      percentage: ((count / data.length) * 100).toFixed(2)
    }));

  const output = {
    timestamp: new Date().toISOString(),
    totalDraws: data.length,
    topNumbers: sorted.slice(0, 10).map(n => n.number),
    sorted
  };

  const outputPath = path.join('/tmp', 'patternHunter.json'); // ✅ Vercel-safe
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  return output;
}
