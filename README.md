# Visual Memory Archive

> *"Your little universe, in pieces."*

**Visual Memory Archive (VMA)** is a private-first visual universe where individuals collect and arrange memories, photos, cafés, travel, books, anime, personal notes, and stories into a personalized, dark cinematic digital archive.

---

## ✦ Core Vision

Visual Memory Archive is built to feel like **opening your own private digital universe**. It combines visual memory collection, personal journaling, and quiet visual discovery into a mobile-first, dark glassmorphism interface.

* **90% Deep Black (`#000000`, `#030305`, `#050507`)** dominant atmosphere with subtle constellation light trails.
* **8% Soft White & Gray (`#F5F5F7`, `#A0A0AA`)** readable modern typography.
* **2% Neon Lavender (`#C8A2FF`)** focused accents for active navigation, glowing nodes, and subtle highlights.
* **Moonlight Glassmorphic Surfaces**: Translucent black glass frames (`rgba(255,255,255,0.035)`) surrounding high-contrast photography.

---

## 🌟 Key Features

### 1. 📱 Mobile-First 5-Item Bottom Navigation
* **`HOME`**: Personal universe dashboard with recent moments, collections, Threads-style personal notes, and quick search.
* **`SEARCH`**: Visual discovery engine with multi-tag pill filters (`ALL`, `BOARDS`, `MEMORIES`, `PLACES`, `NOTES`, `TAGS`).
* **`CREATE`**: Sliding glass bottom sheet for adding Moments, Collections, and Notes.
* **`INBOX`**: Quiet notification overview for saved collections, likes, and voyager activity.
* **`PROFILE`**: Personal digital archive, stats, pinned collections, and identity snapshots.

### 2. ✦ Shuffle ("Tonight's Little Discovery")
Randomly surfaces a cherished memory from your visual archive with a single tap, bringing old moments back into light.

### 3. 🔒 Private-First Architecture
All content is **PRIVATE BY DEFAULT** (`🔒 Private`), ensuring your memories remain completely private unless explicitly set to `◉ Public`.

### 4. 🎞️ Full-Screen Memory Viewer
Immersive modal and page view for high-res hero images, detailed notes, location pins, mood badges (`☁ nostalgic`, `☕ cozy`, `✨ serene`), and keyboard arrow key navigation (`← Prev`, `Next →`).

### 5. 📁 Collections & Child Collections
Hierarchical grouping for memories (e.g. *Cafés in Jamshedpur* → *Favorite cafés*, *Study cafés*, *Coffee shops*).

### 6. ✨ Current Era Identity Snapshot
Profile section capturing your present phase (*late night coding*, *☕ coffee*, *💻 cybersecurity*, *📚 books*, *🌙 2am thoughts*).

---

## 🛠️ Technology Stack

* **Framework**: Next.js 16 (App Router with Turbopack)
* **UI Library**: React 19 & TypeScript
* **Styling**: Tailwind CSS v4 & Vanilla Glassmorphism CSS
* **Icons**: Lucide React
* **Persistence**: LocalStorage state syncing (`little-universe-v2`)

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm** / **pnpm** / **yarn**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/moonsarkar125/visual-memory-archive.git

# 2. Navigate to project directory
cd visual-memory-archive

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Toggle mobile view (`Ctrl+Shift+M` in Chrome DevTools) for the best native app experience.

---

## 📂 Project Architecture

```
visual-memory-archive/
├── app/
│   ├── globals.css         # Deep black atmospheric background & glass tokens
│   ├── layout.tsx          # Root layout & PWA/SEO metadata
│   └── page.tsx            # Entry point rendering UniverseApp
├── components/
│   ├── universe-app.tsx    # Core Visual Memory Archive application
│   └── ui/                 # Reusable UI primitives
├── public/                 # PWA icons & static assets
├── package.json            # Project dependencies
└── README.md               # Repository documentation
```

---

## 🔒 Privacy Philosophy

Your memories belong to you. Visual Memory Archive stores your data locally by default. Private memories and private collections are never exposed to public search or discovery endpoints.

---

## 👤 Maintainer & Creator

Developed & maintained by **Shreya Sarkar** ([@moonsarkar125](https://github.com/moonsarkar125)).

* **Repository**: [https://github.com/moonsarkar125/visual-memory-archive](https://github.com/moonsarkar125/visual-memory-archive)
* **License**: MIT
