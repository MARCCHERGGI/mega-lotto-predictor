import { parseCSV } from '../utils/parseCSV';
import fs from 'fs';
import path from 'path';

export default async function runClusterAgent() {
  const data = await parseCSV();
  const gapMap = {};

  data.forEach(draw => {
    const nums = draw.main
      .split(' ')
      .map(Number)
      .sort((a, b) => a - b);

    for (let i = 0; i < nums.length - 1; i++) {
      const gap = nums[i + 1] - nums[i];
      gapMap[gap] = (gapMap[gap] || 0) + 1;
    }
  });

  // Sort gaps by frequency
  const sorted = Object.entries(gapMap)
    .sort((a, b) => b[1] - a[1])
    .map(([gap, count]) => ({ gap: Number(gap), count }));

  // Save to public logs
  const outputPath = path.join(process.cwd(), 'public', 'logs', 'clusterAgent.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2));

  return sorted;
}
