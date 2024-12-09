import * as cheerio from 'cheerio';
import { MATCH_LIST_URL } from '../config/constants.js';
import httpClient from './httpClient.js';

export async function scrapeMatchList() {
  try {
    console.log('Fetching match list from:', MATCH_LIST_URL);
    const response = await httpClient.get(MATCH_LIST_URL);
    
    if (!response.data) {
      throw new Error('No data received from the server');
    }

    const $ = cheerio.load(response.data);
    const matches = [];

    // More specific selector for T20 World Cup matches
    $('.match-score-FIXTURES').each((_, element) => {
      try {
        const $element = $(element);
        const match = {
          id: $element.attr('data-match-id'),
          teams: $element.find('.teams').text().trim(),
          date: $element.find('.date-time').text().trim(),
          venue: $element.find('.venue').text().trim(),
          format: $element.find('.match-format').text().trim()
        };
        
        // Only include T20 World Cup matches
        if (match.id && match.format.includes('T20')) {
          matches.push(match);
          console.log(`Found match: ${match.teams} at ${match.venue}`);
        }
      } catch (parseError) {
        console.warn('Error parsing match element:', parseError.message);
      }
    });

    if (matches.length === 0) {
      throw new Error('No matches found. The page structure might have changed.');
    }

    console.log(`Successfully scraped ${matches.length} matches`);
    return matches;
  } catch (error) {
    console.error('Error scraping match list:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw new Error(`Failed to scrape match list: ${error.message}`);
  }
}