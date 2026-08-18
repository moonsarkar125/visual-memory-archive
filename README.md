# ✦ Visual Memory Archive

> *Your little universe, in pieces.*

**Visual Memory Archive (VMA)** is a dark, visual-first personal archive for collecting memories, places, interests, thoughts, notes, collections, and moments in a way that feels personal rather than like a conventional social network.

---

### 🌐 Live Demo & Repository

* **Live Demo**: [https://visual-memory-archive.vercel.app](https://visual-memory-archive.vercel.app)
* **GitHub Repository**: [https://github.com/moonsarkar125/visual-memory-archive](https://github.com/moonsarkar125/visual-memory-archive)

---

## ✦ What is Visual Memory Archive?

Visual Memory Archive is designed around the concept of a **private digital universe**. Rather than broadcasting content to an endless algorithmic social feed, VMA gives individuals a personal space to preserve what matters—photographs, cozy cafés, favorite anime, books read, late-night thoughts, and travel itineraries.

### Product Philosophy
* **Memories First**: Photography and visual moments sit at the center of the experience.
* **Personal Organization**: Group memories into visual collections and nested child collections.
* **Private by Default**: Every memory and collection defaults to `🔒 Private`.
* **Optional Discovery**: Share public collections when you want others to explore your universe.
* **Anonymous & Funky Identities**: Express your current phase using custom handles like `@terribleracoon556`.
* **Quiet & Cinematic**: Free of ads, intrusive notifications, or social pressure.

> *Visual Memory Archive is intentionally NOT designed to be a direct Pinterest, Instagram, or Threads clone. It is a quiet, personal visual archive.*

---

## ✦ Preview

### Key Experience Highlights

* **Home Screen**: Personal greeting (`Good evening, @terribleracoon556`), recent moments, collection cards, Threads-style personal notes, and the *✦ Shuffle* discovery card.
* **Memory Viewer**: Full-screen cinema viewer with hero images, location pins, dates, mood tags (`☁ nostalgic`, `☕ cozy`, `✨ serene`), and keyboard arrow navigation (`← Prev`, `Next →`).
* **Collections & Sub-Collections**: Image-heavy collection covers with nested child collections (e.g. *Cafés in Jamshedpur* → *Study Cafés*, *Coffee Shops*, *Places To Visit*).
* **Search & Discovery**: Pill-filtered search engine (`ALL`, `BOARDS`, `MEMORIES`, `PLACES`, `NOTES`, `TAGS`).
* **Profile & Current Era**: Personal visual archive with memory stats, pinned collections, and a **Current Era** identity snapshot (*late night coding*, *☕ coffee*, *💻 cybersecurity*, *📚 books*, *🌙 2am thoughts*).

---

## ✦ Features

### ▦ Collections
Visual boards for organizing memories, interests, books, and travel plans with cover photos, descriptions, and locations.

### 📸 Moments
Fast visual memory entries containing photos, descriptions, dates, locations, mood badges, tags, and privacy controls.

### ✎ Notes
Short-form personal thoughts inspired by Threads-style writing, attached to collections or saved independently.

### 📂 Child Collections
Nested collection organization allowing multi-level structure without complex folder trees.

### 🔒 Privacy Controls
Visibility options (`🔒 Private` vs `◉ Public`) for every moment and collection, ensuring private content never appears in public search or discovery.

### 🔍 Search & Filter
Visual multi-entity search supporting real-time filtering across memories, locations, boards, and tags.

### 👤 Profile Archive
A personal identity profile featuring avatar, cover banner, memory counters, pinned collections, and a *Current Era* snapshot.

### 📱 Mobile-First Product Design
Designed specifically for mobile viewports with a 5-item bottom glass navigation bar (`HOME`, `SEARCH`, `CREATE`, `INBOX`, `PROFILE`), touch-friendly bottom sheets, and safe-area spacing.

---

## 🛠 Tech Stack

* **Framework**: Next.js 16.3.0 (App Router with Turbopack)
* **UI Engine**: React 19 & TypeScript 5.7
* **Styling**: Tailwind CSS v4 & Custom Glassmorphic Design System
* **Icons**: Lucide React (`lucide-react`)
* **Analytics & Hosting**: Vercel Analytics & Vercel Platform

---

## 🎨 Design Direction

The visual language of Visual Memory Archive is defined by restraint:

* **90% Deep Black (`#000000`, `#030305`, `#050507`)**: Dominant dark background with faint constellation light trails.
* **8% White & Gray (`#F5F5F7`, `#A0A0AA`)**: High-contrast, clean modern sans-serif typography.
* **2% Neon Lavender (`#C8A2FF`)**: Restrained accent color used exclusively for active navigation, glowing nodes, and selected filters.
* **Moonlight Glassmorphism**: Cards feature `rgba(255, 255, 255, 0.035)` black glass with subtle borders (`rgba(255, 255, 255, 0.08)`) and `backdrop-filter: blur(20px)`.

---

## 🧩 Product Structure

```
User
└── Profile (@terribleracoon556)
    ├── Collections (e.g. Cafés in Jamshedpur)
    │   ├── Child Collections (e.g. Study Cafés, Coffee Shops)
    │   └── Moments / Memories (e.g. Rainy Evening)
    └── Notes ("Maybe the best part of today was doing nothing.")
```

### 5 Primary Navigation Areas
1. **HOME**: Main universe overview & recent activity
2. **SEARCH**: Visual discovery & multi-tag search
3. **CREATE**: Bottom sheet for adding Moments, Collections, or Notes
4. **INBOX**: Activity notifications
5. **PROFILE**: Personal digital archive & Current Era snapshot

---

## 🔐 Privacy

Visual Memory Archive prioritizes private-first personal archiving.

* All new moments and collections default to **PRIVATE**.
* Private content is isolated and never exposed to public search or discovery.
* Public visibility is strictly opt-in for moments you wish to share.

---

## 🛣 Roadmap

### Current Focus
* [x] Visual collections & child collections
* [x] Moments & photo upload preview
* [x] Threads-style personal notes
* [x] Profile & Current Era identity snapshot
* [x] Mobile-first 5-item bottom glass navigation
* [x] Deep black cinematic visual system
* [x] LocalStorage persistence (`little-universe-v2`)

### Planned
* [ ] Interactive Timeline View (Grouped by Year & Month)
* [ ] Memory Shuffle ("Tonight's Little Discovery") audio soundscapes
* [ ] Story drafts & rich markdown articles
* [ ] Interactive Map-based memory pins
* [ ] AI-assisted visual memory organization

---

## 📌 Project Status

**Status**: *Active Development*  
Visual Memory Archive is an evolving personal visual archive and product prototype.

---

## 💻 Local Development

### Prerequisites
* Node.js v18.0.0+
* npm or pnpm

### Getting Started

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

Visual Memory Archive is deployed on Vercel:
[https://visual-memory-archive.vercel.app](https://visual-memory-archive.vercel.app)

---

## 📄 License

This project currently does not include an open-source license.

---

## 👤 Creator

**Shreya Sarkar**  
*Cyber Security Student & Developer*

* **GitHub**: [https://github.com/moonsarkar125](https://github.com/moonsarkar125)
* **Portfolio**: [https://moonsarkar125.github.io/she_can_foundation.html/](https://moonsarkar125.github.io/she_can_foundation.html/)
