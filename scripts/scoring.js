// Scoring system for the colour guessing game

/**
 * Calculates the score based on color accuracy
 * @param {Object} targetColor - Target RGB color {r, g, b}
 * @param {Object} guessColor - Guessed RGB color {r, g, b}
 * @returns {number} Score from 0-100
 */
function calculateScore(targetColor, guessColor) {
    const distance = calculateColorDistance(targetColor, guessColor);
    
    // Maximum possible distance in RGB space is sqrt(255^2 + 255^2 + 255^2) ≈ 441.67
    const maxDistance = Math.sqrt(255 * 255 * 3);
    
    // Convert distance to accuracy percentage (0-100)
    const accuracy = Math.max(0, 100 - (distance / maxDistance) * 100);
    
    // Round to nearest integer
    return Math.round(accuracy);
}

/**
 * Calculates bonus points based on streak and perfect matches
 * @param {number} baseScore - Base score from accuracy
 * @param {number} streak - Current streak count
 * @param {boolean} isPerfect - Whether the guess was perfect
 * @returns {Object} Score breakdown with bonuses
 */
function calculateBonusScore(baseScore, streak, isPerfect = false) {
    let bonusPoints = 0;
    let streakBonus = 0;
    let perfectBonus = 0;
    
    // Perfect match bonus (score of 100)
    if (isPerfect || baseScore === 100) {
        perfectBonus = 50;
        bonusPoints += perfectBonus;
    }
    
    // Streak bonus (increases with streak length)
    if (streak > 1) {
        streakBonus = Math.min(streak * 5, 50); // Max 50 bonus points from streak
        bonusPoints += streakBonus;
    }
    
    const totalScore = baseScore + bonusPoints;
    
    return {
        baseScore,
        perfectBonus,
        streakBonus,
        bonusPoints,
        totalScore
    };
}

/**
 * Determines the accuracy message based on score
 * @param {number} score - Score from 0-100
 * @returns {Object} Message and color class for feedback
 */
function getAccuracyFeedback(score) {
    if (score === 100) {
        return {
            message: "🎯 Perfect! Incredible color vision!",
            class: "perfect",
            emoji: "🎯"
        };
    } else if (score >= 95) {
        return {
            message: "🔥 Excellent! Almost perfect!",
            class: "excellent",
            emoji: "🔥"
        };
    } else if (score >= 85) {
        return {
            message: "⭐ Great job! Very close!",
            class: "great",
            emoji: "⭐"
        };
    } else if (score >= 70) {
        return {
            message: "👍 Good guess! Getting warmer!",
            class: "good",
            emoji: "👍"
        };
    } else if (score >= 50) {
        return {
            message: "🤔 Not bad, but you can do better!",
            class: "okay",
            emoji: "🤔"
        };
    } else if (score >= 25) {
        return {
            message: "😅 Keep trying! Practice makes perfect!",
            class: "poor",
            emoji: "😅"
        };
    } else {
        return {
            message: "🎨 Way off! Study those colors more!",
            class: "very-poor",
            emoji: "🎨"
        };
    }
}

/**
 * Analyzes which RGB channels were closest/furthest
 * @param {Object} targetColor - Target RGB color
 * @param {Object} guessColor - Guessed RGB color
 * @returns {Object} Analysis of RGB channel accuracy
 */
function analyzeColorChannels(targetColor, guessColor) {
    const rDiff = Math.abs(targetColor.r - guessColor.r);
    const gDiff = Math.abs(targetColor.g - guessColor.g);
    const bDiff = Math.abs(targetColor.b - guessColor.b);
    
    const channels = [
        { name: 'Red', diff: rDiff, target: targetColor.r, guess: guessColor.r },
        { name: 'Green', diff: gDiff, target: targetColor.g, guess: guessColor.g },
        { name: 'Blue', diff: bDiff, target: targetColor.b, guess: guessColor.b }
    ];
    
    // Sort by accuracy (smallest difference first)
    channels.sort((a, b) => a.diff - b.diff);
    
    const bestChannel = channels[0];
    const worstChannel = channels[2];
    
    let hints = [];
    
    if (worstChannel.diff > 50) {
        const direction = worstChannel.guess < worstChannel.target ? 'higher' : 'lower';
        hints.push(`${worstChannel.name} needs to be ${direction}`);
    }
    
    if (bestChannel.diff <= 10) {
        hints.push(`${bestChannel.name} was very close!`);
    }
    
    return {
        bestChannel: bestChannel.name,
        worstChannel: worstChannel.name,
        hints,
        channelAccuracy: channels
    };
}

/**
 * Updates streak based on score threshold
 * @param {number} score - Current round score
 * @param {number} currentStreak - Current streak count
 * @param {number} threshold - Minimum score to maintain streak (default 70)
 * @returns {number} New streak count
 */
function updateStreak(score, currentStreak, threshold = 70) {
    if (score >= threshold) {
        return currentStreak + 1;
    } else {
        return 0; // Reset streak
    }
}

/**
 * Calculates running average score
 * @param {number} currentAverage - Current average score
 * @param {number} newScore - New score to include
 * @param {number} totalGames - Total number of games played
 * @returns {number} New average score
 */
function updateAverageScore(currentAverage, newScore, totalGames) {
    if (totalGames === 1) {
        return newScore;
    }
    
    return Math.round(((currentAverage * (totalGames - 1)) + newScore) / totalGames);
}
