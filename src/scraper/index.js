import { scrapeMatchList } from './matchScraper.js';
import { scrapeAllPlayerStats } from './playerScraper.js';
import { writeToCSV } from '../utils/csvHelper.js';

export async function startScraping() {
  console.log('Starting data scraping...');
  
  try {
    // Step 1: Get match list
    console.log('Fetching match list...');
    const matches = await scrapeMatchList();
    console.log(`Found ${matches.length} matches`);

    // Step 2: Scrape player stats
    console.log('Scraping player statistics...');
    const playerStats = await scrapeAllPlayerStats(matches);
    console.log(`Collected stats for ${playerStats.length} player performances`);

    // Step 3: Save data
    if (playerStats.length > 0) {
      await writeToCSV(playerStats, 'player_stats.csv');
      console.log('Player statistics saved successfully');
    } else {
      throw new Error('No player statistics were collected');
    }

    console.log('Scraping completed successfully!');
    return playerStats;
  } catch (error) {
    console.error('Scraping failed:', error.message);
    throw error;
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  startScraping();
}