# ⚡ FocusBuddy – Chrome Extension Prototype

## 🧠 Overview

**FocusBuddy** is a smart Chrome extension prototype designed to help users monitor their focus, track productivity, and prevent digital fatigue.
With the increasing shift toward remote work and online learning, people face challenges like loss of concentration and burnout. This prototype demonstrates how a browser extension can track user activity, identify productive vs. distracting behavior, and remind users to take short breaks to maintain focus and well-being.



## 🎯 Objectives

* Track **active hours** based on browser usage.
* Provide **real-time feedback** and gentle **break reminders**.
* Encourage better digital habits and focus management.
* Serve **students, professionals, freelancers, and remote workers**.

---

## ⚙️ Features

✅ **Active Hours Counter**
Tracks how long the user remains active in the browser and displays it in the popup UI.

✅ **Smart Break Reminders**
After a certain number of keyboard/mouse actions, the extension shows a **notification** suggesting a 1-minute break.

✅ **Neon-Themed Popup UI**
Modern, sleek **black and neon-green interface** designed to look visually appealing during a demo.

✅ **Toggle & Reset Options**

* Enable/Disable monitoring easily.
* Reset tracked active time whenever needed.

✅ **Privacy-Focused Prototype**
No external data collection — everything runs locally in the user’s browser.

---

## 🧩 File Structure

```
prototype-extension/
│── manifest.json          # Extension configuration
│── background.js           # Handles active time & notifications
│── content.js              # Tracks user activity in webpages
│── popup.html              # Main popup interface
│── popup.js                # Popup logic (toggle, reset, display)
│── style.css               # Neon-green themed styles
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🚀 How to Run

1. Download or clone this project folder.
2. Open **Google Chrome / Microsoft Edge**.
3. Go to `chrome://extensions/` (or `edge://extensions/`).
4. Enable **Developer Mode** (top right corner).
5. Click **Load Unpacked** → select this folder.
6. The extension will appear in your toolbar (📌 pin it for quick access).
7. Open the popup → toggle “Enable Monitoring” to start tracking.

---

## 💡 Demo Workflow

1. When you’re active (mouse movement or typing), your **active time** starts increasing.
2. After a certain level of continuous activity, you’ll get a **desktop notification** reminding you to take a break.
3. You can reset the timer or disable tracking anytime from the popup UI.

---

## 🖤 UI Theme

* **Primary Color:** Neon Green (`#39ff14`)
* **Background:** Jet Black (`#0a0a0a`)
* **Font:** Segoe UI / Roboto
* **Style:** Futuristic glowing interface

---

## 🧠 Future Enhancements

* AI-based **Focus Scoring System**.
* Site categorization (LinkedIn, LeetCode = Productive; Instagram, YouTube = Distracting).
* Integration with a **web dashboard** for detailed productivity insights.
* Customizable focus sessions and break timers.

---

## 👨‍💻 Authors

**FocusBuddy Development Team (Final Year Project)**

* Project Type: Prototype Demonstration
* Role: Chrome Extension Developer, UI/UX Designer
* Tools: JavaScript, Chrome APIs, HTML, CSS

---

## 📌 Note

This version is a **prototype**, not a production release. It demonstrates the core ideas — activity tracking, break alerts, and user interaction — to visualize the project’s concept and functionality.

---

