# T20 Cricket Data Analytics Project

This project analyzes T20 World Cup cricket data to identify the top 11 players based on various performance metrics. It uses web scraping to collect data from ESPNCricinfo and processes it to make data-driven player selections.

## Features

- Web scraping of T20 World Cup match data from ESPNCricinfo
- Player performance analysis based on multiple metrics
- Role-based player selection (openers, middle order, finishers, all-rounders, fast bowlers)
- Comprehensive data processing and statistical analysis

## Project Structure

```
├── src/
│   ├── analyzer/     # Player analysis and team selection logic
│   ├── config/       # Configuration and constants
│   ├── processor/    # Data processing and transformation
│   ├── scraper/      # Web scraping functionality
│   ├── utils/        # Utility functions
│   └── index.js      # Main application entry point
├── data/            # CSV files for raw and processed data
└── package.json
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the analysis:
   ```bash
   npm start
   ```

## Available Scripts

- `npm start`: Run the complete analysis pipeline
- `npm run scrape`: Only run the data scraping
- `npm run process`: Only run the data processing
- `npm run analyze`: Only run the player analysis

## Data Processing Pipeline

1. **Data Collection**: Scrapes match and player statistics from ESPNCricinfo
2. **Data Processing**: Calculates performance metrics for each player
3. **Player Analysis**: Evaluates players based on their roles and metrics
4. **Team Selection**: Selects the optimal playing XI based on analysis

## Performance Metrics

### Batting Metrics
- Strike Rate
- Average
- Boundaries Percentage
- Runs per Match

### Bowling Metrics
- Economy Rate
- Wickets per Match
- Death Overs Economy

## Player Roles

- Openers (2)
- Middle Order/Anchors (3)
- Finishers (2)
- All-Rounders (2)
- Specialist Fast Bowlers (2)