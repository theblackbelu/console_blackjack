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
            for (let cardInfo of ranks) {
                this.cards.push(new Card(suit, cardInfo.rank, cardInfo.value));
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

class Game {
    constructor() {
        this.deck = new Deck();
        this.playerHand = [];
        this.dealerHand = [];
    }

    startNewRound() {
        if (this.deck.cards.length < 20) {
            this.deck.reset();
            console.log('Shuffling a new deck...');
        }
        this.playerHand = [];
        this.dealerHand = [];
    }

    dealInitialCards() {
        this.playerHand.push(this.deck.deal());
        this.dealerHand.push(this.deck.deal());
        this.playerHand.push(this.deck.deal());
        this.dealerHand.push(this.deck.deal());
    }

    playerHit() {
        this.playerHand.push(this.deck.deal());
    }

    dealerPlay() {
        while (this.calculateHandValue(this.dealerHand) < 17) {
            this.dealerHand.push(this.deck.deal());
        }
    }

    calculateHandValue(hand) {
        let value = 0;
        let aces = 0;

        for (let card of hand) {
            value += card.value;
            if (card.rank === 'Ace') {
                aces++;
            }
        }

        // Adjust for aces
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }

        return value;
    }

    playerHasBlackjack() {
        return this.playerHand.length === 2 && this.calculateHandValue(this.playerHand) === 21;
    }

    isPlayerBusted() {
        return this.calculateHandValue(this.playerHand) > 21;
    }

    isDealerBusted() {
        return this.calculateHandValue(this.dealerHand) > 21;
    }

    determineWinner() {
        const playerValue = this.calculateHandValue(this.playerHand);
        const dealerValue = this.calculateHandValue(this.dealerHand);

        if (playerValue > 21) return 'dealer';
        if (dealerValue > 21) return 'player';
        if (playerValue > dealerValue) return 'player';
        if (dealerValue > playerValue) return 'dealer';
        return 'push'; // tie
    }

    showGameState(hideDealerCard = true) {
        console.log('\nDealer\'s hand:');
        if (hideDealerCard) {
            console.log(`  ${this.dealerHand[0].toString()}`);
            console.log('  [Hidden Card]');
        } else {
            this.dealerHand.forEach(card => console.log(`  ${card.toString()}`));
            console.log(`  Total: ${this.calculateHandValue(this.dealerHand)}`);
        }

        console.log('\nYour hand:');
        this.playerHand.forEach(card => console.log(`  ${card.toString()}`));
        console.log(`  Total: ${this.calculateHandValue(this.playerHand)}`);
    }
}

module.exports = Game;