## Command-Line Blackjack Game

A simple, interactive Blackjack game that runs in your terminal with betting system and score tracking.

### Features

- 🎯 **Complete Blackjack Rules**: Standard Blackjack gameplay
- 💰 **Betting System**: Place bets and manage your chip stack
- 📊 **Score Tracking**: Track wins, losses, and overall score
- 🃏 **Card Deck**: Properly shuffled 52-card deck
- 🎮 **Interactive Gameplay**: Hit, stand, and make decisions
- 📈 **Statistics**: View your performance over time

### Prerequisites

- Node.js (version 12 or higher)

### Installation & Setup

1. **Download the files**:
   - Save `blackjack.js` and `package.json` in the same directory

2. **Run the game**:
   ```bash
   node blackjack.js
   ```

   Or if you want to use npm:
   ```bash
   npm start
   ```

### How to Play

1. **Starting the Game**:
   - You begin with $100 in chips
   - Each round, place your bet (1 to your current chip amount)

2. **Game Flow**:
   - You and the dealer are dealt 2 cards each
   - Your cards are visible, dealer shows one card face down
   - Choose to **Hit** (take another card) or **Stand** (keep current hand)
   - Try to get as close to 21 without going over
   - Dealer must hit until they reach 17 or higher

3. **Winning Conditions**:
   - **Blackjack** (Ace + 10-value card): 3:2 payout
   - **Win**: Double your bet
   - **Push** (tie): Bet returned
   - **Lose**: Lose your bet

4. **Scoring System**:
   - Win: +10 points
   - Blackjack: +15 points
   - Loss: -5 points
   - Maintain minimum score of 0

### Game Commands

During gameplay, you'll be prompted to enter:
- **Bet amount**: Number between 1 and your current chips
- **Hit or Stand**: 'h' to hit, 's' to stand
- **Play again**: 'y' to continue, 'n' to quit

### Card Values

- Number cards: Face value (2-10)
- Face cards (Jack, Queen, King): 10 points
- Ace: 11 points (or 1 if needed to avoid busting)

### Game Features

- **Automatic deck shuffling** when cards run low
- **Chip management** with betting limits
- **Statistics tracking** (wins, losses, score)
- **Proper Blackjack rules** including dealer hitting rules
- **Clear game state display** after each action

### Tips

- Start with smaller bets to learn the game
- Remember the dealer must hit on 16 or lower
- Blackjack pays better than regular wins
- Track your score to improve your strategy

### Exiting the Game

The game automatically ends when:
- You choose not to play another round
- You run out of chips
- You press Ctrl+C

Final statistics are displayed when the game ends.

Enjoy playing Blackjack! 🎰