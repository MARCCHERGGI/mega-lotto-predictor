import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function loadLog(file) {
  const filePath = path.join('/tmp', file); // ✅ Read from /tmp
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read ${file}:`, err);
    return null;
  }
}

export default async function runGPTCombiner() {
  const pattern = loadLog('patternHunter.json');
  const cluster = loadLog('clusterAgent.json');
  const repeat = loadLog('repetitionSniper.json');
  const sim = loadLog('simulationRunner.json');
  const memory = loadLog('drawMemory.json');

  const context = `
You are a lottery strategist AI trained to optimize Mega Millions predictions using the latest agent intelligence.

Data:
- Top frequency numbers: ${pattern?.slice(0, 10).map(n => n.number).join(', ') || 'Unavailable'}
- Most common number gaps: ${cluster?.topGaps.join(', ') || 'N/A'}
- Recently repeated numbers: ${repeat?.map(r => `${r.number} (${r.count})`).join(', ') || 'None'}
- Simulation match rate: ${sim?.matchRate || 'Unknown'}
- Last 3 predictions: ${
    memory?.slice(-3).map(p => `[${p.main.join(', ')}] MB: ${p.mega}`).join(' | ') || 'None logged'
  }

Goal:
Predict the most promising Mega Millions combination today.
Return this format:
Main: [n, n, n, n, n]
Mega: n
Reasoning: [short explanation why these numbers are smart]
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: context }],
    temperature: 1.1
  });

  const reply = completion.choices[0].message.content;

  const mainMatch = reply.match(/Main:\s*\[(.*?)\]/);
  const megaMatch = reply.match(/Mega:\s*(\d{1,2})/);

  const main = mainMatch
    ? mainMatch[1].split(',').map(n => parseInt(n.trim()))
    : [];

  const mega = megaMatch ? parseInt(megaMatch[1]) : null;

  return {
    main,
    mega,
    explanation: reply
  };
}
