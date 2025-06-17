import { parseCSV } from '../utils/parseCSV';

export default async function runAgent() {
  const data = await parseCSV();

  const frequencies = new Map();
  data.forEach(draw => {
    const nums = draw.main.split(' ').map(Number);
    nums.forEach(n => frequencies.set(n, (frequencies.get(n) || 0) + 1));
  });

  const sorted = [...frequencies.entries()].sort((a, b) => b[1] - a[1]);
  const likely = sorted.slice(0, 10).map(x => x[0]);

  const main = [];
  while (main.length < 5) {
    const pick = likely[Math.floor(Math.random() * likely.length)];
    if (!main.includes(pick)) main.push(pick);
  }

  const mega = Math.floor(Math.random() * 25) + 1;
  return { main, mega };
}
