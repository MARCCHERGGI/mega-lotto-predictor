import runPatternHunter from './patternHunter.js';
import runClusterAgent from './clusterAgent.js';
import runRepetitionSniper from './repetitionSniper.js';
import runSimulationRunner from './simulationRunner.js';
import runDrawMemory from './drawMemory.js';
import runGPTCombiner from './gptCombiner.js';
import { logThought } from '../utils/logThought.js';

export default async function runCoreTrainer() {
  try {
    logThought('CoreTrainer', '🧠 Starting full training sequence...');

    const pattern = await runPatternHunter();
    logThought('PatternHunter', '✅ Updated top number frequencies.');

    const cluster = await runClusterAgent();
    logThought('ClusterAgent', `✅ Identified top gap patterns: ${cluster.topGaps.join(', ')}`);

    const repeat = await runRepetitionSniper();
    logThought('RepetitionSniper', `✅ Found ${repeat.repeats.length} numbers repeated in last 20 draws.`);

    const sim = await runSimulationRunner();
    logThought('SimulationRunner', `✅ Simulation completed — ${sim.matchRate} hit rate.`);

    const prediction = await runGPTCombiner();
    logThought('GPTCombiner', '✅ GPT-based combination generated.');

    await runDrawMemory(prediction);
    logThought('DrawMemory', '📝 Logged prediction to memory.');

    logThought('CoreTrainer', '🏁 Training sequence complete.');
  } catch (error) {
    logThought('CoreTrainer', `❌ Error during training sequence: ${error.message}`);
    console.error('CoreTrainer error:', error);
  }
}

