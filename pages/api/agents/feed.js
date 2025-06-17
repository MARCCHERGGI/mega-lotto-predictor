import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const logPath = path.join('/tmp', 'thoughtFeed.json');

  let feed = [];

  if (fs.existsSync(logPath)) {
    try {
      const raw = fs.readFileSync(logPath, 'utf8');
      feed = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse feed log:', e);
    }
  }

  // Return the last 30 messages, newest first
  const recent = feed.slice(-30).reverse();

  res.status(200).json(recent);
}
