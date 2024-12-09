import { PLAYER_ROLES, PERFORMANCE_METRICS } from '../config/constants.js';
import { readCSV } from '../utils/csvHelper.js';

function calculatePlayerScore(stats, role) {
  const scores = {
    [PLAYER_ROLES.OPENER]: (stats) => {
      return (
        stats.strike_rate * 0.4 +
        stats.average * 0.3 +
        stats.boundaries_percentage * 0.3
      );
    },
    [PLAYER_ROLES.MIDDLE_ORDER]: (stats) => {
      return (
        stats.average * 0.4 +
        stats.strike_rate * 0.3 +
        stats.runs_per_match * 0.3
      );
    },
    [PLAYER_ROLES.FINISHER]: (stats) => {
      return (
        stats.strike_rate * 0.5 +
        stats.boundaries_percentage * 0.3 +
        stats.average * 0.2
      );
    },
    [PLAYER_ROLES.ALL_ROUNDER]: (stats) => {
      return (
        stats.batting_score * 0.5 +
        stats.bowling_score * 0.5
      );
    },
    [PLAYER_ROLES.FAST_BOWLER]: (stats) => {
      return (
        stats.economy * 0.4 +
        stats.wickets_per_match * 0.4 +
        stats.death_overs_economy * 0.2
      );
    }
  };

  return scores[role](stats);
}

async function analyzePlayerPerformance() {
  try {
    const battingData = await readCSV('processed_batting.csv');
    const bowlingData = await readCSV('processed_bowling.csv');

    const playerAnalysis = {};

    // Analyze each player's performance based on their role
    for (const role of Object.values(PLAYER_ROLES)) {
      const eligiblePlayers = battingData.filter(player => player.role === role);
      
      eligiblePlayers.forEach(player => {
        const bowlingStats = bowlingData.find(b => b.playerId === player.playerId);
        const score = calculatePlayerScore({ ...player, ...bowlingStats }, role);
        
        playerAnalysis[player.playerId] = {
          name: player.name,
          role,
          score,
          stats: { ...player, ...bowlingStats }
        };
      });
    }

    return playerAnalysis;
  } catch (error) {
    console.error('Error analyzing player performance:', error);
    throw error;
  }
}

function selectTopEleven(playerAnalysis) {
  const selectedTeam = {
    openers: [],
    middleOrder: [],
    finishers: [],
    allRounders: [],
    fastBowlers: []
  };

  // Select top players for each role
  Object.entries(playerAnalysis)
    .sort((a, b) => b[1].score - a[1].score)
    .forEach(([_, player]) => {
      switch (player.role) {
        case PLAYER_ROLES.OPENER:
          if (selectedTeam.openers.length < 2) selectedTeam.openers.push(player);
          break;
        case PLAYER_ROLES.MIDDLE_ORDER:
          if (selectedTeam.middleOrder.length < 3) selectedTeam.middleOrder.push(player);
          break;
        case PLAYER_ROLES.FINISHER:
          if (selectedTeam.finishers.length < 2) selectedTeam.finishers.push(player);
          break;
        case PLAYER_ROLES.ALL_ROUNDER:
          if (selectedTeam.allRounders.length < 2) selectedTeam.allRounders.push(player);
          break;
        case PLAYER_ROLES.FAST_BOWLER:
          if (selectedTeam.fastBowlers.length < 2) selectedTeam.fastBowlers.push(player);
          break;
      }
    });

  return selectedTeam;
}

export async function startAnalysis() {
  console.log('Starting player analysis...');
  const playerAnalysis = await analyzePlayerPerformance();
  const topEleven = selectTopEleven(playerAnalysis);
  console.log('Analysis completed successfully!');
  return topEleven;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  startAnalysis();
}