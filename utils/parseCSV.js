import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function parseCSV() {
  const filePath = path.join(process.cwd(), 'data', 'megamillions.csv');
  const file = fs.readFileSync(filePath, 'utf8');

  const parsed = Papa.parse(file, {
    header: true,
    skipEmptyLines: true
  });

  return parsed.data.map(row => ({
    date: row['Draw Date'],
    main: row['Winning Numbers'],
    mega: row['Mega Ball']
  }));
}
