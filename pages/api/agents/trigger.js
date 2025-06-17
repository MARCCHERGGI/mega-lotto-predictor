import runLoopRunner from '../../../agents/loopRunner.js';

let started = false;

export default function handler(req, res) {
  if (!started) {
    runLoopRunner();
    started = true;
    console.log('🚀 Background agent loop started.');
  }

  res.status(200).json({ status: 'Loop active' });
}
