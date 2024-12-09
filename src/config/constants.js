export const CRICINFO_BASE_URL = 'https://www.espncricinfo.com';
export const MATCH_LIST_URL = `${CRICINFO_BASE_URL}/t20-world-cup/matches`;

// Scraping configuration
export const SCRAPING_CONFIG = {
  MAX_RETRIES: 5,
  RETRY_DELAY_MS: 1000,
  REQUEST_TIMEOUT_MS: 30000,
  CONCURRENT_REQUESTS: 2,
  RATE_LIMIT_MS: 2000
};

export const PLAYER_ROLES = {
  OPENER: 'opener',
  MIDDLE_ORDER: 'middle_order',
  FINISHER: 'finisher',
  ALL_ROUNDER: 'all_rounder',
  FAST_BOWLER: 'fast_bowler'
};

export const PERFORMANCE_METRICS = {
  BATTING: {
    STRIKE_RATE: 'strike_rate',
    AVERAGE: 'average',
    BOUNDARIES: 'boundaries_percentage'
  },
  BOWLING: {
    ECONOMY: 'economy',
    WICKETS_PER_MATCH: 'wickets_per_match',
    DEATH_OVERS_ECONOMY: 'death_overs_economy'
  }
};