import fs from 'fs';
import path from 'path';
import { logThought } from '../utils/logThought';

export default function storePrediction(prediction) {
  const logPath = path.join('/tmp', 'drawMemory.json'); // ✅ Vercel-safe

  let existing = [];
  if (fs.existsSync(logPath)) {
    try {
      const raw = fs.readFileSync(logPath, 'utf8');
      existing = JSON.parse(raw);
    } catch (e) {
      console.error('Error reading draw memory log:', e);
      existing = [];
    }
  }

  const entry = {
    timestamp: new Date().toISOString(),
    main: prediction.main,
    mega: prediction.mega,
    explanation: prediction.explanation || null,
  };

  existing.push(entry);

  try {
    fs.writeFileSync(logPath, JSON.stringify(existing, null, 2));
    logThought(
      'DrawMemory',
      `✅ Logged prediction: [${entry.main.join(', ')}] + Mega: ${entry.mega}`
    );
  } catch (e) {
    console.error('Failed to save drawMemory log:', e);
    logThought('DrawMemory', '⚠️ Failed to write prediction to memory.');
  }

  return entry;
}

