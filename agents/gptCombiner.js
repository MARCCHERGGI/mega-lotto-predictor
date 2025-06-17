import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function loadLog(file) {
  const logPath = path.join(process.cwd(), 'public', 'logs', file);
  if (!fs.existsSync(logPath)) return null;
  return JSON.parse(fs.readFileSync(logPath, 'utf8'));
}

export default async function runGPTCombiner() {
  const pattern = loadLog('patternHunter.json');
  const cluster = loadLog('clusterAgent.json');
  const repeat = loadLog('repetitionSniper.json');
  const sim = loadLog('simulationRunner.json');
  const memory = loadLog('drawMemory.json');

  const context = `
You are a lottery prediction strategist.

Here is current analysis data:
- Top frequent numbers: ${pattern?.slice(0, 10).map(n => n.number).join(', ')}
- Most common gaps: ${cluster?.slice(0, 5).map(g => g.gap).join(', ')}
- Repeating numbers from last 20 draws: ${repeat?.map(r => `${r.number}(${r.count})`).join(', ')}
- Simulation success rate: ${sim?.matchRate}
- Past 3 predictions: ${
    memory?.slice(-3).map(m => `[${m.main.join(', ')}] Mega: ${m.mega}`).join(' | ') || 'None'
  }

Now:
Generate one new prediction based on this data.
Output 5 main numbers (1–70) and 1 Mega Ball (1–25).
Then explain your reasoning.
Format:
Main: [x, x, x, x, x]
Mega: x
Reasoning: ...
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: context }],
    temperature: 1.1
  });

  const reply = completion.choices[0].message.content;

  const mainMatch = reply.match(/Main: \[(.*?)\]/);
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
