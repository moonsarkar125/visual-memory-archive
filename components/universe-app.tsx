'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import {
  Archive, ArrowLeft, Bell, BookOpen, Camera, ChevronRight, CircleUserRound,
  FileText, Globe2, ImagePlus, LockKeyhole, MapPin, MoreHorizontal,
  Pencil, Plus, Search, Send, Settings, Sparkles, Trash2, X, Heart, LayoutGrid,
  Shuffle, ArrowRight, Compass, Eye, Shield, Tag, Calendar, Layers
} from 'lucide-react'

// Standard visual assets
const images = {
  cafe: 'https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=900&q=85',
  japan: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85',
  books: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=800&q=85',
  rain: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=85',
  tea: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=85',
  hills: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=85',
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=85',
  library: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=85',
}

export type PrivacyStatus = 'private' | 'public'

export type Board = {
  id: string
  name: string
  description: string
  image: string
  count: number
  location?: string
  privacy: PrivacyStatus
  children?: string[]
}

export type Memory = {
  id: string
  title: string
  description: string
  image?: string
  boardId: string
  date: string
  location?: string
  privacy: PrivacyStatus
  tags: string[]
  mood?: string
}

export type Note = {
  id: string
  text: string
  date: string
  privacy: PrivacyStatus
}

export type Profile = {
  username: string
  displayName: string
  bio: string
  avatar: string
  cover: string
  location: string
  currentEra: string[]
}

const starterBoards: Board[] = [
  {
    id: 'cafes',
    name: 'Cafés in Jamshedpur',
    description: 'little tables, long conversations, and warm cups',
    image: images.cafe,
    count: 12,
    location: 'Jamshedpur',
    privacy: 'private',
    children: ['Favorite cafés', 'Study cafés', 'Coffee shops', 'Places to visit'],
  },
  {
    id: 'japan',
    name: 'Japan — someday',
    description: 'a soft itinerary for later',
    image: images.japan,
    count: 12,
    location: 'Japan',
    privacy: 'public',
    children: ['Tokyo', 'Kyoto', 'Osaka', 'Shrines'],
  },
  {
    id: 'books',
    name: 'Books I have read',
    description: 'pages that stayed long after finishing',
    image: images.books,
    count: 18,
    privacy: 'private',
    children: ['Favorites', 'Currently reading'],
  },
  {
    id: 'anime',
    name: 'Anime universe',
    description: 'favorites and recommendations',
    image: images.hills,
    count: 43,
    privacy: 'private',
  },
]

const starterMemories: Memory[] = [
  {
    id: 'rain',
    title: 'Rainy evening',
    description: 'One of those evenings that felt quietly perfect. Rain tapping softly against the window.',
    image: images.rain,
    boardId: 'cafes',
    date: 'August 2026',
    location: 'Jamshedpur',
    privacy: 'private',
    mood: '☁ nostalgic',
    tags: ['rain', 'quiet', 'café'],
  },
  {
    id: 'tea',
    title: 'A cup of calm',
    description: 'Some mornings are meant to be taken slowly with green tea.',
    image: images.tea,
    boardId: 'cafes',
    date: 'August 2026',
    location: 'Home',
    privacy: 'private',
    mood: '☕ cozy',
    tags: ['morning', 'tea'],
  },
  {
    id: 'tokyo',
    title: 'Tokyo alley lights',
    description: 'Neon signs reflecting on wet pavement late at night in Shinjuku.',
    image: images.tokyo,
    boardId: 'japan',
    date: 'July 2026',
    location: 'Tokyo',
    privacy: 'public',
    mood: '✨ serene',
    tags: ['japan', 'night', 'lights'],
  },
  {
    id: 'library',
    title: 'Quiet reading nook',
    description: 'A hidden sanctuary where time slows down between wooden bookshelves.',
    image: images.library,
    boardId: 'books',
    date: 'July 2026',
    location: 'Library',
    privacy: 'private',
    mood: '📚 peaceful',
    tags: ['books', 'quiet'],
  },
  {
    id: 'espresso',
    title: 'Late night espresso',
    description: 'The aroma of freshly roasted beans in a dimly lit corner café.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85',
    boardId: 'cafes',
    date: 'August 2026',
    location: 'Jamshedpur',
    privacy: 'private',
    mood: '☕ cozy',
    tags: ['coffee', 'night'],
  },
  {
    id: 'sky',
    title: 'Constellation view',
    description: 'Looking up at a clear night sky full of distant stars.',
    image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=85',
    boardId: 'japan',
    date: 'August 2026',
    location: 'Observatory',
    privacy: 'public',
    mood: '✨ serene',
    tags: ['night', 'stars'],
  },
]

const starterNotes: Note[] = [
  {
    id: 'note-1',
    text: 'Some places are worth remembering for reasons you can\'t explain.',
    date: 'August 6, 2026',
    privacy: 'private',
  },
  {
    id: 'note-2',
    text: 'Maybe the best part of today was doing absolutely nothing.',
    date: 'August 12, 2026',
    privacy: 'private',
  },
]

const starterProfile: Profile = {
  username: 'terribleracoon556',
  displayName: 'Shreya',
  bio: 'collecting little moments ✦',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  cover: images.japan,
  location: 'Jamshedpur',
  currentEra: ['late night coding', '☕ coffee', '💻 cybersecurity', '📚 books', '🌙 2am thoughts'],
}

const uid = () => Math.random().toString(36).slice(2, 9)

export default function UniverseApp() {
  const [page, setPage] = useState<'home' | 'search' | 'inbox' | 'profile' | 'board' | 'memory'>('home')
  const [boards, setBoards] = useState<Board[]>(starterBoards)
  const [memories, setMemories] = useState<Memory[]>(starterMemories)
  const [notes, setNotes] = useState<Note[]>(starterNotes)
  const [profile, setProfile] = useState<Profile>(starterProfile)

  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [sheet, setSheet] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [shuffledMemory, setShuffledMemory] = useState<Memory | null>(null)

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('little-universe-v2') || localStorage.getItem('little-universe-v1')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.boards) setBoards(data.boards)
        if (data.memories) setMemories(data.memories)
        if (data.notes) setNotes(data.notes)
        if (data.profile) setProfile({ ...starterProfile, ...data.profile })
      }
    } catch {}
  }, [])

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('little-universe-v2', JSON.stringify({ boards, memories, notes, profile }))
  }, [boards, memories, notes, profile])

  // Clear toast automatically
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2400)
      return () => clearTimeout(t)
    }
  }, [toast])

  // Pick initial shuffle memory
  useEffect(() => {
    if (memories.length > 0 && !shuffledMemory) {
      const randomIdx = Math.floor(Math.random() * memories.length)
      setShuffledMemory(memories[randomIdx])
    }
  }, [memories, shuffledMemory])

  const handleShuffle = useCallback(() => {
    if (memories.length === 0) return
    const currentId = shuffledMemory?.id
    const candidates = memories.filter(m => m.id !== currentId)
    const pool = candidates.length > 0 ? candidates : memories
    const randomIdx = Math.floor(Math.random() * pool.length)
    setShuffledMemory(pool[randomIdx])
    setToast('Surfaced a random memory ✦')
  }, [memories, shuffledMemory])

  const openBoard = (board: Board) => {
    setSelectedBoard(board)
    setPage('board')
  }

  const openMemory = (memory: Memory) => {
    setSelectedMemory(memory)
    setPage('memory')
  }

  const addBoard = (boardData: Omit<Board, 'id' | 'count'>) => {
    const nextBoard: Board = { ...boardData, id: uid(), count: 0 }
    setBoards(v => [nextBoard, ...v])
    setSheet(null)
    setToast('Collection created in your universe')
  }

  const addMemory = (memoryData: Omit<Memory, 'id'>) => {
    const nextMemory: Memory = { ...memoryData, id: uid() }
    setMemories(v => [nextMemory, ...v])
    setBoards(v => v.map(b => b.id === memoryData.boardId ? { ...b, count: b.count + 1 } : b))
    setSheet(null)
    setToast('Moment saved safely 🔒')
  }

  const addNote = (text: string) => {
    const nextNote: Note = { id: uid(), text, date: 'August 2026', privacy: 'private' }
    setNotes(v => [nextNote, ...v])
    setSheet(null)
    setToast('Thought tucked away')
  }

  const deleteMemory = () => {
    if (!selectedMemory) return
    setMemories(v => v.filter(m => m.id !== selectedMemory.id))
    setBoards(v => v.map(b => b.id === selectedMemory.boardId ? { ...b, count: Math.max(0, b.count - 1) } : b))
    setSelectedMemory(null)
    setPage('home')
    setToast('Memory deleted')
  }

  const toggleMemoryPrivacy = (memoryId: string) => {
    setMemories(v => v.map(m => {
      if (m.id === memoryId) {
        const nextPrivacy: PrivacyStatus = m.privacy === 'private' ? 'public' : 'private'
        setToast(`Memory is now ${nextPrivacy.toUpperCase()}`)
        return { ...m, privacy: nextPrivacy }
      }
      return m
    }))
    if (selectedMemory && selectedMemory.id === memoryId) {
      setSelectedMemory(v => v ? { ...v, privacy: v.privacy === 'private' ? 'public' : 'private' } : null)
    }
  }

  // Previous & Next memory navigation
  const navigateMemory = (direction: 'prev' | 'next') => {
    if (!selectedMemory || memories.length === 0) return
    const currentIndex = memories.findIndex(m => m.id === selectedMemory.id)
    if (currentIndex === -1) return
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    if (nextIndex >= memories.length) nextIndex = 0
    if (nextIndex < 0) nextIndex = memories.length - 1
    setSelectedMemory(memories[nextIndex])
  }

  return (
    <div className="universe-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <main className="app-frame">
        {page === 'home' && (
          <HomePage
            profile={profile}
            boards={boards}
            memories={memories}
            notes={notes}
            shuffledMemory={shuffledMemory}
            onShuffle={handleShuffle}
            onBoard={openBoard}
            onMemory={openMemory}
            onCreate={() => setSheet('menu')}
          />
        )}

        {page === 'search' && (
          <SearchPage
            boards={boards}
            memories={memories}
            notes={notes}
            onBoard={openBoard}
            onMemory={openMemory}
          />
        )}

        {page === 'inbox' && <InboxPage />}

        {page === 'profile' && (
          <ProfilePage
            profile={profile}
            boards={boards}
            memories={memories}
            notes={notes}
            onBoard={openBoard}
            onMemory={openMemory}
            onEditProfile={() => setSheet('profile')}
          />
        )}

        {page === 'board' && selectedBoard && (
          <BoardPage
            board={selectedBoard}
            memories={memories.filter(m => m.boardId === selectedBoard.id)}
            onBack={() => setPage('home')}
            onMemory={openMemory}
            onCreate={() => setSheet('memory')}
          />
        )}

        {page === 'memory' && selectedMemory && (
          <MemoryPage
            memory={selectedMemory}
            board={boards.find(b => b.id === selectedMemory.boardId)}
            onBack={() => setPage('home')}
            onDelete={deleteMemory}
            onTogglePrivacy={() => toggleMemoryPrivacy(selectedMemory.id)}
            onNext={() => navigateMemory('next')}
            onPrev={() => navigateMemory('prev')}
          />
        )}

        {/* Fixed 5-Item Bottom Navigation */}
        {page !== 'board' && page !== 'memory' && (
          <BottomNav
            activeTab={page}
            onTabSelect={setPage}
            onCreateSelect={() => setSheet('menu')}
          />
        )}
      </main>

      {/* Creation Bottom Sheet */}
      {sheet && (
        <CreationSheet
          type={sheet}
          boards={boards}
          profile={profile}
          onClose={() => setSheet(null)}
          onBoard={addBoard}
          onMemory={addMemory}
          onNote={addNote}
          onProfile={p => {
            setProfile(p)
            setSheet(null)
            setToast('Profile updated')
          }}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast">
          <Sparkles size={16} /> {toast}
        </div>
      )}
    </div>
  )
}

/* Glassmorphic Image Shell Component */
function GlassImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <span className={`image-shell ${loaded ? 'is-loaded' : ''}`}>
      <span className="image-skeleton" aria-hidden="true" />
      <img className={className} src={src} alt={alt} onLoad={() => setLoaded(true)} />
    </span>
  )
}

/* 5-Item Mobile-First Bottom Navigation */
function BottomNav({
  activeTab,
  onTabSelect,
  onCreateSelect,
}: {
  activeTab: string
  onTabSelect: (tab: any) => void
  onCreateSelect: () => void
}) {
  return (
    <nav className="bottom-nav" aria-label="Bottom Navigation">
      <button
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => onTabSelect('home')}
      >
        <Archive />
        <span>HOME</span>
        {activeTab === 'home' && <span className="nav-item-indicator" />}
      </button>

      <button
        className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}
        onClick={() => onTabSelect('search')}
      >
        <Search />
        <span>SEARCH</span>
        {activeTab === 'search' && <span className="nav-item-indicator" />}
      </button>

      <button
        className="create-nav-button"
        aria-label="Create something new"
        onClick={onCreateSelect}
      >
        <Plus />
      </button>

      <button
        className={`nav-item ${activeTab === 'inbox' ? 'active' : ''}`}
        onClick={() => onTabSelect('inbox')}
      >
        <Bell />
        <span>INBOX</span>
        {activeTab === 'inbox' && <span className="nav-item-indicator" />}
      </button>

      <button
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => onTabSelect('profile')}
      >
        <CircleUserRound />
        <span>PROFILE</span>
        {activeTab === 'profile' && <span className="nav-item-indicator" />}
      </button>
    </nav>
  )
}

/* HOME PAGE — EDITORIAL RECOMPOSITION */
function HomePage({
  profile,
  boards,
  memories,
  notes,
  shuffledMemory,
  onShuffle,
  onBoard,
  onMemory,
  onCreate,
}: {
  profile: Profile
  boards: Board[]
  memories: Memory[]
  notes: Note[]
  shuffledMemory: Memory | null
  onShuffle: () => void
  onBoard: (b: Board) => void
  onMemory: (m: Memory) => void
  onCreate: () => void
}) {
  const featuredMemory = memories[0]
  const recentMoments = memories.slice(1)
  const mainBoard = boards[0]
  const otherBoards = boards.slice(1)

  return (
    <section className="screen">
      {/* Header — Spacious Editorial Greeting */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="eyebrow flex items-center gap-1.5 mb-1">
            <Sparkles size={11} className="text-[#c8a2ff]" /> MY UNIVERSE
          </span>
          <h1 className="title-large">
            Good evening,<br />
            <span className="text-[#c8a2ff] font-semibold">@{profile.username}</span>
          </h1>
          <p className="lede mt-1">Your little universe, in pieces ✦</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreate}
            className="p-2.5 rounded-full border border-white/12 bg-white/5 text-white/70 hover:text-white hover:border-[#c8a2ff]/40 transition-all"
            title="Create new memory"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* FEATURED HERO MEMORY (The Hero of the Viewport) */}
      {featuredMemory && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="eyebrow flex items-center gap-1">
              <Sparkles size={11} className="text-[#c8a2ff]" /> FEATURED MEMORY
            </span>
            <span className="text-[11px] text-white/40">Opening Scene</span>
          </div>
          <div
            onClick={() => onMemory(featuredMemory)}
            className="glass-card relative h-[340px] rounded-3xl overflow-hidden group cursor-pointer border border-white/12 shadow-2xl transition-all hover:border-[#c8a2ff]/40"
          >
            {featuredMemory.image ? (
              <GlassImage src={featuredMemory.image} alt={featuredMemory.title} />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-white/10 to-black/90 flex items-center justify-center text-white/30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="text-[10px] bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-white/90 font-medium">
                {featuredMemory.mood || '✨ featured'}
              </span>
              <span className={`badge-privacy ${featuredMemory.privacy === 'public' ? 'is-public' : ''}`}>
                {featuredMemory.privacy === 'private' ? <LockKeyhole size={9} /> : <Globe2 size={9} />}
                {featuredMemory.privacy}
              </span>
            </div>
            <div className="absolute bottom-5 left-5 right-5 space-y-1">
              <h2 className="text-2xl font-bold text-white group-hover:text-[#c8a2ff] transition-colors leading-tight">
                {featuredMemory.title}
              </h2>
              <p className="text-xs text-white/70 line-clamp-1">{featuredMemory.description}</p>
              <div className="flex items-center gap-3 text-[11px] text-white/50 pt-1">
                {featuredMemory.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={10} className="text-[#c8a2ff]" /> {featuredMemory.location}
                  </span>
                )}
                <span>· {featuredMemory.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING EDITORIAL QUOTE NOTE (Floating directly on page background) */}
      <div className="my-7 pl-4 border-l-2 border-l-[#c8a2ff] py-1">
        <p className="text-sm italic font-serif text-white/85 leading-relaxed">
          "Maybe memories are just places we decided not to forget."
        </p>
        <span className="text-[10px] text-white/40 block mt-1 uppercase tracking-wider">— Archive Reflection</span>
      </div>

      {/* TONIGHT'S LITTLE DISCOVERY (Secondary Feature Reveal) */}
      {shuffledMemory && (
        <div className="shuffle-card mb-8">
          {shuffledMemory.image && (
            <div className="w-14 h-14 rounded-xl overflow-hidden mr-3.5 flex-shrink-0 border border-white/15">
              <GlassImage src={shuffledMemory.image} alt={shuffledMemory.title} />
            </div>
          )}
          <div className="shuffle-card-content">
            <span className="eyebrow flex items-center gap-1.5 text-[10px]">
              <Shuffle size={10} /> TONIGHT'S DISCOVERY
            </span>
            <p className="text-xs font-medium text-white">{shuffledMemory.title}</p>
            <small className="text-[10px] text-white/50">
              {shuffledMemory.location && `${shuffledMemory.location} · `}
              {shuffledMemory.date}
            </small>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={() => onMemory(shuffledMemory)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#c8a2ff] text-black hover:bg-[#d8c2ff] transition-all flex items-center gap-1 shadow-md shadow-[#c8a2ff]/15"
            >
              View <ArrowRight size={11} />
            </button>
          </div>
        </div>
      )}

      {/* ASYMMETRIC CURATED COLLECTIONS (YOUR COLLECTIONS) */}
      <div className="mb-8">
        <div className="section-header">
          <h2>YOUR COLLECTIONS</h2>
          <button onClick={() => {}}>
            See all <ChevronRight size={14} />
          </button>
        </div>

        {/* Asymmetric Editorial Grid: 1 Large Hero Collection + Staggered Cards */}
        <div className="space-y-3">
          {mainBoard && (
            <div
              onClick={() => onBoard(mainBoard)}
              className="glass-card relative h-48 rounded-3xl overflow-hidden group cursor-pointer border border-white/12 p-5 flex flex-col justify-between"
            >
              <GlassImage src={mainBoard.image} alt={mainBoard.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[10px] bg-black/60 px-2.5 py-1 rounded-full border border-white/15 text-[#c8a2ff] uppercase tracking-wider font-semibold">
                  FEATURED COLLECTION
                </span>
                <span className={`badge-privacy ${mainBoard.privacy === 'public' ? 'is-public' : ''}`}>
                  {mainBoard.privacy === 'private' ? <LockKeyhole size={9} /> : <Globe2 size={9} />}
                  {mainBoard.privacy}
                </span>
              </div>
              <div className="relative z-10 space-y-1">
                <strong className="text-xl text-white font-semibold block group-hover:text-[#c8a2ff] transition-colors">
                  {mainBoard.name}
                </strong>
                <p className="text-xs text-white/70 line-clamp-1">{mainBoard.description}</p>
                <small className="text-[11px] text-white/50 flex items-center gap-2">
                  {mainBoard.count} memories · {mainBoard.location}
                </small>
              </div>
            </div>
          )}

          {otherBoards.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {otherBoards.map(board => (
                <BoardCard key={board.id} board={board} onClick={() => onBoard(board)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DYNAMIC RECENT MOMENTS COLLAGE RAIL */}
      <div className="mb-8">
        <div className="section-header">
          <h2>RECENT MOMENTS</h2>
          <button onClick={() => {}}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="memory-row pb-2">
          {recentMoments.map(memory => (
            <MemoryCard key={memory.id} memory={memory} onClick={() => onMemory(memory)} />
          ))}
        </div>
      </div>

      {/* ARCHIVE NOTES */}
      <div>
        <div className="section-header">
          <h2>NOTES FROM MY UNIVERSE</h2>
        </div>
        <div className="notes-grid mb-6">
          {notes.map(note => (
            <div key={note.id} className="note-card">
              <FileText size={16} className="text-[#c8a2ff] mb-2" />
              <p>"{note.text}"</p>
              <span>{note.date}</span>
            </div>
          ))}
          <button
            onClick={onCreate}
            className="p-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-[#c8a2ff] text-xs font-semibold flex items-center justify-center gap-2 hover:border-[#c8a2ff]/40 transition-all"
          >
            <Plus size={16} /> Write a note
          </button>
        </div>
      </div>
    </section>
  )
}

/* MEMORY CARD COMPONENT */
function MemoryCard({ memory, onClick }: { memory: Memory; onClick: () => void }) {
  return (
    <button className="memory-card group relative" onClick={onClick}>
      {memory.image ? (
        <GlassImage src={memory.image} alt={memory.title} />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-white/10 to-black/80 flex items-center justify-center text-white/30">
          <ImagePlus size={24} />
        </div>
      )}
      <div className="memory-overlay">
        <div className="flex items-center justify-between gap-1">
          {memory.mood ? (
            <span className="text-[10px] bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15 text-white/90 font-medium">
              {memory.mood}
            </span>
          ) : <span />}
          <span className={`badge-privacy ${memory.privacy === 'public' ? 'is-public' : ''}`}>
            {memory.privacy === 'private' ? <LockKeyhole size={9} /> : <Globe2 size={9} />}
            {memory.privacy}
          </span>
        </div>
        <div className="space-y-0.5">
          <strong className="block text-sm text-white font-semibold group-hover:text-[#c8a2ff] transition-colors">{memory.title}</strong>
          <small className="text-white/60 text-[11px] flex items-center gap-1">
            {memory.location && <><MapPin size={10} className="text-[#c8a2ff]" /> {memory.location} · </>}
            {memory.date}
          </small>
        </div>
      </div>
    </button>
  )
}

/* BOARD / COLLECTION CARD COMPONENT */
function BoardCard({ board, onClick }: { board: Board; onClick: () => void }) {
  return (
    <button className="board-card glass-card group text-left" onClick={onClick}>
      <div className="board-cover relative overflow-hidden">
        <GlassImage src={board.image} alt={board.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-2.5 right-2.5">
          <span className={`badge-privacy ${board.privacy === 'public' ? 'is-public' : ''}`}>
            {board.privacy === 'private' ? <LockKeyhole size={9} /> : <Globe2 size={9} />}
            {board.privacy}
          </span>
        </div>
      </div>
      <div className="board-card-body">
        <div className="flex items-center justify-between text-[10px] text-white/50 uppercase tracking-wider">
          <span>{board.count} memories</span>
          {board.children && <span>{board.children.length} sub</span>}
        </div>
        <strong className="group-hover:text-[#c8a2ff] transition-colors">{board.name}</strong>
        {board.location && (
          <small className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
            <MapPin size={10} className="text-[#c8a2ff]" /> {board.location}
          </small>
        )}
      </div>
    </button>
  )
}

/* SEARCH & DISCOVERY PAGE — PREMIUM COMMERCIAL REDESIGN */
function SearchPage({
  boards,
  memories,
  notes,
  onBoard,
  onMemory,
}: {
  boards: Board[]
  memories: Memory[]
  notes: Note[]
  onBoard: (b: Board) => void
  onMemory: (m: Memory) => void
}) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('ALL')
  const [isFocused, setIsFocused] = useState(false)

  const filterOptions = ['ALL', 'BOARDS', 'MEMORIES', 'PLACES', 'NOTES', 'TAGS']
  const feelingTags = ['nostalgic', 'cozy', 'dreamy', 'rainy', 'peaceful', 'late night', 'wanderlust']

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim()

    const matchingBoards = boards.filter(b =>
      (activeFilter === 'ALL' || activeFilter === 'BOARDS') &&
      (!q || b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.location?.toLowerCase().includes(q))
    )

    const matchingMemories = memories.filter(m =>
      (activeFilter === 'ALL' || activeFilter === 'MEMORIES' || activeFilter === 'PLACES' || activeFilter === 'TAGS') &&
      (!q || m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.location?.toLowerCase().includes(q) || m.tags.some(t => t.toLowerCase().includes(q)))
    )

    return { boards: matchingBoards, memories: matchingMemories }
  }, [query, activeFilter, boards, memories])

  const totalResultsCount = filteredResults.boards.length + filteredResults.memories.length

  return (
    <section className="screen">
      {/* Editorial Search Hero */}
      <div className="mb-6">
        <span className="eyebrow flex items-center gap-1.5 mb-1">
          <Sparkles size={11} className="text-[#c8a2ff]" /> YOUR UNIVERSE
        </span>
        <h1 className="text-3xl font-light text-white tracking-tight">
          Search your <span className="text-[#c8a2ff] font-medium">universe.</span>
        </h1>
        <p className="text-xs text-white/60 mt-1">Look for places, feelings, memories and little things.</p>
      </div>

      {/* Floating Smoked Glass Search Surface */}
      <div className="relative mb-5 z-20">
        <div className={`flex items-center gap-3.5 bg-white/[0.035] border rounded-2xl px-4 py-3.5 transition-all backdrop-blur-xl shadow-2xl ${
          isFocused ? 'border-[#c8a2ff]/60 shadow-[#c8a2ff]/10 ring-1 ring-[#c8a2ff]/20' : 'border-white/12'
        }`}>
          <Search size={18} className={`transition-colors ${isFocused ? 'text-[#c8a2ff]' : 'text-white/40'}`} />
          <input
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search memories, places, feelings..."
            className="bg-transparent border-none outline-none text-white w-full text-sm placeholder:text-white/40"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="text-white/40 hover:text-white transition-colors">
              <X size={16} />
            </button>
          ) : (
            <span className="text-[10px] text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md font-mono flex-shrink-0">
              ⌘ K
            </span>
          )}
        </div>

        {/* Visual Search Suggestions Dropdown (On Focus) */}
        {isFocused && !query && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-card p-4 rounded-2xl border border-white/15 backdrop-blur-2xl shadow-2xl z-30 animate-fadeIn space-y-4">
            <div>
              <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block mb-2">RECENT SEARCHES</span>
              <div className="flex flex-wrap gap-2">
                {['Tokyo', 'Cafés', 'Japan', 'Books'].map(item => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 hover:border-[#c8a2ff]/40 hover:text-white transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-[#c8a2ff] font-semibold uppercase tracking-wider block mb-2">TRY SEARCHING</span>
              <div className="space-y-1.5 text-xs text-white/70">
                <p onClick={() => setQuery('places I want to visit')} className="hover:text-[#c8a2ff] cursor-pointer transition-colors">
                  "places I want to visit"
                </p>
                <p onClick={() => setQuery('rainy memories')} className="hover:text-[#c8a2ff] cursor-pointer transition-colors">
                  "rainy memories"
                </p>
                <p onClick={() => setQuery('late night cafés')} className="hover:text-[#c8a2ff] cursor-pointer transition-colors">
                  "late night cafés"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Minimal Editorial Filters */}
      <div className="flex gap-4 overflow-x-auto pb-2 mb-6 scrollbar-none border-b border-white/10">
        {filterOptions.map(option => (
          <button
            key={option}
            onClick={() => setActiveFilter(option)}
            className={`pb-2 text-xs font-semibold tracking-wider transition-all relative ${
              activeFilter === option ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {option}
            {activeFilter === option && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c8a2ff] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* "Search By Feeling" Discovery Section */}
      {!query && (
        <div className="mb-8">
          <span className="eyebrow block mb-2.5">SEARCH BY FEELING</span>
          <div className="flex flex-wrap gap-2">
            {feelingTags.map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-white/80 hover:border-[#c8a2ff]/40 hover:text-white transition-all flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8a2ff]" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Header */}
      {query && (
        <div className="flex items-center justify-between text-xs text-white/50 mb-4">
          <span>RESULTS FOR "{query}"</span>
          <span>{totalResultsCount} items found</span>
        </div>
      )}

      {/* Board Results */}
      {filteredResults.boards.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <h3 className="text-xs font-semibold text-[#c8a2ff] uppercase tracking-wider">Collections</h3>
            <span className="text-[10px] text-white/40">{filteredResults.boards.length} results</span>
          </div>
          <div className="board-grid">
            {filteredResults.boards.map(b => (
              <BoardCard key={b.id} board={b} onClick={() => onBoard(b)} />
            ))}
          </div>
        </div>
      )}

      {/* Memory Results */}
      {filteredResults.memories.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <h3 className="text-xs font-semibold text-[#c8a2ff] uppercase tracking-wider">Memories</h3>
            <span className="text-[10px] text-white/40">{filteredResults.memories.length} results</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filteredResults.memories.map(m => (
              <MemoryCard key={m.id} memory={m} onClick={() => onMemory(m)} />
            ))}
          </div>
        </div>
      )}

      {/* Clean Empty State */}
      {filteredResults.boards.length === 0 && filteredResults.memories.length === 0 && (
        <div className="py-16 text-center glass-card border border-white/10 rounded-3xl p-6">
          <Compass size={32} className="mx-auto mb-3 text-[#c8a2ff]/50" />
          <h3 className="text-sm font-semibold text-white mb-1">NOTHING HERE YET</h3>
          <p className="text-xs text-white/50 mb-4">Try another memory, place or feeling.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['☕ cafés', '🌙 late nights', '📚 books', '✈️ Japan'].map(item => (
              <button
                key={item}
                onClick={() => setQuery(item.replace(/[^a-zA-Z]/g, '').toLowerCase())}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 hover:border-[#c8a2ff]/40 transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

/* INBOX / NOTIFICATIONS PAGE */
function InboxPage() {
  const notifications = [
    { id: 1, text: 'Someone saved your public collection "Japan — someday"', time: '2h ago', icon: <Heart size={16} /> },
    { id: 2, text: 'A new voyager found your visual memory archive', time: 'Yesterday', icon: <CircleUserRound size={16} /> },
    { id: 3, text: 'Your story "Rainy Evening" is ready to be revisited', time: '3d ago', icon: <BookOpen size={16} /> },
  ]

  return (
    <section className="screen">
      <span className="eyebrow">NOTIFICATIONS</span>
      <h1 className="title-large">Inbox</h1>
      <p className="lede">Quiet updates from your visual archive.</p>

      <div className="space-y-3 mb-8">
        {notifications.map(n => (
          <div key={n.id} className="glass-card p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#c8a2ff]/10 text-[#c8a2ff]">
              {n.icon}
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/90 font-medium">{n.text}</p>
              <span className="text-[10px] text-white/40">{n.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="py-12 text-center text-white/30 border border-dashed border-white/10 rounded-2xl">
        <Send size={24} className="mx-auto mb-2 text-[#c8a2ff]/40" />
        <p className="text-xs text-white/60">Messages will live here.</p>
        <small className="text-[10px]">Keep your little universe quiet for now.</small>
      </div>
    </section>
  )
}

/* PROFILE & CURRENT ERA PAGE */
function ProfilePage({
  profile,
  boards,
  memories,
  notes,
  onBoard,
  onMemory,
  onEditProfile,
}: {
  profile: Profile
  boards: Board[]
  memories: Memory[]
  notes: Note[]
  onBoard: (b: Board) => void
  onMemory: (m: Memory) => void
  onEditProfile: () => void
}) {
  return (
    <section className="screen">
      {/* Cover & Avatar Header */}
      <div className="relative h-44 rounded-2xl overflow-hidden mb-12 border border-white/10">
        <img src={profile.cover} alt="Profile Cover" className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <button
          onClick={onEditProfile}
          className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md"
        >
          <Pencil size={12} /> Edit Profile
        </button>
        <div className="absolute -bottom-8 left-6 flex items-end gap-4">
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-2xl object-cover border-4 border-black shadow-2xl"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          @{profile.username}
          <span className="text-xs font-normal text-[#c8a2ff] border border-[#c8a2ff]/30 px-2 py-0.5 rounded-full bg-[#c8a2ff]/10">
            {profile.displayName || 'Creator'}
          </span>
        </h1>
        <p className="text-xs text-white/70 mt-1">{profile.bio}</p>
        <small className="text-[11px] text-white/40 flex items-center gap-1 mt-2">
          <MapPin size={12} /> {profile.location}
        </small>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-center mb-6">
        <div>
          <strong className="text-lg text-white block">{memories.length}</strong>
          <span className="text-[10px] text-white/50 uppercase tracking-wider">Memories</span>
        </div>
        <div>
          <strong className="text-lg text-white block">{boards.length}</strong>
          <span className="text-[10px] text-white/50 uppercase tracking-wider">Collections</span>
        </div>
        <div>
          <strong className="text-lg text-white block">{notes.length}</strong>
          <span className="text-[10px] text-white/50 uppercase tracking-wider">Notes</span>
        </div>
      </div>

      {/* CURRENT ERA Section */}
      <div className="era-card glass-card">
        <span className="eyebrow flex items-center gap-1.5">
          <Sparkles size={11} /> CURRENT ERA
        </span>
        <div className="era-tags">
          {profile.currentEra.map((item, idx) => (
            <span key={idx} className="era-tag">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Pinned Collections */}
      <div className="section-header">
        <h2>PINNED COLLECTIONS</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {boards.slice(0, 2).map(board => (
          <BoardCard key={board.id} board={board} onClick={() => onBoard(board)} />
        ))}
      </div>

      {/* My Universe Archive Grid */}
      <div className="section-header">
        <h2>MY UNIVERSE</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {memories.map(m => (
          <MemoryCard key={m.id} memory={m} onClick={() => onMemory(m)} />
        ))}
      </div>
    </section>
  )
}

/* BOARD / CURATED EDITORIAL COLLECTION PAGE */
function BoardPage({
  board,
  memories,
  onBack,
  onMemory,
  onCreate,
}: {
  board: Board
  memories: Memory[]
  onBack: () => void
  onMemory: (m: Memory) => void
  onCreate: () => void
}) {
  const [boardSheet, setBoardSheet] = useState<string | null>(null)

  const childBoards = board.children || []
  const heroMemory = memories[0]
  const remainingMemories = memories.slice(1)

  return (
    <section className="screen">
      {/* Header Back Bar */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to universe
        </button>
        <button
          onClick={() => setBoardSheet('add')}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#c8a2ff] text-black hover:bg-[#d8c2ff] transition-all flex items-center gap-1 shadow-lg shadow-[#c8a2ff]/15"
        >
          <Plus size={13} /> Add Block
        </button>
      </div>

      {/* Cinematic Post-Style Board Header */}
      <div className="relative h-72 rounded-3xl overflow-hidden mb-6 border border-white/10 glass-card">
        <img src={board.image} alt={board.name} className="w-full h-full object-cover opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute top-4 right-4">
          <span className={`badge-privacy ${board.privacy === 'public' ? 'is-public' : ''}`}>
            {board.privacy === 'private' ? <LockKeyhole size={10} /> : <Globe2 size={10} />}
            {board.privacy.toUpperCase()}
          </span>
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <span className="eyebrow flex items-center gap-1.5 mb-1">
            <Sparkles size={11} /> CURATED COLLECTION
          </span>
          <h1 className="text-3xl font-semibold text-white tracking-tight">{board.name}</h1>
          {board.description && (
            <p className="text-sm text-white/80 mt-1.5 max-w-xl font-normal leading-relaxed">
              "{board.description}"
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-white/50">
            <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white/80 backdrop-blur-md">
              {memories.length} pins
            </span>
            {childBoards.length > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white/80 backdrop-blur-md">
                {childBoards.length} sub-boards
              </span>
            )}
            {board.location && (
              <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white/80 backdrop-blur-md flex items-center gap-1">
                <MapPin size={10} className="text-[#c8a2ff]" /> {board.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Boards Visual Section */}
      {childBoards.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="eyebrow flex items-center gap-1">
              <Layers size={11} /> SUB-BOARDS ({childBoards.length})
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {childBoards.map((subTitle, idx) => (
              <div
                key={subTitle}
                className="glass-card p-4 flex flex-col justify-between group hover:border-[#c8a2ff]/40 transition-all cursor-pointer min-h-[110px]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#c8a2ff] uppercase tracking-wider font-semibold">Sub-Board #{idx + 1}</span>
                  <ChevronRight size={14} className="text-white/40 group-hover:text-[#c8a2ff] transition-colors" />
                </div>
                <div>
                  <strong className="text-sm text-white font-semibold block group-hover:text-[#c8a2ff] transition-colors">
                    {subTitle}
                  </strong>
                  <small className="text-[11px] text-white/40 block mt-0.5">Explore sub-collection →</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controlled Asymmetric Visual Layout (Scrapbook / Moodboard) */}
      <div className="section-header">
        <h2>CURATED MOODBOARD ({memories.length} BLOCKS)</h2>
      </div>

      {memories.length > 0 ? (
        <div className="space-y-4 mb-8">
          {/* HERO OPENER BLOCK (First Memory) */}
          {heroMemory && (
            <div
              onClick={() => onMemory(heroMemory)}
              className="glass-card relative h-80 rounded-3xl overflow-hidden group cursor-pointer border border-white/12 shadow-2xl"
            >
              {heroMemory.image ? (
                <GlassImage src={heroMemory.image} alt={heroMemory.title} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-white/10 to-black/90 flex items-center justify-center text-white/30" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="text-[10px] bg-[#c8a2ff]/20 text-[#c8a2ff] border border-[#c8a2ff]/30 px-3 py-1 rounded-full font-semibold uppercase tracking-wider backdrop-blur-md">
                  ✦ FEATURED OPENER
                </span>
                <span className={`badge-privacy ${heroMemory.privacy === 'public' ? 'is-public' : ''}`}>
                  {heroMemory.privacy === 'private' ? <LockKeyhole size={9} /> : <Globe2 size={9} />}
                  {heroMemory.privacy}
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                {heroMemory.mood && (
                  <span className="text-xs text-[#c8a2ff] font-medium block mb-1">
                    {heroMemory.mood}
                  </span>
                )}
                <h3 className="text-xl font-bold text-white group-hover:text-[#c8a2ff] transition-colors">
                  {heroMemory.title}
                </h3>
                <p className="text-xs text-white/70 mt-1 line-clamp-2">{heroMemory.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-white/50 mt-2">
                  {heroMemory.location && <span className="flex items-center gap-1"><MapPin size={10} className="text-[#c8a2ff]" /> {heroMemory.location}</span>}
                  <span>{heroMemory.date}</span>
                </div>
              </div>
            </div>
          )}

          {/* EDITORIAL QUOTE NOTE BLOCK */}
          <div className="glass-card p-6 border-l-4 border-l-[#c8a2ff] relative">
            <span className="eyebrow block mb-2">EDITORIAL NOTE</span>
            <p className="text-base text-white/90 italic font-serif leading-relaxed">
              "Some places are worth remembering for reasons you can't explain. We collect pieces of moments to hold onto what time moves past."
            </p>
            <span className="text-[11px] text-white/40 block mt-3">— Archive Thought · {board.name}</span>
          </div>

          {/* PLACE & LANDMARK BLOCK */}
          {board.location && (
            <div className="glass-card p-5 flex items-center justify-between group hover:border-[#c8a2ff]/40 transition-all">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-[#c8a2ff]/10 text-[#c8a2ff] border border-[#c8a2ff]/20">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-[#c8a2ff] uppercase tracking-wider font-semibold block">FEATURED PLACE</span>
                  <h4 className="text-sm font-semibold text-white group-hover:text-[#c8a2ff] transition-colors">{board.location}</h4>
                  <p className="text-xs text-white/60 mt-0.5">Primary landmark for this collection</p>
                </div>
              </div>
              <span className="text-xs text-white/40 group-hover:text-white transition-colors">Explore →</span>
            </div>
          )}

          {/* REMAINING MEMORIES MASONRY GRID */}
          {remainingMemories.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {remainingMemories.map(m => (
                <MemoryCard key={m.id} memory={m} onClick={() => onMemory(m)} />
              ))}
            </div>
          )}

          {/* STORY / ESSAY SECTION BLOCK */}
          <div className="glass-card p-6 border border-white/10 space-y-2">
            <span className="eyebrow flex items-center gap-1">
              <FileText size={11} /> ARCHIVE STORY
            </span>
            <h4 className="text-base font-semibold text-white">Quiet Moments in {board.name}</h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Every detail stored here carries a quiet memory. From rainy evenings to dim café corners, this curated moodboard serves as a permanent digital capsule.
            </p>
          </div>
        </div>
      ) : (
        <div className="py-14 text-center border border-dashed border-white/12 rounded-3xl glass-card">
          <Archive size={32} className="mx-auto mb-3 text-[#c8a2ff]/40" />
          <p className="text-sm font-semibold text-white mb-1">No blocks in this board yet</p>
          <p className="text-xs text-white/50 mb-4 max-w-xs mx-auto">Start assembling your moodboard with pins, photos, notes, and places.</p>
          <button
            onClick={onCreate}
            className="px-5 py-2.5 rounded-full bg-[#c8a2ff] text-black text-xs font-semibold shadow-lg shadow-[#c8a2ff]/20 hover:bg-[#d8c2ff] transition-all"
          >
            + Add First Block
          </button>
        </div>
      )}

      {/* In-Board Glass Creation Sheet */}
      {boardSheet && (
        <div className="sheet-backdrop" onClick={() => setBoardSheet(null)}>
          <div className="creation-sheet glass-card" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="flex justify-between items-center mb-4">
              <span className="eyebrow">ADD BLOCK TO {board.name.toUpperCase()}</span>
              <button onClick={() => setBoardSheet(null)} className="text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setBoardSheet(null); onCreate() }}
                className="glass-card p-4 text-left hover:border-[#c8a2ff]/40 transition-all"
              >
                <div className="p-2 rounded-xl bg-[#c8a2ff]/10 text-[#c8a2ff] w-fit mb-2">
                  <ImagePlus size={18} />
                </div>
                <strong className="text-xs text-white block">Pin / Photo</strong>
                <small className="text-[10px] text-white/50">Visual photo moment</small>
              </button>

              <button
                onClick={() => { setBoardSheet(null); onCreate() }}
                className="glass-card p-4 text-left hover:border-[#c8a2ff]/40 transition-all"
              >
                <div className="p-2 rounded-xl bg-[#c8a2ff]/10 text-[#c8a2ff] w-fit mb-2">
                  <Layers size={18} />
                </div>
                <strong className="text-xs text-white block">Sub-Board</strong>
                <small className="text-[10px] text-white/50">Nested sub-collection</small>
              </button>

              <button
                onClick={() => { setBoardSheet(null); onCreate() }}
                className="glass-card p-4 text-left hover:border-[#c8a2ff]/40 transition-all"
              >
                <div className="p-2 rounded-xl bg-[#c8a2ff]/10 text-[#c8a2ff] w-fit mb-2">
                  <FileText size={18} />
                </div>
                <strong className="text-xs text-white block">Note</strong>
                <small className="text-[10px] text-white/50">Editorial text fragment</small>
              </button>

              <button
                onClick={() => { setBoardSheet(null); onCreate() }}
                className="glass-card p-4 text-left hover:border-[#c8a2ff]/40 transition-all"
              >
                <div className="p-2 rounded-xl bg-[#c8a2ff]/10 text-[#c8a2ff] w-fit mb-2">
                  <MapPin size={18} />
                </div>
                <strong className="text-xs text-white block">Place</strong>
                <small className="text-[10px] text-white/50">Location landmark</small>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/* FULL-SCREEN MEMORY VIEWER PAGE / MODAL */
function MemoryPage({
  memory,
  board,
  onBack,
  onDelete,
  onTogglePrivacy,
  onNext,
  onPrev,
}: {
  memory: Memory
  board?: Board
  onBack: () => void
  onDelete: () => void
  onTogglePrivacy: () => void
  onNext: () => void
  onPrev: () => void
}) {
  // Arrow key navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'Escape') onBack()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onNext, onPrev, onBack])

  return (
    <section className="screen min-h-svh flex flex-col">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-white/60 hover:text-white">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 hover:text-white"
          >
            ← Prev
          </button>
          <button
            onClick={onNext}
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 hover:text-white"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Hero Image */}
      {memory.image && (
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-6 border border-white/10 bg-black">
          <img src={memory.image} alt={memory.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Memory Content */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onTogglePrivacy}
            className={`badge-privacy ${memory.privacy === 'public' ? 'is-public' : ''}`}
          >
            {memory.privacy === 'private' ? <LockKeyhole size={11} /> : <Globe2 size={11} />}
            {memory.privacy.toUpperCase()}
          </button>
          {memory.mood && (
            <span className="text-xs bg-[#c8a2ff]/10 text-[#c8a2ff] border border-[#c8a2ff]/30 px-3 py-1 rounded-full">
              {memory.mood}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-semibold text-white">{memory.title}</h1>
        <p className="text-sm text-white/80 leading-relaxed">{memory.description}</p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-white/50 border-t border-b border-white/10 py-3">
          {memory.location && (
            <span className="flex items-center gap-1">
              <MapPin size={13} /> {memory.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={13} /> {memory.date}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {memory.tags.map(t => (
            <span key={t} className="text-xs bg-white/5 border border-white/10 text-white/70 px-2.5 py-1 rounded-full">
              #{t}
            </span>
          ))}
        </div>

        {/* Associated Board */}
        {board && (
          <div className="glass-card p-3 flex items-center justify-between">
            <span className="text-xs text-white/50">COLLECTION</span>
            <strong className="text-xs text-white">{board.name}</strong>
          </div>
        )}

        {/* Delete Option */}
        <button
          onClick={onDelete}
          className="flex items-center gap-2 text-xs text-rose-400/70 hover:text-rose-400 pt-4"
        >
          <Trash2 size={14} /> Delete memory from archive
        </button>
      </div>
    </section>
  )
}

/* CREATION BOTTOM SHEET */
function CreationSheet({
  type,
  boards,
  profile,
  onClose,
  onBoard,
  onMemory,
  onNote,
  onProfile,
}: {
  type: string
  boards: Board[]
  profile: Profile
  onClose: () => void
  onBoard: (b: any) => void
  onMemory: (m: any) => void
  onNote: (n: string) => void
  onProfile: (p: Profile) => void
}) {
  const [mode, setMode] = useState<string>(type === 'menu' ? '' : type)

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="creation-sheet glass-card" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />

        <div className="flex justify-between items-center mb-4">
          <span className="eyebrow">
            {mode ? (mode === 'profile' ? 'EDIT PROFILE' : mode === 'memory' ? 'ADD MOMENT' : mode === 'note' ? 'WRITE NOTE' : 'CREATE COLLECTION') : 'MAKE ROOM FOR IT'}
          </span>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {!mode ? (
          <div className="space-y-3">
            <button
              onClick={() => setMode('memory')}
              className="w-full glass-card p-4 flex items-center gap-3 text-left hover:border-[#c8a2ff]/40 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-[#c8a2ff]/10 text-[#c8a2ff]">
                <ImagePlus size={20} />
              </div>
              <div className="flex-1">
                <strong className="text-sm text-white block">Add Moment</strong>
                <small className="text-xs text-white/50">Save a visual photo or memory</small>
              </div>
              <ChevronRight size={16} className="text-white/40" />
            </button>

            <button
              onClick={() => setMode('board')}
              className="w-full glass-card p-4 flex items-center gap-3 text-left hover:border-[#c8a2ff]/40 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-[#c8a2ff]/10 text-[#c8a2ff]">
                <LayoutGrid size={20} />
              </div>
              <div className="flex-1">
                <strong className="text-sm text-white block">Create Collection</strong>
                <small className="text-xs text-white/50">Start a new visual board</small>
              </div>
              <ChevronRight size={16} className="text-white/40" />
            </button>

            <button
              onClick={() => setMode('note')}
              className="w-full glass-card p-4 flex items-center gap-3 text-left hover:border-[#c8a2ff]/40 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-[#c8a2ff]/10 text-[#c8a2ff]">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <strong className="text-sm text-white block">Write Note</strong>
                <small className="text-xs text-white/50">Tuck away a personal thought</small>
              </div>
              <ChevronRight size={16} className="text-white/40" />
            </button>
          </div>
        ) : mode === 'memory' ? (
          <MemoryForm boards={boards} onSave={onMemory} />
        ) : mode === 'board' ? (
          <BoardForm onSave={onBoard} />
        ) : mode === 'note' ? (
          <NoteForm onSave={onNote} />
        ) : (
          <ProfileForm profile={profile} onSave={onProfile} />
        )}
      </div>
    </div>
  )
}

/* Image Upload Input helper */
function ImageUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (!file) return
          const reader = new FileReader()
          reader.onload = () => onChange(String(reader.result))
          reader.readAsDataURL(file)
        }}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="w-full h-32 rounded-2xl border border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center gap-2 text-white/60 hover:border-[#c8a2ff]/40 transition-all overflow-hidden"
      >
        {value ? (
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <>
            <Camera size={22} className="text-[#c8a2ff]" />
            <span className="text-xs">Choose photo from camera roll</span>
          </>
        )}
      </button>
    </div>
  )
}

/* Memory Creation Form */
function MemoryForm({ boards, onSave }: { boards: Board[]; onSave: (m: any) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [boardId, setBoardId] = useState(boards[0]?.id || '')
  const [location, setLocation] = useState('')
  const [mood, setMood] = useState('☁ nostalgic')
  const [tags, setTags] = useState('memory, quiet')
  const [privacy, setPrivacy] = useState<PrivacyStatus>('private')

  const moods = ['☁ nostalgic', '☕ cozy', '✨ serene', '📚 peaceful', '🌙 quiet', '🍃 fresh']

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (title.trim() && boardId) {
          onSave({
            title,
            description,
            image: image || images.rain,
            boardId,
            date: 'August 2026',
            location,
            mood,
            privacy,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          })
        }
      }}
      className="space-y-4"
    >
      <div className="form-group">
        <label>Photo</label>
        <ImageUpload value={image} onChange={setImage} />
      </div>

      <div className="form-group">
        <label>Title</label>
        <input
          required
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Name this moment"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What do you want to remember?"
          className="form-textarea"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="form-group">
          <label>Collection</label>
          <select value={boardId} onChange={e => setBoardId(e.target.value)} className="form-select">
            {boards.map(b => (
              <option key={b.id} value={b.id} className="bg-black text-white">
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Jamshedpur"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Mood</label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {moods.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              className={`px-3 py-1 rounded-full text-xs transition-all border ${
                mood === m
                  ? 'bg-[#c8a2ff]/15 border-[#c8a2ff] text-[#c8a2ff]'
                  : 'bg-white/5 border-white/10 text-white/60'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Selector */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
        <span className="text-xs text-white/70">Visibility</span>
        <div className="flex gap-2">
          {(['private', 'public'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPrivacy(p)}
              className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 border transition-all ${
                privacy === p
                  ? 'bg-[#c8a2ff]/20 border-[#c8a2ff] text-[#c8a2ff]'
                  : 'bg-transparent border-white/10 text-white/50'
              }`}
            >
              {p === 'private' ? <LockKeyhole size={10} /> : <Globe2 size={10} />}
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary mt-2">
        Save Moment
      </button>
    </form>
  )
}

/* Collection Creation Form */
function BoardForm({ onSave }: { onSave: (b: any) => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [location, setLocation] = useState('')
  const [privacy, setPrivacy] = useState<PrivacyStatus>('private')

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (name.trim()) {
          onSave({
            name,
            description,
            image: image || images.cafe,
            location,
            privacy,
          })
        }
      }}
      className="space-y-4"
    >
      <div className="form-group">
        <label>Collection Name</label>
        <input
          required
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Places worth returning to"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What belongs here?"
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label>Cover Photo</label>
        <ImageUpload value={image} onChange={setImage} />
      </div>

      <button type="submit" className="btn-primary mt-2">
        Create Collection
      </button>
    </form>
  )
}

/* Note Creation Form */
function NoteForm({ onSave }: { onSave: (text: string) => void }) {
  const [text, setText] = useState('')
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (text.trim()) onSave(text)
      }}
      className="space-y-4"
    >
      <div className="form-group">
        <label>Personal Thought</label>
        <textarea
          required
          autoFocus
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Currently thinking about..."
          className="form-textarea min-h-[120px]"
        />
      </div>
      <button type="submit" className="btn-primary">
        Save Note
      </button>
    </form>
  )
}

/* Profile Form */
function ProfileForm({ profile, onSave }: { profile: Profile; onSave: (p: Profile) => void }) {
  const [p, setP] = useState(profile)
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSave(p)
      }}
      className="space-y-4"
    >
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={p.username}
          onChange={e => setP({ ...p, username: e.target.value.replace('@', '') })}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Display Name</label>
        <input
          type="text"
          value={p.displayName}
          onChange={e => setP({ ...p, displayName: e.target.value })}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Bio</label>
        <textarea
          value={p.bio}
          onChange={e => setP({ ...p, bio: e.target.value })}
          className="form-textarea"
        />
      </div>
      <button type="submit" className="btn-primary">
        Update Profile
      </button>
    </form>
  )
}
