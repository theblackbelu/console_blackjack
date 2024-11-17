## Command Line Blackjack Game

A simple, interactive Blackjack game that runs in your terminal with betting system and score tracking.

### Features

- 🎯 Complete Blackjack rules implementation
- 💰 Betting system with money management
- 📊 Score tracking and statistics
- ♠️ Card deck with proper shuffling
- 🃏 Ace value handling (1 or 11)
- 🎉 Blackjack payouts (3:2)
- 🔄 Automatic deck reshuffling

### Installation

1. Make sure you have Node.js installed (version 12 or higher)
2. Download all the files to a directory
3. Navigate to the directory in your terminal

### How to Play

1. **Start the game:**
   ```bash
   node blackjack.js
   ```

2. **Place your bet:** Enter the amount you want to bet when prompted

3. **Gameplay:**
   - You'll be dealt two cards face up
   - The dealer gets one card face up and one face down
   - Choose to **Hit** (H) to get another card
   - Choose to **Stand** (S) to keep your current hand
   - Try to get as close to 21 as possible without going over

4. **Winning:**
   - **Blackjack** (Ace + 10-value card): Pays 3:2
   - **Win**: Double your bet
   - **Push** (tie): Get your bet back
   - **Bust** (over 21): Lose your bet

### Game Rules

- Dealer must hit on 16 and stand on 17
- Blackjack pays 3:2
- No insurance, splitting, or doubling down in this version
- Aces count as 1 or 11 automatically
- Deck reshuffles when running low on cards

### Files Structure

- `blackjack.js` - Main game controller and user interface
- `game.js` - Game logic, deck, and card management
- `player.js` - Player class with betting and statistics
- `package.json` - Node.js project configuration

### Commands

- `H` or `hit` - Take another card
- `S` or `stand` - Keep your current hand
- `Y` or `yes` - Play another round
- `N` or `no` - Quit the game

### Tips

- Start with small bets to learn the game
- The dealer has to follow strict rules (hit on 16, stand on 17)
- Track your statistics to improve your strategy
- Remember that Blackjack pays better than regular wins!

Enjoy playing Command Line Blackjack! 🎰