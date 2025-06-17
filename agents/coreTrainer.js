import runPatternHunter from './patternHunter.js';
import runClusterAgent from './clusterAgent.js';
import runRepetitionSniper from './repetitionSniper.js';
import runSimulationRunner from './simulationRunner.js';
import runDrawMemory from './drawMemory.js';
import runGPTCombiner from './gptCombiner.js';
import fs from 'fs';
import path from 'path';

export default async function runCoreTrainer() {
  const thoughts = [];

  const pattern = await runPatternHunter();
  thoughts.push({ agent: 'PatternHunter', message: 'Updated top frequencies.', time: new Date().toISOString() });

  const cluster = await runClusterAgent();
  thoughts.push({ agent: 'ClusterAgent', message: 'Analyzed number gaps.', time: new Date().toISOString() });

  const repeat = await runRepetitionSniper();
  thoughts.push({ agent: 'RepetitionSniper', message: `Found ${repeat.repeats.length} repeating numbers.`, time: new Date().toISOString() });

  const sim = await runSimulationRunner();
  thoughts.push({ agent: 'SimulationRunner', message: `Match rate: ${sim.matchRate}`, time: new Date().toISOString() });

  const prediction = await runGPTCombiner();
  const memory = runDrawMemory(prediction);
  thoughts.push({ agent: 'GPTCombiner', message: 'Generated prediction using GPT and memory.', time: new Date().toISOString() });

  // Save thoughts to shared feed
  const logPath = path.join('/tmp', 'systemFeed.json');
  const existing = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : [];
  existing.push(...thoughts.slice(-10));
  fs.writeFileSync(logPath, JSON.stringify(existing.slice(-50), null, 2)); // Keep last 50 thoughts

  return thoughts;
}
