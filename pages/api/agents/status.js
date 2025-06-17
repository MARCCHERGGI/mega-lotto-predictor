export default function handler(req, res) {
  res.status(200).json([
    { name: 'PatternHunter', lastUpdated: new Date().toLocaleTimeString(), status: 'OK' },
    { name: 'ClusterAgent', lastUpdated: new Date().toLocaleTimeString(), status: 'OK' },
    { name: 'TrendSeeker', lastUpdated: new Date().toLocaleTimeString(), status: 'OK' },
    { name: 'Simulator', lastUpdated: new Date().toLocaleTimeString(), status: 'OK' },
    { name: 'DrawEvaluator', lastUpdated: new Date().toLocaleTimeString(), status: 'OK' },
    { name: 'SelfAdjuster', lastUpdated: new Date().toLocaleTimeString(), status: 'Training' },
  ]);
}
