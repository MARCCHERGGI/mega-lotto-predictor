import runAgent from '../../agents/simulator';

export default async function handler(req, res) {
  try {
    const prediction = await runAgent();

    res.status(200).json({
      main: prediction.main,
      mega: prediction.mega,
      explanation: prediction.rawResponse
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
}
