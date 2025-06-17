import runCoreTrainer from './coreTrainer.js';
import { logThought } from '../utils/logThought.js';

let isRunning = false;

export default async function runLoopRunner() {
  if (isRunning) return;
  isRunning = true;

  while (true) {
    try {
      logThought('LoopRunner', '🔁 Starting next full cycle...');
      await runCoreTrainer();
      logThought('LoopRunner', '✅ CoreTrainer completed.');
    } catch (err) {
      logThought('LoopRunner', `❌ Crash in loop: ${err.message}`);
      console.error('Loop crash:', err);
    }

    await new Promise((r) => setTimeout(r, 15000)); // 15 seconds
  }
}
