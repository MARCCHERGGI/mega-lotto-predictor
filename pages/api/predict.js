import runAgent from '../../agents/simulator';

export default async function handler(req, res) {
  const prediction = await runAgent();
  res.status(200).json(prediction);
}
