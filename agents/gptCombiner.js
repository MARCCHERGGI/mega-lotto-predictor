import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { logThought } from '../utils/logThought';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function loadLog(file) {
  const filePath = path.join('/tmp', file);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Failed to read ${file}:`, err);
    return null;
  }
}

export default async function runGPTCombiner() {
  logThought('GPTCombiner', '🤖 Gathering intel from all agents…');

  const pattern = loadLog('patternHunter.json')      || {};
  const cluster = loadLog('clusterAgent.json')       || {};
  const repeat  = loadLog('repetitionSniper.json')   || {};
  const sim     = loadLog('simulationRunner.json')   || {};
  const memory  = loadLog('drawMemory.json')         || [];

  // Extract each data piece safely
  const topFreqs   = pattern.topNumbers   || [];
  const topGaps    = cluster.topGaps      || [];
  const repeats    = repeat.repeats       || [];
  const simRate    = sim.matchRate        || 'Unknown';
  const lastMemory = memory.slice(-3).map(p => `[${p.main.join(',')}] MB:${p.mega}`);

  // Build prompt context
  const context = `
You are a lottery strategist AI. Use the data below to make a prediction.

Data:
- Top frequency numbers: ${topFreqs.join(', ') || 'None'}
- Most common gaps: ${topGaps.join(', ')   || 'None'}
- Recent repeats (num:count): ${
    repeats.map(r=>`${r.number}:${r.count}`).join(', ') || 'None'
  }
- Simulation match rate: ${simRate}
- Last 3 predictions: ${lastMemory.join(' | ') || 'None'}

Goal: Propose one Mega Millions combo.
Return exactly this format:

Reasoning: [short explanation]
Main: [n1,n2,n3,n4,n5]
Mega: n6
`;

  logThought('GPTCombiner', '✉️ Prompt ready, calling OpenAI…');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: context }],
    temperature: 1.1,
  });

  const reply = completion.choices[0].message.content;
  logThought('GPTCombiner', `🔍 Received reply snippet: ${reply.slice(0,80)}…`);

  // Parse out numbers
  const mainMatch = reply.match(/Main:\s*\[([^\]]+)\]/);
  const megaMatch = reply.match(/Mega:\s*(\d{1,2})/);

  const main = mainMatch
    ? mainMatch[1].split(',').map(n => parseInt(n.trim()))
    : [];
  const mega = megaMatch ? parseInt(megaMatch[1]) : null;

  logThought('GPTCombiner', `🎯 Final pick: [${main.join(', ')}] + MB ${mega}`);

  return {
    main,
    mega,
    explanation: reply.trim(),
  };
}
