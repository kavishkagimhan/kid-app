# 🎓 Kids Alphabet Learning App

A fun, interactive alphabet learning website designed for children under 7 years old. Built with Next.js, Tailwind CSS, and Framer Motion.

## ✨ Features

- **Personalized Experience**: Asks for child's name on first visit and saves it to localStorage
- **Kid-Friendly Voice**: Uses Web Speech API with cheerful, friendly voice tones
- **Interactive Learning**: Large touch-friendly buttons with animations
- **Visual Examples**: Each letter has 3 example words with emoji icons
- **Celebrations**: Fun animations and encouraging messages when kids interact
- **Progress Tracking**: Visual progress bar shows learning progress
- **Mobile Optimized**: Fully responsive design for tablets and phones

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

Build a static export:

```bash
npm run build
```

The static files will be in the `out` directory, ready to deploy anywhere!

## 🎨 Tech Stack

- **Next.js 14** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Web Speech API** - Text-to-speech for kid-friendly voices

## 📱 Features Explained

### Welcome Screen
- Collects child's name (saved in localStorage)
- Greets the child with voice when starting

### Alphabet Learning
- Large, colorful letter display
- Tap letter to hear it pronounced
- Three example words per letter with emojis
- Previous/Next navigation
- Progress bar showing current position

### Celebrations
- Confetti animations on interactions
- Encouraging voice messages
- Visual feedback for correct actions

## 🎯 Design Principles

- **Large touch targets**: All buttons are big and easy to tap
- **Bright colors**: Cheerful gradients and vibrant colors
- **Minimal text**: Visual-first design for pre-readers
- **One interaction per screen**: Focused learning experience
- **Kid-friendly fonts**: Comic Sans style for approachable look

## 📦 Project Structure

```
.
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page with routing
│   └── globals.css     # Global styles
├── components/
│   ├── WelcomeScreen.tsx      # Name input screen
│   ├── AlphabetLearning.tsx   # Main learning interface
│   └── Celebration.tsx        # Celebration animations
├── lib/
│   ├── letters.ts      # Letter data with example words
│   ├── speech.ts       # Web Speech API utilities
│   └── storage.ts      # localStorage utilities
└── package.json
```

## 🌐 Browser Support

Works best on:
- Chrome/Edge (best Speech API support)
- Safari (iOS 7+)
- Firefox

Note: Web Speech API requires user interaction to work (browser security)

## 📝 License

Free to use and modify - 100% free, no backend, no paid APIs!

