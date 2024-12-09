import { createObjectCsvWriter } from 'csv-writer';
import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';
import path from 'path';

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = './data';
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

export async function writeToCSV(data, filename) {
  await ensureDataDirectory();
  
  const csvWriter = createObjectCsvWriter({
    path: path.join('./data', filename),
    header: Object.keys(data[0]).map(key => ({ id: key, title: key }))
  });

  await csvWriter.writeRecords(data);
}

export async function readCSV(filename) {
  try {
    const content = await fs.readFile(path.join('./data', filename), 'utf-8');
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      cast: true
    });
  } catch (error) {
    console.error(`Error reading CSV file ${filename}:`, error);
    throw error;
  }
}