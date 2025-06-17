import { parseCSV } from '../utils/parseCSV';
import { OpenAI } from 'openai';
import { logThought } from '../utils/logThought';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function runAgent() {
  logThought('Simulator', '🔍 Loading last 100 draws for GPT prompt.');

  const data = await parseCSV();

  // Collapse past draws into a string for prompt
  const history = data
    .slice(-100)
    .map((row, i) => `#${i + 1}: ${row.main} | Mega: ${row.mega}`)
    .join('\n');

  const prompt = `
You are a Mega Millions prediction model.

Below is a history of the last 100 draws:

${history}

Based on frequency, gaps, and probabilistic reasoning — suggest one new combination of 5 main numbers (1–70) and 1 Mega Ball (1–25). Explain your reasoning very briefly, then list only the final numbers.

Format:
Reasoning: ...
Main: [n1, n2, n3, n4, n5]
Mega: n6
`;

  logThought('Simulator', '🤖 Sending prompt to OpenAI GPT-4 for prediction.');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 1.1,
  });

  const reply = completion.choices[0].message.content;

  const matchMain = reply.match(/Main: \[(.*?)\]/);
  const matchMega = reply.match(/Mega: (\d{1,2})/);

  const main = matchMain ? matchMain[1].split(',').map(n => parseInt(n.trim())) : [];
  const mega = matchMega ? parseInt(matchMega[1]) : null;

  logThought('Simulator', `🎯 GPT prediction generated: Main [${main.join(', ')}], Mega ${mega}`);

  return {
    main,
    mega,
    rawResponse: reply,
  };
}
