import runGPTCombiner from '../../agents/gptCombiner';
import storePrediction from '../../agents/drawMemory';

export default async function handler(req, res) {
  try {
    // Run only the GPT combiner agent
    const prediction = await runGPTCombiner();

    // Save result for long-term memory
    storePrediction(prediction);

    // Return response
    res.status(200).json({
      main: prediction.main,
      mega: prediction.mega,
      explanation: prediction.explanation
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed.' });
  }
}
