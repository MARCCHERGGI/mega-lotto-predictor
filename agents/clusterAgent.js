import { parseCSV } from '../utils/parseCSV';
import fs from 'fs';
import path from 'path';

export default async function runClusterAgent() {
  const data = await parseCSV();
  const gapMap = {};
  let totalGaps = 0;

  data.forEach(draw => {
    const nums = draw.main
      .split(' ')
      .map(Number)
      .sort((a, b) => a - b);

    for (let i = 0; i < nums.length - 1; i++) {
      const gap = nums[i + 1] - nums[i];
      gapMap[gap] = (gapMap[gap] || 0) + 1;
      totalGaps++;
    }
  });

  // Sort gaps by frequency
  const sorted = Object.entries(gapMap)
    .sort((a, b) => b[1] - a[1])
    .map(([gap, count]) => ({
      gap: Number(gap),
      count,
      percentage: ((count / totalGaps) * 100).toFixed(2)
    }));

  // Pick top 3 most common gaps
  const topGaps = sorted.slice(0, 3).map(g => g.gap);

  const result = {
    timestamp: new Date().toISOString(),
    totalGaps,
    topGaps,
    sortedGaps: sorted
  };

  const outputPath = path.join('/tmp', 'clusterAgent.json'); // ✅ Vercel-safe path
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  return result;
}
