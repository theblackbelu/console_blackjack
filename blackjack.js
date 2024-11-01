const readline = require('readline');
const Game = require('./game');
const Player = require('./player');

class Blackjack {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.game = new Game();
        this.player = new Player(100); // Start with $100
    }

    start() {
        console.log('🎰 Welcome to Command Line Blackjack! 🎰');
        console.log(`You have $${this.player.money} to play with.`);
        this.promptBet();
    }

    promptBet() {
        this.rl.question('\nHow much would you like to bet? $', (betAmount) => {
            const bet = parseInt(betAmount);
            
            if (isNaN(bet) || bet <= 0) {
                console.log('Please enter a valid bet amount.');
                return this.promptBet();
            }
            
            if (bet > this.player.money) {
                console.log('You don\'t have enough money for that bet.');
                return this.promptBet();
            }

            this.player.placeBet(bet);
            this.playRound();
        });
    }

    playRound() {
        this.game.startNewRound();
        this.dealInitialCards();
        this.showGameState();
        
        if (this.game.playerHasBlackjack()) {
            this.handleBlackjack();
        } else {
            this.playerTurn();
        }
    }

    dealInitialCards() {
        this.game.dealInitialCards();
    }

    showGameState(hideDealerCard = true) {
        console.log('\n' + '='.repeat(40));
        console.log(`Your money: $${this.player.money}`);
        console.log(`Current bet: $${this.player.currentBet}`);
        console.log('='.repeat(40));
        
        this.game.showGameState(hideDealerCard);
    }

    playerTurn() {
        this.rl.question('\nDo you want to (H)it or (S)tand? ', (answer) => {
            const choice = answer.toLowerCase();
            
            if (choice === 'h' || choice === 'hit') {
                this.game.playerHit();
                this.showGameState();
                
                if (this.game.isPlayerBusted()) {
                    this.handlePlayerBust();
                } else {
                    this.playerTurn();
                }
            } else if (choice === 's' || choice === 'stand') {
                this.dealerTurn();
            } else {
                console.log('Please enter "H" for Hit or "S" for Stand.');
                this.playerTurn();
            }
        });
    }

    dealerTurn() {
        console.log('\nDealer\'s turn...');
        this.game.dealerPlay();
        this.showGameState(false); // Show all dealer cards
        this.determineWinner();
    }

    handleBlackjack() {
        console.log('\n🎉 BLACKJACK! You win 3:2! 🎉');
        const winnings = Math.floor(this.player.currentBet * 2.5);
        this.player.win(winnings);
        this.showGameState(false);
        this.askToPlayAgain();
    }

    handlePlayerBust() {
        console.log('\n💥 BUST! You went over 21. 💥');
        this.player.lose();
        this.showGameState(false);
        this.askToPlayAgain();
    }

    determineWinner() {
        const result = this.game.determineWinner();
        
        switch (result) {
            case 'player':
                console.log('\n🎉 You win! 🎉');
                this.player.win(this.player.currentBet * 2);
                break;
            case 'dealer':
                console.log('\n😞 Dealer wins. 😞');
                this.player.lose();
                break;
            case 'push':
                console.log('\n🤝 Push! It\'s a tie. 🤝');
                this.player.push();
                break;
        }
        
        this.askToPlayAgain();
    }

    askToPlayAgain() {
        console.log(`\nYour total money: $${this.player.money}`);
        
        if (this.player.money <= 0) {
            console.log('💸 You\'re out of money! Game over. 💸');
            this.rl.close();
            return;
        }

        this.rl.question('\nDo you want to play another round? (Y/N) ', (answer) => {
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                this.promptBet();
            } else {
                console.log(`\nThanks for playing! You finished with $${this.player.money}.`);
                this.rl.close();
            }
        });
    }
}

// Start the game if this file is run directly
if (require.main === module) {
    const game = new Blackjack();
    game.start();
}

module.exports = Blackjack;