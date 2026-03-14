# 🤖 No-CAPTCHA - Passive Human Verification System

![No-CAPTCHA Demo](https://via.placeholder.com/800x400.png?text=No-CAPTCHA+Verification+System)

## 🚀 Live Demo
**👉 [Click here to use the app](https://yourusername.github.io/no-captcha-verification/)**

## 📝 About The Project

An intelligent **ML-based passive human verification system** that replaces traditional CAPTCHA. Built for **Hack & Forge 2026** - Problem Statement 3.

### 🎯 The Problem
Traditional CAPTCHA creates friction in user experience. Enterprises need seamless verification.

### 💡 Our Solution
Passively analyze user behavior to determine if they're human:
- 🖱️ Mouse movement patterns
- ⌨️ Typing rhythm and speed
- ⏱️ Interaction time
- 📊 Browser characteristics

## ✨ Features

✅ **100% Passive** - No annoying CAPTCHA grids
✅ **Real-time Analysis** - Live score updates
✅ **Multi-signal Detection** - Combines multiple behavioral signals
✅ **Fallback Mechanism** - Only asks for verification when uncertain
✅ **Mobile Friendly** - Works on all devices
✅ **Privacy First** - No data stored, all analysis local

## 🛠️ How It Works

### 1. **Mouse Movement Analysis**
- Tracks speed variations
- Detects natural vs robotic movement
- Humans show irregular patterns

### 2. **Typing Pattern Recognition**
- Measures time between keystrokes
- Humans have variable typing speed
- Bots are too consistent

### 3. **Interaction Timing**
- Time spent on page
- Number of interactions
- Natural reading/behavior patterns

### 4. **Browser Entropy**
- Device characteristics
- Browser fingerprint
- Environmental signals

## 📊 Scoring System

| Score | Verdict | Action |
|-------|---------|--------|
| 70-100% | ✅ Human | Automatic access |
| 40-69%  | ⚠️ Low Confidence | Optional CAPTCHA |
| 0-39%   | 🤖 Bot Detected | Access denied |

## 🎯 Use Cases

- 🔐 Website login pages
- 💳 Payment verification
- 📝 Registration forms
- 🛒 Checkout processes
- 🌐 API protection

## 📱 Try It Yourself

1. **Move your mouse** naturally around the screen
2. **Type** in the username/password fields
3. Watch your **Human Score** increase
4. See how **no CAPTCHA** is needed!

## 🏗️ Built With

- **HTML5** - Structure
- **CSS3** - Styling & Animations
- **JavaScript** - ML Simulation & Logic
- **GitHub Pages** - Hosting

## 📹 Demo Video

[![Watch the demo](https://img.youtube.com/vi/your-video-id/0.jpg)](your-youtube-link)

## 🔬 Technical Implementation

```javascript
// Key innovation: Multi-signal weighted scoring
const weights = {
    mouse: 0.35,    // Mouse movements
    typing: 0.30,   // Typing patterns  
    time: 0.20,     // Interaction time
    browser: 0.15   // Browser entropy
};
