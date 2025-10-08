// Casino Slot Machine Game Logic
class SlotMachine {
    constructor() {
        this.balance = 1000;
        this.currentBet = 10;
        this.totalWins = 0;
        this.isSpinning = false;
        
        // Symbol definitions with their values
        this.symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐', '💎'];
        this.payouts = {
            '💎💎💎': 1000,
            '⭐⭐⭐': 500,
            '🔔🔔🔔': 200,
            '🍇🍇🍇': 100,
            '🍊🍊🍊': 50,
            '🍋🍋🍋': 25,
            '🍒🍒🍒': 10
        };
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.balanceElement = document.getElementById('balance');
        this.currentBetElement = document.getElementById('currentBet');
        this.lastWinElement = document.getElementById('lastWin');
        this.totalWinsElement = document.getElementById('totalWins');
        this.spinButton = document.getElementById('spinButton');
        this.reels = [
            document.getElementById('reel1'),
            document.getElementById('reel2'),
            document.getElementById('reel3')
        ];
        this.betButtons = document.querySelectorAll('.bet-btn');
    }
    
    setupEventListeners() {
        // Spin button
        this.spinButton.addEventListener('click', () => this.spin());
        
        // Bet buttons
        this.betButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setBet(parseInt(button.dataset.bet));
                this.updateBetButtons();
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSpinning) {
                e.preventDefault();
                this.spin();
            }
        });
    }
    
    setBet(amount) {
        if (amount <= this.balance) {
            this.currentBet = amount;
            this.updateDisplay();
        }
    }
    
    updateBetButtons() {
        this.betButtons.forEach(button => {
            button.classList.toggle('active', parseInt(button.dataset.bet) === this.currentBet);
        });
    }
    
    updateDisplay() {
        this.balanceElement.textContent = `$${this.balance}`;
        this.currentBetElement.textContent = `$${this.currentBet}`;
        this.totalWinsElement.textContent = `TOTAL WINS: $${this.totalWins}`;
        this.updateBetButtons();
    }
    
    async spin() {
        if (this.isSpinning || this.balance < this.currentBet) {
            return;
        }
        
        this.isSpinning = true;
        this.balance -= this.currentBet;
        this.updateDisplay();
        
        // Disable spin button
        this.spinButton.disabled = true;
        this.spinButton.style.background = 'linear-gradient(145deg, #666, #555)';
        
        // Start spinning animation
        this.startSpinning();
        
        // Simulate spinning time
        await this.sleep(2000);
        
        // Stop spinning and get results
        const results = this.stopSpinning();
        
        // Check for wins
        const winAmount = this.checkWin(results);
        
        if (winAmount > 0) {
            this.balance += winAmount;
            this.totalWins += winAmount;
            this.lastWinElement.textContent = `LAST WIN: $${winAmount}`;
            this.showWinAnimation(results);
            this.playWinSound();
        } else {
            this.lastWinElement.textContent = 'LAST WIN: $0';
        }
        
        // Re-enable spin button
        this.isSpinning = false;
        this.spinButton.disabled = false;
        this.spinButton.style.background = 'linear-gradient(145deg, #ff6b6b, #ff8e53)';
        
        this.updateDisplay();
    }
    
    startSpinning() {
        this.reels.forEach(reel => {
            reel.classList.add('spinning');
        });
    }
    
    stopSpinning() {
        const results = [];
        
        this.reels.forEach((reel, index) => {
            reel.classList.remove('spinning');
            
            // Get random symbol
            const randomSymbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
            results.push(randomSymbol);
            
            // Update reel display
            this.updateReelDisplay(reel, randomSymbol);
        });
        
        return results;
    }
    
    updateReelDisplay(reel, symbol) {
        const symbols = reel.querySelectorAll('.symbol');
        symbols.forEach((symbolEl, index) => {
            symbolEl.textContent = symbol;
            symbolEl.classList.remove('winning');
        });
    }
    
    checkWin(results) {
        const resultString = results.join('');
        
        // Check for three of a kind
        if (results[0] === results[1] && results[1] === results[2]) {
            const multiplier = this.payouts[resultString] || 0;
            return this.currentBet * multiplier;
        }
        
        return 0;
    }
    
    showWinAnimation(results) {
        // Highlight winning symbols
        this.reels.forEach((reel, index) => {
            const symbols = reel.querySelectorAll('.symbol');
            symbols.forEach(symbolEl => {
                symbolEl.classList.add('winning');
            });
        });
        
        // Remove animation after delay
        setTimeout(() => {
            this.reels.forEach(reel => {
                const symbols = reel.querySelectorAll('.symbol');
                symbols.forEach(symbolEl => {
                    symbolEl.classList.remove('winning');
                });
            });
        }, 2000);
    }
    
    playWinSound() {
        // Create audio context for sound effects
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a simple beep sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1600, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new SlotMachine();
    
    // Add some visual effects
    const casinoContainer = document.querySelector('.casino-container');
    
    // Add floating particles effect
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#ffd700';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = '100vh';
        particle.style.boxShadow = '0 0 10px #ffd700';
        
        document.body.appendChild(particle);
        
        const animation = particle.animate([
            { transform: 'translateY(0) scale(1)', opacity: 1 },
            { transform: `translateY(-100vh) scale(0)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'linear'
        });
        
        animation.onfinish = () => particle.remove();
    }
    
    // Create particles periodically
    setInterval(createParticle, 500);
    
    // Add click effects to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
