// Main game logic for the colour guessing game

// Game mode constants
const GAME_MODES = {
    HEX_GUESS: 'hex_guess',    // Show color, guess hex
    COLOR_GUESS: 'color_guess' // Show hex, guess color
};

class ColourGuesser {
    constructor() {
        this.currentColor = null;
        this.gameStats = this.loadGameStats();
        this.currentScore = 0;
        this.streak = 0;
        this.isGameActive = false;
        this.gameMode = GAME_MODES.HEX_GUESS; // Default mode
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
        this.startNewRound();
    }
    
    initializeElements() {
        // Game mode elements
        this.modeSwitch = document.getElementById('mode-switch');
        this.modeText = document.getElementById('mode-text');
        this.colorDisplayMode = document.getElementById('color-display-mode');
        this.hexDisplayMode = document.getElementById('hex-display-mode');
        
        // Game elements
        this.targetColorEl = document.getElementById('target-color');
        this.targetHexEl = document.getElementById('target-hex');
        this.hexInputContainer = document.getElementById('hex-input-container');
        this.colorPickerContainer = document.getElementById('color-picker-container');
        this.hexInput = document.getElementById('hex-input');
        this.guessPreview = document.getElementById('guess-preview');
        
        // Custom color picker will be initialized later
        this.customColorPicker = null;
        this.submitBtn = document.getElementById('submit-guess');
        this.nextBtn = document.getElementById('next-round');
        this.feedbackModal = document.getElementById('feedback-modal');
        
        // New game modal elements
        this.newGameModal = document.getElementById('new-game-modal');
        this.newGameModalClose = document.getElementById('new-game-modal-close');
        this.confirmNewGameBtn = document.getElementById('confirm-new-game');
        this.cancelNewGameBtn = document.getElementById('cancel-new-game');
        
        // Score elements
        this.currentScoreEl = document.getElementById('current-score');
        this.streakEl = document.getElementById('streak');
        this.highScoreEl = document.getElementById('high-score');
        
        // Feedback elements
        this.actualColorEl = document.getElementById('actual-color');
        this.guessedColorEl = document.getElementById('guessed-color');
        this.actualHexEl = document.getElementById('actual-hex');
        this.guessedHexEl = document.getElementById('guessed-hex');
        this.roundScoreEl = document.getElementById('round-score');
        this.accuracyMessageEl = document.getElementById('accuracy-message');
        
        // Stats elements
        this.gamesPlayedEl = document.getElementById('games-played');
        this.averageScoreEl = document.getElementById('average-score');
        this.perfectGuessesEl = document.getElementById('perfect-guesses');
        
        // Help section elements
        this.gameRulesEl = document.getElementById('game-rules');
        this.newGameBtn = document.getElementById('new-game');
    }
    
    attachEventListeners() {
        // Mode switching
        this.modeSwitch.addEventListener('change', () => this.switchGameMode());
        
        // Submit guess
        this.submitBtn.addEventListener('click', () => this.submitGuess());
        
        // Enter key to submit (hex input mode)
        this.hexInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.isGameActive) {
                this.submitGuess();
            }
        });
        
        // Real-time input formatting and preview (hex input mode)
        this.hexInput.addEventListener('input', (e) => {
            const formatted = formatHexInput(e.target.value);
            e.target.value = formatted;
            this.updateGuessPreview(formatted);
        });
        
        // Custom color picker will be initialized after DOM is ready
        
        // Next round
        this.nextBtn.addEventListener('click', () => this.startNewRound());
        
        // New game button
        this.newGameBtn.addEventListener('click', () => this.checkNewGameConfirmation());
        
        // Feedback modal no longer has close functionality - users must click 'Next Color'
        
        // New game modal functionality
        this.newGameModalClose.addEventListener('click', () => this.closeNewGameModal());
        this.confirmNewGameBtn.addEventListener('click', () => this.confirmNewGame());
        this.cancelNewGameBtn.addEventListener('click', () => this.closeNewGameModal());
        this.newGameModal.addEventListener('click', (e) => {
            if (e.target === this.newGameModal) {
                this.closeNewGameModal();
            }
        });
    }
    
    startNewRound() {
        // Generate new color
        this.currentColor = generateRandomColor();
        const hexColor = rgbToHex(this.currentColor.r, this.currentColor.g, this.currentColor.b);
        
        if (this.gameMode === GAME_MODES.HEX_GUESS) {
            this.startHexGuessRound(hexColor);
        } else {
            this.startColorGuessRound(hexColor);
        }
        
        // Common UI reset
        this.closeFeedbackModal();
        this.showSubmitButton();
        this.isGameActive = true;
        
        console.log('Target color:', hexColor, 'Mode:', this.gameMode); // For debugging
    }
    
    startHexGuessRound(hexColor) {
        // Display the color for user to guess hex
        this.targetColorEl.style.backgroundColor = rgbToCss(this.currentColor);
        
        // Reset hex input
        this.hexInput.value = '';
        this.hexInput.focus();
        this.guessPreview.style.backgroundColor = '';
        this.guessPreview.style.opacity = '0.3';
    }
    
    startColorGuessRound(hexColor) {
        // Display the hex code for user to guess color
        this.targetHexEl.textContent = hexColor;
        
        // Reset custom color picker
        if (this.customColorPicker) {
            this.customColorPicker.reset();
        }
    }
    
    updateGuessPreview(hexValue) {
        if (isValidHex(hexValue)) {
            this.guessPreview.style.backgroundColor = hexValue;
            this.guessPreview.style.opacity = '1';
            this.submitBtn.disabled = false;
        } else {
            this.guessPreview.style.backgroundColor = '';
            this.guessPreview.style.opacity = '0.3';
            this.submitBtn.disabled = true;
        }
    }
    
    initializeCustomColorPicker() {
        if (this.colorPickerContainer) {
            this.customColorPicker = new CustomColorPicker('color-picker-container');
            
            // Set callback for color changes
            this.customColorPicker.onColorChange = (hex, rgb) => {
                this.submitBtn.disabled = false;
            };
        }
    }
    
    submitGuess() {
        if (!this.isGameActive) return;
        
        let userHex;
        
        if (this.gameMode === GAME_MODES.HEX_GUESS) {
            userHex = this.hexInput.value.trim();
            if (!isValidHex(userHex)) {
                alert('Please enter a valid hex color code (e.g., #FF5733)');
                return;
            }
        } else {
            if (!this.customColorPicker) {
                alert('Color picker not initialized');
                return;
            }
            userHex = this.customColorPicker.getCurrentColor();
        }
        
        this.isGameActive = false;
        this.showNextButton();
        this.processGuess(userHex);
    }
    
    processGuess(userHex) {
        const userColor = hexToRgb(userHex);
        const actualHex = rgbToHex(this.currentColor.r, this.currentColor.g, this.currentColor.b);
        
        // Calculate score
        const baseScore = calculateScore(this.currentColor, userColor);
        const isPerfect = baseScore === 100;
        const scoreBreakdown = calculateBonusScore(baseScore, this.streak, isPerfect);
        
        // Update streak
        this.streak = updateStreak(baseScore, this.streak);
        
        // Update current score
        this.currentScore += scoreBreakdown.totalScore;
        
        // Update game statistics
        this.updateGameStats(scoreBreakdown.totalScore, isPerfect);
        
        // Show feedback
        this.showFeedback(actualHex, userHex, scoreBreakdown, this.currentColor, userColor);
        
        // Update display
        this.updateDisplay();
    }
    
    showFeedback(actualHex, userHex, scoreBreakdown, actualColor, userColor) {
        // Show color comparison
        this.actualColorEl.style.backgroundColor = rgbToCss(actualColor);
        this.guessedColorEl.style.backgroundColor = userHex;
        this.actualHexEl.textContent = actualHex;
        this.guessedHexEl.textContent = userHex.toUpperCase();
        
        // Show score breakdown
        const feedback = getAccuracyFeedback(scoreBreakdown.baseScore);
        
        let scoreHTML = `
            <div class="score-main">${scoreBreakdown.totalScore} points</div>
            <div class="score-breakdown">
                <div>Base Score: ${scoreBreakdown.baseScore}</div>
        `;
        
        if (scoreBreakdown.perfectBonus > 0) {
            scoreHTML += `<div>Perfect Bonus: +${scoreBreakdown.perfectBonus}</div>`;
        }
        
        if (scoreBreakdown.streakBonus > 0) {
            scoreHTML += `<div>Streak Bonus: +${scoreBreakdown.streakBonus}</div>`;
        }
        
        scoreHTML += '</div>';
        
        this.roundScoreEl.innerHTML = scoreHTML;
        this.accuracyMessageEl.innerHTML = `
            <div class="feedback-message ${feedback.class}">
                ${feedback.message}
            </div>
        `;
        
        // Add color analysis hints
        const analysis = analyzeColorChannels(actualColor, userColor);
        if (analysis.hints.length > 0) {
            this.accuracyMessageEl.innerHTML += `
                <div class="color-hints">
                    ${analysis.hints.map(hint => `<div class="hint">💡 ${hint}</div>`).join('')}
                </div>
            `;
        }
        
        // Show feedback modal
        this.showFeedbackModal();
    }
    
    updateDisplay() {
        this.currentScoreEl.textContent = this.currentScore;
        this.streakEl.textContent = this.streak;
        this.highScoreEl.textContent = this.gameStats.highScore;
        this.gamesPlayedEl.textContent = this.gameStats.gamesPlayed;
        this.averageScoreEl.textContent = this.gameStats.averageScore;
        this.perfectGuessesEl.textContent = this.gameStats.perfectGuesses;
    }
    
    updateGameStats(roundScore, isPerfect) {
        this.gameStats.gamesPlayed++;
        this.gameStats.totalScore += roundScore;
        this.gameStats.averageScore = Math.round(this.gameStats.totalScore / this.gameStats.gamesPlayed);
        
        if (isPerfect) {
            this.gameStats.perfectGuesses++;
        }
        
        if (this.currentScore > this.gameStats.highScore) {
            this.gameStats.highScore = this.currentScore;
        }
        
        this.saveGameStats();
    }
    
    loadGameStats() {
        const defaultStats = {
            gamesPlayed: 0,
            totalScore: 0,
            averageScore: 0,
            highScore: 0,
            perfectGuesses: 0
        };
        
        try {
            const saved = localStorage.getItem('colourGuesserStats');
            return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
        } catch (e) {
            console.warn('Failed to load game stats:', e);
            return defaultStats;
        }
    }
    
    saveGameStats() {
        try {
            localStorage.setItem('colourGuesserStats', JSON.stringify(this.gameStats));
        } catch (e) {
            console.warn('Failed to save game stats:', e);
        }
    }
    
    switchGameMode() {
        const isColorGuessMode = this.modeSwitch.checked;
        this.gameMode = isColorGuessMode ? GAME_MODES.COLOR_GUESS : GAME_MODES.HEX_GUESS;
        
        // Update UI for new mode
        this.updateUIForMode();
        
        // Reset scores when switching modes
        this.resetGame();
    }
    
    updateUIForMode() {
        if (this.gameMode === GAME_MODES.HEX_GUESS) {
            // Show color display, hide hex display
            this.colorDisplayMode.classList.remove('hidden');
            this.hexDisplayMode.classList.add('hidden');
            
            // Show hex input, hide color picker
            this.hexInputContainer.classList.remove('hidden');
            this.colorPickerContainer.classList.add('hidden');
            
            // Update mode text
            this.modeText.textContent = 'Guess Hex Code';
        } else {
            // Show hex display, hide color display
            this.colorDisplayMode.classList.add('hidden');
            this.hexDisplayMode.classList.remove('hidden');
            
            // Show color picker, hide hex input
            this.hexInputContainer.classList.add('hidden');
            this.colorPickerContainer.classList.remove('hidden');
            
            // Update mode text
            this.modeText.textContent = 'Guess Color';
        }
        
        // Update game rules based on mode
        this.updateGameRules();
    }
    
    updateGameRules() {
        const hexGuessRules = `
            <ul>
                <li>Look at the displayed color</li>
                <li>Enter your best guess as a hex code (#RRGGBB)</li>
                <li>Get points based on accuracy (0-100)</li>
                <li>Build streaks for bonus points!</li>
            </ul>
        `;
        
        const colorGuessRules = `
            <ul>
                <li>Look at the displayed hex code</li>
                <li>Use the color picker to match the color</li>
                <li>Get points based on accuracy (0-100)</li>
                <li>Build streaks for bonus points!</li>
            </ul>
        `;
        
        if (this.gameMode === GAME_MODES.HEX_GUESS) {
            this.gameRulesEl.innerHTML = hexGuessRules;
        } else {
            this.gameRulesEl.innerHTML = colorGuessRules;
        }
    }
    
    showSubmitButton() {
        this.submitBtn.textContent = 'Submit Guess';
        this.submitBtn.style.display = 'block';
        this.nextBtn.style.display = 'none';
        this.submitBtn.disabled = false;
    }
    
    showNextButton() {
        this.submitBtn.style.display = 'none';
        this.nextBtn.style.display = 'block';
    }
    
    showFeedbackModal() {
        this.feedbackModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    closeFeedbackModal() {
        this.feedbackModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    showNewGameModal() {
        this.newGameModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    closeNewGameModal() {
        this.newGameModal.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    confirmNewGame() {
        this.closeNewGameModal();
        this.resetGame();
    }
    
    checkNewGameConfirmation() {
        // Close feedback modal first if it's open
        this.closeFeedbackModal();
        
        if (this.currentScore > 0 || this.streak > 0) {
            this.showNewGameModal();
        } else {
            this.resetGame();
        }
    }
    
    resetGame() {
        this.currentScore = 0;
        this.streak = 0;
        this.updateDisplay();
        this.startNewRound();
    }
    
    resetStats() {
        if (confirm('Are you sure you want to reset all statistics?')) {
            this.gameStats = {
                gamesPlayed: 0,
                totalScore: 0,
                averageScore: 0,
                highScore: 0,
                perfectGuesses: 0
            };
            this.saveGameStats();
            this.updateDisplay();
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new ColourGuesser();
    
    // Initialize custom color picker
    window.game.initializeCustomColorPicker();
    
    // Set initial UI state
    window.game.updateUIForMode();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        if (window.game && !window.game.isGameActive) {
            window.game.startNewRound();
        }
    }
    
    if (e.key === 'r' && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        if (window.game) {
            window.game.resetGame();
        }
    }
    
    if (e.key === 'm' && e.ctrlKey) {
        e.preventDefault();
        if (window.game) {
            window.game.modeSwitch.checked = !window.game.modeSwitch.checked;
            window.game.switchGameMode();
        }
    }
});
