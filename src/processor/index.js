import { parse } from 'csv-parse/sync';
import { readCSV, writeToCSV } from '../utils/csvHelper.js';

function calculateBattingMetrics(playerData) {
  const battingStats = {};
  
  playerData.forEach(match => {
    const playerId = match.playerId;
    if (!battingStats[playerId]) {
      battingStats[playerId] = {
        playerId,
        name: match.name,
        runs: 0,
        balls: 0,
        dismissals: 0,
        matches: new Set()
      };
    }
    
    const stats = battingStats[playerId];
    stats.runs += parseInt(match.runs) || 0;
    stats.balls += parseInt(match.balls) || 0;
    stats.dismissals += match.dismissed === 'true' ? 1 : 0;
    stats.matches.add(match.matchId);
  });

  return Object.values(battingStats).map(stats => ({
    playerId: stats.playerId,
    name: stats.name,
    total_runs: stats.runs,
    strike_rate: stats.balls > 0 ? (stats.runs / stats.balls) * 100 : 0,
    average: stats.dismissals > 0 ? stats.runs / stats.dismissals : stats.runs,
    matches_played: stats.matches.size
  }));
}

function calculateBowlingMetrics(playerData) {
  const bowlingStats = {};
  
  playerData.forEach(match => {
    const playerId = match.playerId;
    if (!bowlingStats[playerId]) {
      bowlingStats[playerId] = {
        playerId,
        name: match.name,
        wickets: 0,
        runs_conceded: 0,
        overs: 0,
        matches: new Set()
      };
    }
    
    const stats = bowlingStats[playerId];
    stats.wickets += parseInt(match.wickets) || 0;
    stats.runs_conceded += parseInt(match.runs_conceded) || 0;
    stats.overs += parseFloat(match.overs) || 0;
    stats.matches.add(match.matchId);
  });

  return Object.values(bowlingStats).map(stats => ({
    playerId: stats.playerId,
    name: stats.name,
    total_wickets: stats.wickets,
    economy: stats.overs > 0 ? stats.runs_conceded / stats.overs : 0,
    wickets_per_match: stats.matches.size > 0 ? stats.wickets / stats.matches.size : 0,
    matches_played: stats.matches.size
  }));
}

async function processPlayerData() {
  try {
    const rawData = await readCSV('player_stats.csv');
    
    const battingMetrics = calculateBattingMetrics(rawData);
    const bowlingMetrics = calculateBowlingMetrics(rawData);

    return {
      battingMetrics,
      bowlingMetrics
    };
  } catch (error) {
    console.error('Error processing player data:', error);
    throw error;
  }
}

export async function startProcessing() {
  console.log('Starting data processing...');
  const processedData = await processPlayerData();
  await writeToCSV(processedData.battingMetrics, 'processed_batting.csv');
  await writeToCSV(processedData.bowlingMetrics, 'processed_bowling.csv');
  console.log('Processing completed successfully!');
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  startProcessing();
}