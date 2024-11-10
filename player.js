class Player {
    constructor(initialMoney = 100) {
        this.money = initialMoney;
        this.currentBet = 0;
        this.totalWins = 0;
        this.totalLosses = 0;
        this.totalPushes = 0;
    }

    placeBet(amount) {
        if (amount <= this.money) {
            this.currentBet = amount;
            this.money -= amount;
            return true;
        }
        return false;
    }

    win(amount) {
        this.money += amount;
        this.totalWins++;
        this.currentBet = 0;
    }

    lose() {
        this.totalLosses++;
        this.currentBet = 0;
    }

    push() {
        this.money += this.currentBet; // Return the bet
        this.totalPushes++;
        this.currentBet = 0;
    }

    getStats() {
        return {
            money: this.money,
            wins: this.totalWins,
            losses: this.totalLosses,
            pushes: this.totalPushes,
            totalGames: this.totalWins + this.totalLosses + this.totalPushes
        };
    }

    showStats() {
        const stats = this.getStats();
        console.log('\n📊 Player Statistics:');
        console.log(`💰 Money: $${stats.money}`);
        console.log(`🏆 Wins: ${stats.wins}`);
        console.log(`😞 Losses: ${stats.losses}`);
        console.log(`🤝 Pushes: ${stats.pushes}`);
        console.log(`🎯 Total Games: ${stats.totalGames}`);
        
        if (stats.totalGames > 0) {
            const winRate = ((stats.wins / stats.totalGames) * 100).toFixed(1);
            console.log(`📈 Win Rate: ${winRate}%`);
        }
    }
}

module.exports = Player;