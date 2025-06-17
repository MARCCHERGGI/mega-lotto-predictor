import fs from 'fs';
import path from 'path';

export function logThought(agent, message) {
  const logPath = path.join('/tmp', 'thoughtFeed.json');

  let log = [];
  if (fs.existsSync(logPath)) {
    try {
      log = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    } catch {
      log = [];
    }
  }

  log.push({
    agent,
    message,
    time: new Date().toISOString()
  });

  fs.writeFileSync(logPath, JSON.stringify(log.slice(-100), null, 2));
}
