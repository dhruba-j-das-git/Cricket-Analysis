import { startScraping } from './scraper/index.js';
import { startProcessing } from './processor/index.js';
import { startAnalysis } from './analyzer/index.js';

async function main() {
  try {
    console.log('Starting T20 Cricket Analysis...');
    
    // Step 1: Scrape data
    await startScraping();
    
    // Step 2: Process data
    await startProcessing();
    
    // Step 3: Analyze and select top eleven
    const topEleven = await startAnalysis();
    
    console.log('\nSelected Top Eleven Players:');
    console.log('---------------------------');
    console.log('Openers:', topEleven.openers.map(p => p.name).join(', '));
    console.log('Middle Order:', topEleven.middleOrder.map(p => p.name).join(', '));
    console.log('Finishers:', topEleven.finishers.map(p => p.name).join(', '));
    console.log('All-Rounders:', topEleven.allRounders.map(p => p.name).join(', '));
    console.log('Fast Bowlers:', topEleven.fastBowlers.map(p => p.name).join(', '));
    
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}