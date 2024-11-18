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
            for (let rank of ranks) {
                this.cards.push(new Card(suit, rank.rank, rank.value));
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
    constructor(name, startingBalance = 1000) {
        this.name = name;
        this.balance = startingBalance;
        this.hand = [];
        this.bet = 0;
        this.score = 0;
        this.wins = 0;
        this.losses = 0;
        this.ties = 0;
    }

    placeBet(amount) {
        if (amount > this.balance) {
            throw new Error('Insufficient funds');
        }
        this.bet = amount;
        this.balance -= amount;
    }

    addCard(card) {
        this.hand.push(card);
    }

    clearHand() {
        this.hand = [];
    }

    getHandValue() {
        let value = 0;
        let aces = 0;

        for (let card of this.hand) {
            value += card.value;
            if (card.rank === 'Ace') {
                aces++;
            }
        }

        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }

        return value;
    }

    isBusted() {
        return this.getHandValue() > 21;
    }

    hasBlackjack() {
        return this.hand.length === 2 && this.getHandValue() === 21;
    }

    win() {
        const winnings = this.bet * 2;
        this.balance += winnings;
        this.wins++;
        this.score += 10;
        return winnings;
    }

    lose() {
        this.losses++;
        this.score = Math.max(0, this.score - 5);
    }

    tie() {
        this.balance += this.bet;
        this.ties++;
    }

    blackjack() {
        const winnings = Math.floor(this.bet * 2.5);
        this.balance += winnings;
        this.wins++;
        this.score += 15;
        return winnings;
    }

    getStats() {
        return {
            name: this.name,
            balance: this.balance,
            wins: this.wins,
            losses: this.losses,
            ties: this.ties,
            score: this.score
        };
    }
}

class BlackjackGame {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.deck = new Deck();
        this.player = new Player('Player');
        this.dealer = new Player('Dealer', Infinity);
        this.gameActive = false;
    }

    async start() {
        console.log('🎰 Welcome to Blackjack! 🎰\n');
        await this.showMenu();
    }

    async showMenu() {
        console.log('\n=== BLACKJACK MENU ===');
        console.log('1. Start New Game');
        console.log('2. View Stats');
        console.log('3. Exit');
        
        const choice = await this.askQuestion('Choose an option (1-3): ');
        
        switch (choice) {
            case '1':
                await this.startGame();
                break;
            case '2':
                this.showStats();
                await this.showMenu();
                break;
            case '3':
                console.log('Thanks for playing! Goodbye!');
                this.rl.close();
                break;
            default:
                console.log('Invalid choice. Please try again.');
                await this.showMenu();
        }
    }

    async startGame() {
        if (this.player.balance <= 0) {
            console.log('\n💸 You are out of money! Game over.');
            this.rl.close();
            return;
        }

        this.gameActive = true;
        this.deck.reset();
        this.player.clearHand();
        this.dealer.clearHand();

        console.log(`\n💰 Current Balance: $${this.player.balance}`);
        
        // Place bet
        let betAmount;
        while (true) {
            try {
                const betInput = await this.askQuestion('Enter your bet amount: ');
                betAmount = parseInt(betInput);
                this.player.placeBet(betAmount);
                break;
            } catch (error) {
                console.log('Invalid bet amount. Please enter a valid number within your balance.');
            }
        }

        // Deal initial cards
        this.player.addCard(this.deck.deal());
        this.dealer.addCard(this.deck.deal());
        this.player.addCard(this.deck.deal());
        this.dealer.addCard(this.deck.deal());

        await this.playPlayerTurn();
    }

    async playPlayerTurn() {
        console.log('\n=== YOUR TURN ===');
        this.showHands(false);

        // Check for blackjack
        if (this.player.hasBlackjack()) {
            console.log('\n🎉 BLACKJACK! 🎉');
            const winnings = this.player.blackjack();
            console.log(`You won $${winnings}!`);
            await this.endRound();
            return;
        }

        while (true) {
            const choice = await this.askQuestion('\nDo you want to (H)it or (S)tand? ').toLowerCase();
            
            if (choice === 'h' || choice === 'hit') {
                this.player.addCard(this.deck.deal());
                this.showHands(false);
                
                if (this.player.isBusted()) {
                    console.log('\n💥 BUST! You went over 21.');
                    this.player.lose();
                    await this.endRound();
                    return;
                }
            } else if (choice === 's' || choice === 'stand') {
                await this.playDealerTurn();
                return;
            } else {
                console.log('Invalid choice. Please enter H for Hit or S for Stand.');
            }
        }
    }

    async playDealerTurn() {
        console.log('\n=== DEALER\'S TURN ===');
        this.showHands(true);

        while (this.dealer.getHandValue() < 17) {
            console.log('Dealer hits...');
            this.dealer.addCard(this.deck.deal());
            this.showHands(true);
            
            if (this.dealer.isBusted()) {
                console.log('\n🎉 DEALER BUSTS! You win!');
                const winnings = this.player.win();
                console.log(`You won $${winnings}!`);
                await this.endRound();
                return;
            }
        }

        this.determineWinner();
    }

    determineWinner() {
        const playerValue = this.player.getHandValue();
        const dealerValue = this.dealer.getHandValue();

        console.log(`\n=== FINAL RESULT ===`);
        console.log(`Your hand: ${playerValue}`);
        console.log(`Dealer's hand: ${dealerValue}`);

        if (playerValue > dealerValue) {
            console.log('🎉 YOU WIN!');
            const winnings = this.player.win();
            console.log(`You won $${winnings}!`);
        } else if (playerValue < dealerValue) {
            console.log('😞 DEALER WINS!');
            this.player.lose();
        } else {
            console.log('🤝 IT\'S A TIE!');
            this.player.tie();
        }

        this.endRound();
    }

    showHands(showDealerFullHand) {
        console.log(`\nYour hand (${this.player.getHandValue()}):`);
        this.player.hand.forEach(card => console.log(`  ${card.toString()}`));
        
        console.log(`\nDealer's hand${showDealerFullHand ? ` (${this.dealer.getHandValue()})` : ''}:`);
        if (showDealerFullHand) {
            this.dealer.hand.forEach(card => console.log(`  ${card.toString()}`));
        } else {
            console.log(`  ${this.dealer.hand[0].toString()}`);
            console.log('  [Hidden Card]');
        }
    }

    showStats() {
        const stats = this.player.getStats();
        console.log('\n=== PLAYER STATISTICS ===');
        console.log(`Player: ${stats.name}`);
        console.log(`Balance: $${stats.balance}`);
        console.log(`Score: ${stats.score}`);
        console.log(`Record: ${stats.wins}-${stats.losses}-${stats.ties}`);
        console.log(`Win Rate: ${stats.wins + stats.losses > 0 ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100) : 0}%`);
    }

    async endRound() {
        this.gameActive = false;
        const continuePlaying = await this.askQuestion('\nDo you want to play another round? (Y/N): ').toLowerCase();
        
        if (continuePlaying === 'y' || continuePlaying === 'yes') {
            await this.startGame();
        } else {
            this.showStats();
            await this.showMenu();
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
game.start();