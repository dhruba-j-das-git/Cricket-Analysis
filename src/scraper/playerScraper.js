import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import { CRICINFO_BASE_URL } from '../config/constants.js';
import httpClient from './httpClient.js';

// Limit concurrent requests
const limit = pLimit(2);

export async function scrapePlayerStats(matchId) {
  try {
    const response = await httpClient.get(`${CRICINFO_BASE_URL}/match/${matchId}/statistics`);
    const $ = cheerio.load(response.data);
    const playerStats = [];

    $('.player-stats').each((_, element) => {
      const stat = {
        matchId,
        playerId: $(element).attr('data-player-id'),
        name: $(element).find('.player-name').text().trim(),
        runs: $(element).find('.runs').text().trim(),
        wickets: $(element).find('.wickets').text().trim(),
        economy: $(element).find('.economy').text().trim()
      };
      
      if (stat.playerId) {
        playerStats.push(stat);
      }
    });

    return playerStats;
  } catch (error) {
    console.error(`Error scraping player stats for match ${matchId}:`, error.message);
    return [];
  }
}

export async function scrapeAllPlayerStats(matches) {
  const playerStats = [];
  const errors = [];

  // Process matches in parallel with rate limiting
  const promises = matches.map(match => 
    limit(async () => {
      try {
        const stats = await scrapePlayerStats(match.id);
        playerStats.push(...stats);
      } catch (error) {
        errors.push({ matchId: match.id, error: error.message });
      }
    })
  );

  await Promise.all(promises);

  if (errors.length > 0) {
    console.warn('Some matches failed to scrape:', errors);
  }

  return playerStats;
}