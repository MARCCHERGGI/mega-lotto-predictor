import { parseCSV } from '../utils/parseCSV';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function runAgent() {
  const data = await parseCSV();

  // Collapse past draws into a string
  const history = data
    .slice(-100) // last 100 draws
    .map((row, i) => `#${i + 1}: ${row.main} | Mega: ${row.mega}`)
    .join('\n');

  // GPT prompt
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

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 1.1,
  });

  const reply = completion.choices[0].message.content;

  // Optional: extract numbers from response using regex
  const matchMain = reply.match(/Main: \[(.*?)\]/);
  const matchMega = reply.match(/Mega: (\d{1,2})/);

  const main = matchMain ? matchMain[1].split(',').map(n => parseInt(n.trim())) : [];
  const mega = matchMega ? parseInt(matchMega[1]) : null;

  return {
    main,
    mega,
    rawResponse: reply // optional: send raw GPT reply
  };
}
