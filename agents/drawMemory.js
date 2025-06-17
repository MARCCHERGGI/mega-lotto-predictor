import fs from 'fs';
import path from 'path';

export default function storePrediction(prediction) {
  const logPath = path.join(process.cwd(), 'public', 'logs', 'drawMemory.json');

  // Ensure logs dir exists
  fs.mkdirSync(path.dirname(logPath), { recursive: true });

  let existing = [];
  if (fs.existsSync(logPath)) {
    const raw = fs.readFileSync(logPath, 'utf8');
    existing = JSON.parse(raw);
  }

  // Append new entry
  const entry = {
    timestamp: new Date().toISOString(),
    main: prediction.main,
    mega: prediction.mega,
    explanation: prediction.explanation || null
  };

  existing.push(entry);
  fs.writeFileSync(logPath, JSON.stringify(existing, null, 2));

  return entry;
}
