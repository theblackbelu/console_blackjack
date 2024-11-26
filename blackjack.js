const readline = require('readline');

class Card {
    constructor(suit, rank, value) {
        this.suit = suit;
        this.rank = rank;
        this.value = value;
    }

    toString() {
        return `${this.rank} of ${this.suit}`;
    }
}

class Deck {
    constructor() {
        this.cards = [];
        this.reset();
    }

    reset() {
        this.cards = [];
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = [
            { rank: '2', value: 2 }, { rank: '3', value: 3 }, { rank: '4', value: 4 },
            { rank: '5', value: 5 }, { rank: '6', value: 6 }, { rank: '7', value: 7 },
            { rank: '8', value: 8 }, { rank: '9', value: 9 }, { rank: '10', value: 10 },
            { rank: 'Jack', value: 10 }, { rank: 'Queen', value: 10 }, { rank: 'King', value: 10 },
            { rank: 'Ace', value: 11 }
        ];

        for (let suit of suits) {
            for (let rankObj of ranks) {
                this.cards.push(new Card(suit, rankObj.rank, rankObj.value));
            }
        }
        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    deal() {
        return this.cards.pop();
    }
}

class Player {
    constructor(name, startingChips = 100) {
        this.name = name;
        this.chips = startingChips;
        this.hand = [];
        this.bet = 0;
        this.score = 0;
        this.wins = 0;
        this.losses = 0;
    }

    placeBet(amount) {
        if (amount <= this.chips) {
            this.bet = amount;
            this.chips -= amount;
            return true;
        }
        return false;
    }

    addCard(card) {
        this.hand.push(card);
    }

    getHandValue() {
        let value = 0;
        let aces = 0;

        for (let card of this.hand) {
            value += card.value;
            if (card.rank === 'Ace') aces++;
        }

        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }

        return value;
    }

    clearHand() {
        this.hand = [];
        this.bet = 0;
    }

    win() {
        const winnings = this.bet * 2;
        this.chips += winnings;
        this.wins++;
        this.score += 10;
        return winnings;
    }

    lose() {
        this.losses++;
        this.score = Math.max(0, this.score - 5);
    }

    push() {
        this.chips += this.bet;
    }

    hasBlackjack() {
        return this.hand.length === 2 && this.getHandValue() === 21;
    }

    isBusted() {
        return this.getHandValue() > 21;
    }

    displayHand(hideFirstCard = false) {
        if (hideFirstCard && this.hand.length > 0) {
            return `[Hidden], ${this.hand.slice(1).map(card => card.toString()).join(', ')}`;
        }
        return this.hand.map(card => card.toString()).join(', ');
    }
}

class BlackjackGame {
    constructor() {
        this.deck = new Deck();
        this.player = new Player('Player');
        this.dealer = new Player('Dealer');
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async startGame() {
        console.log('🎰 Welcome to Blackjack! 🎰\n');
        
        while (this.player.chips > 0) {
            await this.playRound();
            
            if (this.player.chips === 0) {
                console.log('\n💸 You\'re out of chips! Game over.');
                break;
            }

            const playAgain = await this.askQuestion('Play another round? (y/n): ');
            if (playAgain.toLowerCase() !== 'y') {
                break;
            }
        }

        this.displayFinalStats();
        this.rl.close();
    }

    async playRound() {
        console.log(`\n💰 Your chips: $${this.player.chips}`);
        console.log(`📊 Score: ${this.player.score} | Wins: ${this.player.wins} | Losses: ${this.player.losses}\n`);

        // Place bet
        const betAmount = await this.getValidBet();
        this.player.placeBet(betAmount);

        // Reset hands and deck if needed
        this.player.clearHand();
        this.dealer.clearHand();
        if (this.deck.cards.length < 20) {
            this.deck.reset();
            console.log('🃏 Shuffling deck...');
        }

        // Deal initial cards
        this.player.addCard(this.deck.deal());
        this.dealer.addCard(this.deck.deal());
        this.player.addCard(this.deck.deal());
        this.dealer.addCard(this.deck.deal());

        this.displayGameState(true);

        // Check for blackjack
        if (this.player.hasBlackjack() && this.dealer.hasBlackjack()) {
            console.log('\n🤝 Both have Blackjack! Push!');
            this.player.push();
            return;
        } else if (this.player.hasBlackjack()) {
            console.log('\n🎯 Blackjack! You win 3:2!');
            this.player.chips += Math.floor(this.player.bet * 2.5);
            this.player.wins++;
            this.player.score += 15;
            return;
        } else if (this.dealer.hasBlackjack()) {
            console.log('\n💔 Dealer has Blackjack! You lose.');
            this.player.lose();
            return;
        }

        // Player's turn
        await this.playerTurn();

        // Dealer's turn if player didn't bust
        if (!this.player.isBusted()) {
            this.dealerTurn();
        }

        // Determine winner
        this.determineWinner();
    }

    async playerTurn() {
        while (true) {
            const choice = await this.askQuestion('\nHit or Stand? (h/s): ');
            
            if (choice.toLowerCase() === 'h') {
                this.player.addCard(this.deck.deal());
                this.displayGameState(true);
                
                if (this.player.isBusted()) {
                    console.log('\n💥 Bust! You lose.');
                    this.player.lose();
                    break;
                }
            } else if (choice.toLowerCase() === 's') {
                break;
            } else {
                console.log('Please enter "h" for hit or "s" for stand.');
            }
        }
    }

    dealerTurn() {
        console.log('\n🃏 Dealer\'s turn...');
        this.displayGameState(false);

        while (this.dealer.getHandValue() < 17) {
            console.log('Dealer hits...');
            this.dealer.addCard(this.deck.deal());
            this.displayGameState(false);
        }

        if (this.dealer.isBusted()) {
            console.log('\n💥 Dealer busts!');
        } else {
            console.log(`\n🃏 Dealer stands with ${this.dealer.getHandValue()}`);
        }
    }

    determineWinner() {
        if (this.player.isBusted()) {
            return; // Player already lost
        }

        const playerValue = this.player.getHandValue();
        const dealerValue = this.dealer.getHandValue();

        console.log(`\n📊 Final Scores:`);
        console.log(`You: ${playerValue} | Dealer: ${dealerValue}`);

        if (this.dealer.isBusted() || playerValue > dealerValue) {
            const winnings = this.player.win();
            console.log(`🎉 You win $${winnings}!`);
        } else if (playerValue < dealerValue) {
            console.log('💔 Dealer wins!');
            this.player.lose();
        } else {
            console.log('🤝 Push! Bet returned.');
            this.player.push();
        }
    }

    displayGameState(hideDealerCard) {
        console.log('\n' + '='.repeat(50));
        console.log(`Your hand: ${this.player.displayHand()} (${this.player.getHandValue()})`);
        console.log(`Dealer's hand: ${this.dealer.displayHand(hideDealerCard)}`);
        if (!hideDealerCard) {
            console.log(`Dealer total: ${this.dealer.getHandValue()}`);
        }
        console.log('='.repeat(50));
    }

    displayFinalStats() {
        console.log('\n' + '⭐'.repeat(50));
        console.log('FINAL STATISTICS:');
        console.log(`Final Chip Count: $${this.player.chips}`);
        console.log(`Final Score: ${this.player.score}`);
        console.log(`Total Wins: ${this.player.wins}`);
        console.log(`Total Losses: ${this.player.losses}`);
        console.log('⭐'.repeat(50));
    }

    async getValidBet() {
        while (true) {
            const betInput = await this.askQuestion(`Place your bet (1-${this.player.chips}): `);
            const betAmount = parseInt(betInput);
            
            if (isNaN(betAmount) || betAmount < 1 || betAmount > this.player.chips) {
                console.log(`Please enter a valid bet between 1 and ${this.player.chips}.`);
            } else {
                return betAmount;
            }
        }
    }

    askQuestion(question) {
        return new Promise((resolve) => {
            this.rl.question(question, resolve);
        });
    }
}

// Start the game
const game = new BlackjackGame();
game.startGame();