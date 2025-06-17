import runCoreTrainer from './coreTrainer.js';

let isRunning = false;

export default async function runLoopRunner() {
  if (isRunning) return;
  isRunning = true;

  while (true) {
    try {
      await runCoreTrainer();
    } catch (err) {
      console.error('Loop crash:', err);
    }

    await new Promise(r => setTimeout(r, 15000)); // 15 seconds
  }
}
