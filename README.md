## Command Line Blackjack Game

A simple, interactive Blackjack game that runs in your terminal with betting system and score tracking.

### Features

- 🎯 **Complete Blackjack Rules**: Standard casino-style Blackjack
- 💰 **Betting System**: Place bets and manage your virtual bankroll
- 📊 **Score Tracking**: Track wins, losses, ties, and overall score
- 🃏 **Card Deck**: Properly shuffled 52-card deck
- 🎮 **Interactive Gameplay**: Hit, stand, and make strategic decisions
- 📈 **Statistics**: View your game statistics and win rate

### How to Use

#### Prerequisites
- Node.js (version 12 or higher) installed on your system

#### Installation & Setup

1. **Save the files**:
   - Save `blackjack.js` as the main game file
   - Save `package.json` for project configuration

2. **Run the game**:
   ```bash
   node blackjack.js
   ```
   
   Or if you have the package.json file:
   ```bash
   npm start
   ```

#### Game Rules

- **Objective**: Get closer to 21 than the dealer without going over
- **Card Values**: 
  - Number cards: Face value (2-10)
  - Face cards (Jack, Queen, King): 10 points
  - Ace: 11 points (or 1 if going over 21)
- **Blackjack**: Ace + 10-value card = automatic win (pays 3:2)
- **Dealer Rules**: Must hit on 16 or less, stand on 17 or more

#### Game Commands

During gameplay, you'll be prompted to:
- **Place bets**: Enter any amount up to your current balance
- **Hit (H)**: Take another card
- **Stand (S)**: Keep your current hand and end your turn

#### Menu Options

1. **Start New Game**: Begin a new Blackjack round
2. **View Stats**: See your current statistics and performance
3. **Exit**: Quit the game

#### Scoring System

- **Win**: +10 points, double your bet
- **Loss**: -5 points, lose your bet
- **Tie**: Bet returned, no points change
- **Blackjack**: +15 points, 2.5x your bet

#### Starting Balance
You begin with $1000. Manage your bets wisely!

### Tips for Success

1. **Basic Strategy**: 
   - Always stand on 17 or higher
   - Hit on 11 or less
   - Consider the dealer's visible card when making decisions

2. **Bankroll Management**:
   - Don't bet more than you can afford to lose
   - Consider betting 5-10% of your total balance per hand

3. **Blackjack Pays 3:2** - Look for those Ace + 10 combinations!

Enjoy the game and good luck at the tables! 🎰