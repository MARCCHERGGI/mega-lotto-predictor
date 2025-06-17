import { parseCSV } from '../utils/parseCSV';
import fs from 'fs';
import path from 'path';
import { logThought } from '../utils/logThought';

export default async function runClusterAgent() {
  const data = await parseCSV();
  logThought('ClusterAgent', `Loaded ${data.length} draw records for gap analysis.`);

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

  const sorted = Object.entries(gapMap)
    .sort((a, b) => b[1] - a[1])
    .map(([gap, count]) => ({
      gap: Number(gap),
      count,
      percentage: ((count / totalGaps) * 100).toFixed(2),
    }));

  const topGaps = sorted.slice(0, 3).map(g => g.gap);

  const result = {
    timestamp: new Date().toISOString(),
    totalGaps,
    topGaps,
    sortedGaps: sorted,
  };

  const outputPath = path.join('/tmp', 'clusterAgent.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

  logThought('ClusterAgent', `Top gaps: ${topGaps.join(', ')} | Total gaps analyzed: ${totalGaps}`);

  return result;
}

