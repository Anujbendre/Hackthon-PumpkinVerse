<div align="center">

# 🎃 PumpkinVerse

### A Little World of Magic ✨

**Plant a seed. Grow your garden. Discover the magic.**

An interactive pumpkin farming adventure built with TypeScript, Phaser, and Vite.

[🌐 Play Live Demo](https://zingy-gnome-583128.netlify.app)

[💻 GitHub Repository](https://github.com/Anujbendre/Hackthon-PumpkinVerse)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Phaser](https://img.shields.io/badge/Phaser-8A2BE2?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

---

## 🌟 About the Project

PumpkinVerse is a browser-based farming adventure that brings a cozy,
autumn-inspired garden to life.

Players can explore their garden, interact with pumpkin plots, plant seeds,
grow crops, harvest pumpkins, and earn in-game rewards.

The project combines interactive gameplay, resource management, and a
colorful farming theme to create an enjoyable browser gaming experience.

**Our vision:** Bring a little magic to everyday gardening. 🌱

---

## ✨ Features

- 🎮 **Interactive Gameplay** — Explore the garden using keyboard controls.
- 🌱 **Seed Planting** — Interact with garden plots and plant crops.
- 🎃 **Pumpkin Farming** — Grow crops and harvest mature pumpkins.
- 🪙 **Resource Collection** — Earn coins and seeds through gameplay.
- 🛒 **Garden Shop** — Shop modules for seeds and decorative items.
- 🎁 **Daily Rewards** — A module for daily player rewards.
- 💾 **Progress Saving** — Browser storage for supported game progress.
- 🌐 **Browser-Based** — Play the deployed game without installing it locally.

*Note: Feature availability depends on the current implementation.
Verify shop, rewards, decorations, and saving in the live game before
presenting them as fully functional.*

---

## 🎮 How to Play

### Controls

| Action | Key |
|---|---|
| Move up | `W` or `Arrow Up` |
| Move down | `S` or `Arrow Down` |
| Move left | `A` or `Arrow Left` |
| Move right | `D` or `Arrow Right` |
| Interact with a plot | `E` |

### Your Adventure

1. Open PumpkinVerse in your browser.
2. Explore your garden using the movement controls.
3. Walk near a garden plot.
4. Press `E` to interact with the plot.
5. Plant seeds and care for your crops.
6. Harvest mature pumpkins and collect rewards.
7. Continue growing your garden!

*Gameplay actions may vary depending on the current implementation.*

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| TypeScript | Game and application logic |
| Phaser | 2D game framework |
| Vite | Development server and production builds |
| HTML5 | Web application structure |
| CSS3 | Styling and layout |
| LocalStorage | Browser-based progress persistence |
| Git | Version control |
| GitHub | Source code hosting |
| Netlify | Deployment and hosting |

---

## 🏗️ Project Structure

```text
PumpkinVerse/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── typescript.svg
│   │   └── vite.svg
│   ├── components/
│   │   └── GardenPreview.ts
│   ├── game/
│   │   ├── gameConfig.ts
│   │   ├── GameScene.ts
│   │   └── startGame.ts
│   ├── ui/
│   │   ├── Shop.ts
│   │   ├── ShopUI.ts
│   │   ├── DailyRewards.ts
│   │   └── DailyRewardsUI.ts
│   ├── main.ts
│   ├── counter.ts
│   └── style.css
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── LICENSE
└── README.md