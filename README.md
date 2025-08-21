# 🎨 Colour Guesser

A fun and interactive web-based color guessing game that tests your color vision and hex code knowledge. Challenge yourself with two different game modes!

## 🎮 Game Modes

### 1. Hex Guess Mode (Default)
- View a color and guess its hex code
- Type your best guess in #RRGGBB format
- Get real-time preview of your guess

### 2. Color Guess Mode
- View a hex code and pick the matching color
- Use the interactive color picker to find the right shade
- Visual feedback with selected color preview

## ✨ Features

- **Dual Game Modes**: Switch between guessing hex codes or colors
- **Smart Scoring System**: 0-100 points based on accuracy
- **Streak Bonuses**: Build streaks for extra points (≥70 points maintains streak)
- **Perfect Bonus**: +50 points for exact matches
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Game Statistics**: Track your progress with detailed stats
- **Local Storage**: Your stats persist between sessions
- **Color Analysis**: Get helpful hints about your guesses

## 🎯 Scoring System

- **Base Score**: 0-100 points based on color accuracy
- **Streak Bonus**: +5 points per streak level (max +50)
- **Perfect Bonus**: +50 points for 100% accuracy
- **Streak Maintenance**: Score ≥70 to maintain streak

## 🚀 Getting Started

1. Clone this repository
2. Open `index.html` in your web browser
3. Start guessing colors!

No build process or dependencies required - it's pure HTML, CSS, and JavaScript.

## 🎮 How to Play

### Hex Guess Mode
1. Look at the displayed color
2. Enter your best guess as a hex code (#RRGGBB)
3. Submit your guess to see how accurate you were
4. Build streaks for bonus points!

### Color Guess Mode
1. Look at the displayed hex code
2. Use the color picker to match the color
3. Submit your guess to see your accuracy
4. Build streaks for bonus points!

## 🎨 Project Structure

```
colour-guesser/
├── index.html          # Main HTML file
├── styles/
│   └── main.css        # All styling and responsive design
├── scripts/
│   ├── game.js         # Main game logic and UI management
│   ├── colorUtils.js   # Color conversion utilities
│   ├── colorPicker.js  # Custom color picker implementation
│   └── scoring.js      # Scoring system and statistics
└── README.md           # This file
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **Vanilla JavaScript**: No frameworks - pure ES6+ JavaScript
- **Local Storage**: For persistent game statistics

## 📱 Mobile Support

Fully responsive design optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Touch interfaces

## 🎨 Color Science

The game uses advanced color difference calculations to determine accuracy, taking into account human color perception for fair scoring.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Have Fun!

Test your color vision, learn hex codes, and challenge your friends to beat your high score!
