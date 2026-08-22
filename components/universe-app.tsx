'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import {
  Archive, ArrowLeft, Bell, BookOpen, Camera, ChevronRight, CircleUserRound,
  FileText, Globe2, ImagePlus, LockKeyhole, MapPin, MoreHorizontal,
  Pencil, Plus, Search, Send, Settings, Sparkles, Trash2, X, Heart, LayoutGrid,
  Shuffle, ArrowRight, Compass, Eye, Shield, Tag, Calendar, Layers,
  Pin, Share2, Quote, ExternalLink, SlidersHorizontal, ArrowUp, ArrowDown,
  Bookmark, FolderPlus
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
  count?: number
  location?: string
  privacy: PrivacyStatus
  parentBoardId?: string
  children?: string[]
  createdAt?: string
  updatedAt?: string
}

export type BoardBlockType = 'pin' | 'memory' | 'subboard' | 'note' | 'photo' | 'place' | 'story'
export type BoardBlockSize = 'small' | 'medium' | 'large' | 'full' | 'wide' | 'tall'

export type BoardBlock = {
  id: string
  boardId: string
  type: BoardBlockType
  order: number
  size?: BoardBlockSize
  title?: string
  description?: string
  content?: string
  image?: string
  location?: string
  date?: string
  mood?: string
  tags?: string[]
  subBoardId?: string
  subBoardName?: string
  subBoardCount?: number
  subBoardImage?: string
  privacy?: PrivacyStatus
  sourceUrl?: string
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
  createdAt?: string
  updatedAt?: string
}

export type Note = {
  id: string
  text: string
  date: string
  privacy: PrivacyStatus
  boardId?: string
  createdAt?: string
  updatedAt?: string
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

export type SavedItem = {
  id: string
  userId: string
  itemType: 'board' | 'moment'
  itemId: string
  savedAt: string
}

const starterBoards: Board[] = [
  {
    id: 'cafes',
    name: 'Cafés in Jamshedpur',
    description: 'little tables, long conversations, and warm cups',
    image: images.cafe,
    location: 'Jamshedpur',
    privacy: 'private',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'japan',
    name: 'Japan — someday',
    description: 'Tokyo, Kyoto, quiet streets, train rides, food, little shops and everywhere I want to wander.',
    image: images.japan,
    location: 'Japan',
    privacy: 'public',
    createdAt: '2026-08-02T10:00:00.000Z',
    updatedAt: '2026-08-02T10:00:00.000Z',
  },
  {
    id: 'tokyo-nights',
    parentBoardId: 'japan',
    name: 'Tokyo Nights',
    description: 'Neon, narrow alleys & 2am ramen counters',
    image: images.tokyo,
    location: 'Tokyo, Japan',
    privacy: 'public',
    createdAt: '2026-08-03T10:00:00.000Z',
    updatedAt: '2026-08-03T10:00:00.000Z',
  },
  {
    id: 'kyoto-dreams',
    parentBoardId: 'japan',
    name: 'Kyoto Dreams',
    description: 'Quiet temples, rain on eaves & green tea stalls',
    image: images.rain,
    location: 'Kyoto, Japan',
    privacy: 'public',
    createdAt: '2026-08-04T10:00:00.000Z',
    updatedAt: '2026-08-04T10:00:00.000Z',
  },
  {
    id: 'books',
    name: 'Books I have read',
    description: 'pages that stayed long after finishing',
    image: images.books,
    privacy: 'private',
    createdAt: '2026-08-05T10:00:00.000Z',
    updatedAt: '2026-08-05T10:00:00.000Z',
  },
  {
    id: 'anime',
    name: 'Anime universe',
    description: 'favorites and recommendations',
    image: images.hills,
    privacy: 'private',
    createdAt: '2026-08-06T10:00:00.000Z',
    updatedAt: '2026-08-06T10:00:00.000Z',
  },
]

const starterBoardBlocks: BoardBlock[] = [
  {
    id: 'jp-b1',
    boardId: 'japan',
    type: 'photo',
    size: 'full',
    order: 1,
    title: 'Tokyo Alley Lights',
    description: 'Neon signs reflecting on wet pavement late at night in Shinjuku.',
    image: images.tokyo,
    location: 'Shinjuku, Tokyo',
    date: 'July 2026',
  },
  {
    id: 'jp-b2',
    boardId: 'japan',
    type: 'note',
    size: 'medium',
    order: 2,
    content: "I think I'm collecting future memories.",
    date: 'Aug 2026',
  },
  {
    id: 'jp-b3',
    boardId: 'japan',
    type: 'subboard',
    size: 'medium',
    order: 3,
    subBoardName: 'Tokyo Nights',
    description: 'Neon, narrow alleys & 2am ramen counters',
    subBoardCount: 12,
    image: images.tokyo,
  },
  {
    id: 'jp-b4',
    boardId: 'japan',
    type: 'pin',
    size: 'tall',
    order: 4,
    title: 'Shibuya Crossing at Midnight',
    description: 'The pulse of Tokyo under soft rain and neon reflections.',
    image: images.tokyo,
    location: 'Shibuya, Tokyo',
    date: 'July 2026',
    tags: ['tokyo', 'night'],
  },
  {
    id: 'jp-b5',
    boardId: 'japan',
    type: 'memory',
    size: 'medium',
    order: 5,
    title: 'Kyoto Evening',
    description: 'One of those evenings worth keeping. Rain tapping softly on dark wooden eaves.',
    image: images.rain,
    location: 'Gion, Kyoto',
    date: 'August 2026',
    mood: '☁ nostalgic',
    tags: ['kyoto', 'rain'],
  },
  {
    id: 'cf-b1',
    boardId: 'cafes',
    type: 'memory',
    size: 'large',
    order: 1,
    title: 'Rainy evening',
    description: 'One of those evenings that felt quietly perfect. Rain tapping softly against the window.',
    image: images.rain,
    location: 'Jamshedpur',
    date: 'August 2026',
    mood: '☁ nostalgic',
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
    createdAt: '2026-08-01T12:00:00.000Z',
    updatedAt: '2026-08-01T12:00:00.000Z',
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
    createdAt: '2026-08-02T09:00:00.000Z',
    updatedAt: '2026-08-02T09:00:00.000Z',
  },
  {
    id: 'tokyo',
    title: 'Tokyo alley lights',
    description: 'Neon signs reflecting on wet pavement late at night in Shinjuku.',
    image: images.tokyo,
    boardId: 'tokyo-nights',
    date: 'July 2026',
    location: 'Tokyo',
    privacy: 'public',
    mood: '✨ serene',
    tags: ['japan', 'night', 'lights'],
    createdAt: '2026-07-20T22:00:00.000Z',
    updatedAt: '2026-07-20T22:00:00.000Z',
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
    createdAt: '2026-07-15T14:00:00.000Z',
    updatedAt: '2026-07-15T14:00:00.000Z',
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
    createdAt: '2026-08-10T21:00:00.000Z',
    updatedAt: '2026-08-10T21:00:00.000Z',
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
    createdAt: '2026-08-12T23:00:00.000Z',
    updatedAt: '2026-08-12T23:00:00.000Z',
  },
]

const starterNotes: Note[] = [
  {
    id: 'note-1',
    text: "Some places are worth remembering for reasons you can't explain.",
    date: 'August 6, 2026',
    privacy: 'private',
    createdAt: '2026-08-06T10:00:00.000Z',
    updatedAt: '2026-08-06T10:00:00.000Z',
  },
  {
    id: 'note-2',
    text: 'Maybe the best part of today was doing absolutely nothing.',
    date: 'August 12, 2026',
    privacy: 'private',
    createdAt: '2026-08-12T10:00:00.000Z',
    updatedAt: '2026-08-12T10:00:00.000Z',
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

const starterSavedItems: SavedItem[] = [
  {
    id: 'saved-1',
    userId: 'terribleracoon556',
    itemType: 'board',
    itemId: 'japan',
    savedAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'saved-2',
    userId: 'terribleracoon556',
    itemType: 'moment',
    itemId: 'tokyo',
    savedAt: '2026-08-16T14:00:00.000Z',
  },
]

const uid = () => Math.random().toString(36).slice(2, 9)

export default function UniverseApp() {
  const [page, setPage] = useState<'home' | 'search' | 'inbox' | 'profile' | 'board' | 'memory' | 'archive' | 'saved'>('home')
  const [boards, setBoards] = useState<Board[]>(starterBoards)
  const [boardBlocks, setBoardBlocks] = useState<BoardBlock[]>(starterBoardBlocks)
  const [memories, setMemories] = useState<Memory[]>(starterMemories)
  const [notes, setNotes] = useState<Note[]>(starterNotes)
  const [profile, setProfile] = useState<Profile>(starterProfile)
  const [savedItems, setSavedItems] = useState<SavedItem[]>(starterSavedItems)

  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [sheet, setSheet] = useState<string | null>(null)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [editingBoard, setEditingBoard] = useState<Board | null>(null)
  const [parentForNewChild, setParentForNewChild] = useState<Board | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'memory' | 'board' | 'note'
    id: string
    title: string
    message: string
  } | null>(null)
  const [toast, setToast] = useState('')
  const [shuffledMemory, setShuffledMemory] = useState<Memory | null>(null)

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('little-universe-v2') || localStorage.getItem('little-universe-v1')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.boards) setBoards(data.boards)
        if (data.boardBlocks) setBoardBlocks(data.boardBlocks)
        if (data.memories) setMemories(data.memories)
        if (data.notes) setNotes(data.notes)
        if (data.profile) setProfile({ ...starterProfile, ...data.profile })
        if (data.savedItems) setSavedItems(data.savedItems)
      }
    } catch {}
  }, [])

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(
      'little-universe-v2',
      JSON.stringify({ boards, boardBlocks, memories, notes, profile, savedItems })
    )
  }, [boards, boardBlocks, memories, notes, profile, savedItems])

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

  // Saved / Favorites toggle
  const isSaved = (type: 'board' | 'moment', id: string) => {
    return savedItems.some(s => s.itemType === type && s.itemId === id)
  }

  const toggleSave = (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (isSaved(type, id)) {
      setSavedItems(prev => prev.filter(s => !(s.itemType === type && s.itemId === id)))
      setToast('Removed from saved')
    } else {
      const newItem: SavedItem = {
        id: uid(),
        userId: profile.username,
        itemType: type,
        itemId: id,
        savedAt: new Date().toISOString(),
      }
      setSavedItems(prev => [newItem, ...prev])
      setToast('Saved to your favorites ✦')
    }
  }

  // Board CRUD operations
  const addBoard = (boardData: Omit<Board, 'id'>) => {
    const now = new Date().toISOString()
    const nextBoard: Board = {
      ...boardData,
      id: uid(),
      privacy: boardData.privacy || 'private',
      createdAt: now,
      updatedAt: now,
    }
    setBoards(v => [nextBoard, ...v])
    setSheet(null)
    setParentForNewChild(null)
    setToast(boardData.parentBoardId ? 'Child board created ✦' : 'Collection created in your universe')
  }

  const updateBoardDetails = (boardId: string, updates: Partial<Board>) => {
    const now = new Date().toISOString()
    setBoards(prev =>
      prev.map(b => (b.id === boardId ? { ...b, ...updates, updatedAt: now } : b))
    )
    if (selectedBoard && selectedBoard.id === boardId) {
      setSelectedBoard(prev => (prev ? { ...prev, ...updates, updatedAt: now } : null))
    }
    setEditingBoard(null)
    setSheet(null)
    setToast('Board updated ✦')
  }

  const requestDeleteBoard = (board: Board) => {
    const containedMemories = memories.filter(m => m.boardId === board.id).length
    const containedChildren = boards.filter(b => b.parentBoardId === board.id).length
    setConfirmDialog({
      type: 'board',
      id: board.id,
      title: `Delete collection "${board.name}"?`,
      message: `This collection contains ${containedMemories} moments and ${containedChildren} child boards. Deleting it will unassign these items so they remain safely in your Archive.`,
    })
  }

  const performDeleteBoard = (boardId: string) => {
    // Unassign child items to prevent content loss
    setMemories(prev => prev.map(m => (m.boardId === boardId ? { ...m, boardId: '' } : m)))
    setBoards(prev =>
      prev
        .filter(b => b.id !== boardId)
        .map(b => (b.parentBoardId === boardId ? { ...b, parentBoardId: undefined } : b))
    )
    setSavedItems(prev => prev.filter(s => !(s.itemType === 'board' && s.itemId === boardId)))
    if (selectedBoard?.id === boardId) {
      setSelectedBoard(null)
      setPage('home')
    }
    setConfirmDialog(null)
    setToast('Collection deleted. Contents kept safely in Archive.')
  }

  // Memory CRUD operations
  const addMemory = (memoryData: Omit<Memory, 'id'>) => {
    const now = new Date().toISOString()
    const nextMemory: Memory = {
      ...memoryData,
      id: uid(),
      privacy: memoryData.privacy || 'private',
      createdAt: now,
      updatedAt: now,
    }
    setMemories(v => [nextMemory, ...v])

    if (memoryData.boardId) {
      const newBlock: BoardBlock = {
        id: uid(),
        boardId: memoryData.boardId,
        type: 'memory',
        order: 99,
        title: memoryData.title,
        description: memoryData.description,
        image: memoryData.image,
        location: memoryData.location,
        date: memoryData.date,
        mood: memoryData.mood,
        tags: memoryData.tags,
        privacy: memoryData.privacy,
      }
      setBoardBlocks(prev => [...prev, newBlock])
    }

    setSheet(null)
    setToast('Moment saved safely 🔒')
  }

  const updateMemory = (memoryId: string, updates: Partial<Memory>) => {
    const now = new Date().toISOString()
    setMemories(prev =>
      prev.map(m => (m.id === memoryId ? { ...m, ...updates, updatedAt: now } : m))
    )
    if (selectedMemory && selectedMemory.id === memoryId) {
      setSelectedMemory(prev => (prev ? { ...prev, ...updates, updatedAt: now } : null))
    }
    setEditingMemory(null)
    setSheet(null)
    setToast('Moment updated ✦')
  }

  const requestDeleteMemory = (memory: Memory) => {
    setConfirmDialog({
      type: 'memory',
      id: memory.id,
      title: 'Delete this memory?',
      message: `This will permanently remove "${memory.title}" from your visual archive. This cannot be undone.`,
    })
  }

  const performDeleteMemory = (memoryId: string) => {
    setMemories(v => v.filter(m => m.id !== memoryId))
    setBoardBlocks(v => v.filter(b => b.type !== 'memory' || b.title !== selectedMemory?.title))
    setSavedItems(v => v.filter(s => !(s.itemType === 'moment' && s.itemId === memoryId)))
    if (selectedMemory?.id === memoryId) {
      setSelectedMemory(null)
      setPage('home')
    }
    setConfirmDialog(null)
    setToast('Memory deleted')
  }

  const addNote = (text: string, boardId?: string) => {
    const now = new Date().toISOString()
    const nextNote: Note = {
      id: uid(),
      text,
      date: 'August 2026',
      privacy: 'private',
      boardId,
      createdAt: now,
      updatedAt: now,
    }
    setNotes(v => [nextNote, ...v])
    setSheet(null)
    setToast('Thought tucked away')
  }

  const toggleMemoryPrivacy = (memoryId: string) => {
    const now = new Date().toISOString()
    setMemories(v =>
      v.map(m => {
        if (m.id === memoryId) {
          const nextPrivacy: PrivacyStatus = m.privacy === 'private' ? 'public' : 'private'
          setToast(`Memory is now ${nextPrivacy.toUpperCase()}`)
          return { ...m, privacy: nextPrivacy, updatedAt: now }
        }
        return m
      })
    )
    if (selectedMemory && selectedMemory.id === memoryId) {
      setSelectedMemory(v => (v ? { ...v, privacy: v.privacy === 'private' ? 'public' : 'private' } : null))
    }
  }

  const addBlockToBoard = (blockData: Omit<BoardBlock, 'id' | 'order'>) => {
    const currentBoardBlocks = boardBlocks.filter(b => b.boardId === blockData.boardId)
    const newBlock: BoardBlock = {
      ...blockData,
      id: uid(),
      order: currentBoardBlocks.length + 1,
    }
    setBoardBlocks(prev => [...prev, newBlock])
    setToast('Block added to personal page ✦')
  }

  const deleteBlockFromBoard = (blockId: string) => {
    setBoardBlocks(prev => prev.filter(b => b.id !== blockId))
    setToast('Block removed from board')
  }

  const reorderBlockInBoard = (blockId: string, direction: 'up' | 'down') => {
    if (!selectedBoard) return
    const boardBlocksForCurrent = boardBlocks
      .filter(b => b.boardId === selectedBoard.id)
      .sort((a, b) => a.order - b.order)

    const idx = boardBlocksForCurrent.findIndex(b => b.id === blockId)
    if (idx === -1) return

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= boardBlocksForCurrent.length) return

    const updated = [...boardBlocksForCurrent]
    const temp = updated[idx].order
    updated[idx].order = updated[targetIdx].order
    updated[targetIdx].order = temp

    setBoardBlocks(prev => {
      const otherBlocks = prev.filter(b => b.boardId !== selectedBoard.id)
      return [...otherBlocks, ...updated]
    })
  }

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
            onOpenArchive={() => setPage('archive')}
            onOpenSaved={() => setPage('saved')}
            isSaved={isSaved}
            onToggleSave={toggleSave}
          />
        )}

        {page === 'search' && (
          <SearchPage
            boards={boards}
            memories={memories}
            notes={notes}
            onBoard={openBoard}
            onMemory={openMemory}
            isSaved={isSaved}
            onToggleSave={toggleSave}
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
            onOpenArchive={() => setPage('archive')}
            onOpenSaved={() => setPage('saved')}
            isSaved={isSaved}
            onToggleSave={toggleSave}
          />
        )}

        {page === 'archive' && (
          <ArchivePage
            boards={boards}
            memories={memories}
            notes={notes}
            onBoard={openBoard}
            onMemory={openMemory}
            onBack={() => setPage('home')}
            isSaved={isSaved}
            onToggleSave={toggleSave}
            onEditMemory={m => {
              setEditingMemory(m)
              setSheet('edit-memory')
            }}
            onDeleteMemory={requestDeleteMemory}
            onToggleMemoryPrivacy={toggleMemoryPrivacy}
          />
        )}

        {page === 'saved' && (
          <SavedPage
            savedItems={savedItems}
            boards={boards}
            memories={memories}
            onBoard={openBoard}
            onMemory={openMemory}
            onBack={() => setPage('home')}
            isSaved={isSaved}
            onToggleSave={toggleSave}
          />
        )}

        {page === 'board' && selectedBoard && (
          <BoardPage
            board={selectedBoard}
            allBoards={boards}
            blocks={boardBlocks.filter(b => b.boardId === selectedBoard.id).sort((a, b) => a.order - b.order)}
            allMemories={memories.filter(m => m.boardId === selectedBoard.id)}
            allNotes={notes.filter(n => n.boardId === selectedBoard.id)}
            onBack={() => {
              if (selectedBoard.parentBoardId) {
                const parent = boards.find(b => b.id === selectedBoard.parentBoardId)
                if (parent) {
                  openBoard(parent)
                  return
                }
              }
              setPage('home')
            }}
            onMemory={openMemory}
            onBoard={openBoard}
            onAddBlock={addBlockToBoard}
            onEditBoard={() => {
              setEditingBoard(selectedBoard)
              setSheet('edit-board')
            }}
            onDeleteBoard={() => requestDeleteBoard(selectedBoard)}
            onAddChildBoard={() => {
              setParentForNewChild(selectedBoard)
              setSheet('create-child-board')
            }}
            onDeleteBlock={deleteBlockFromBoard}
            onReorderBlock={reorderBlockInBoard}
            onShareBoard={() => setToast('Board link copied to clipboard ✦')}
            isSaved={isSaved}
            onToggleSave={toggleSave}
          />
        )}

        {page === 'memory' && selectedMemory && (
          <MemoryPage
            memory={selectedMemory}
            board={boards.find(b => b.id === selectedMemory.boardId)}
            onBack={() => setPage('home')}
            onEdit={() => {
              setEditingMemory(selectedMemory)
              setSheet('edit-memory')
            }}
            onDelete={() => requestDeleteMemory(selectedMemory)}
            onTogglePrivacy={() => toggleMemoryPrivacy(selectedMemory.id)}
            onNext={() => navigateMemory('next')}
            onPrev={() => navigateMemory('prev')}
            isSaved={isSaved}
            onToggleSave={toggleSave}
          />
        )}

        {/* Floating 5-Item Bottom Navigation */}
        {page !== 'board' && page !== 'memory' && (
          <BottomNav
            activeTab={page === 'archive' || page === 'saved' ? 'home' : page}
            onTabSelect={setPage}
            onCreateSelect={() => setSheet('menu')}
          />
        )}
      </main>

      {/* Creation / Edit Bottom Sheet */}
      {sheet && (
        <CreationSheet
          type={sheet}
          boards={boards}
          profile={profile}
          editingMemory={editingMemory}
          editingBoard={editingBoard}
          parentBoard={parentForNewChild}
          onClose={() => {
            setSheet(null)
            setEditingMemory(null)
            setEditingBoard(null)
            setParentForNewChild(null)
          }}
          onBoard={addBoard}
          onUpdateBoard={updateBoardDetails}
          onMemory={addMemory}
          onUpdateMemory={updateMemory}
          onNote={addNote}
          onProfile={p => {
            setProfile(p)
            setSheet(null)
            setToast('Profile updated')
          }}
        />
      )}

      {/* Confirmation Dialog Modal */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={() => {
            if (confirmDialog.type === 'memory') performDeleteMemory(confirmDialog.id)
            if (confirmDialog.type === 'board') performDeleteBoard(confirmDialog.id)
          }}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast">
          <Sparkles size={14} className="text-[#c7a6ff]" /> {toast}
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

/* 5-Item Bottom Navigation System */
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
        <Plus size={20} />
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

/* HOME PAGE — PREMIUM EDITORIAL COMPOSITION */
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
  onOpenArchive,
  onOpenSaved,
  isSaved,
  onToggleSave,
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
  onOpenArchive: () => void
  onOpenSaved: () => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
}) {
  const featuredMemory = memories[0]
  const recentMoments = memories.slice(1)
  const rootBoards = boards.filter(b => !b.parentBoardId)
  const mainBoard = rootBoards[0] || boards[0]
  const otherBoards = rootBoards.slice(1)

  return (
    <section className="screen space-y-8">
      {/* Editorial Header */}
      <div className="flex justify-between items-start pt-2">
        <div>
          <span className="eyebrow flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c7a6ff]" /> MY UNIVERSE
          </span>
          <h1 className="title-large">
            Good evening,<br />
            <span className="font-normal text-white">@{profile.username}</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <button onClick={onOpenArchive} className="text-xs text-[#c7a6ff] hover:underline flex items-center gap-1">
              <Archive size={12} /> View Archive
            </button>
            <span className="text-[#66636c]">·</span>
            <button onClick={onOpenSaved} className="text-xs text-[#c7a6ff] hover:underline flex items-center gap-1">
              <Bookmark size={12} /> View Saved
            </button>
          </div>
        </div>
        <button onClick={onCreate} className="btn-secondary" title="Create new memory">
          <Plus size={16} /> <span className="hidden sm:inline">New Memory</span>
        </button>
      </div>

      {/* Main Responsive Grid Layout for Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-8">
          {/* FEATURED HERO MEMORY */}
          {featuredMemory && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="eyebrow flex items-center gap-1.5">
                  <Sparkles size={11} className="text-[#c7a6ff]" /> FEATURED MEMORY
                </span>
                <span className="text-[11px] text-[#8b8991]">Opening Scene</span>
              </div>
              <div
                onClick={() => onMemory(featuredMemory)}
                className="glass-card relative h-[380px] sm:h-[440px] rounded-3xl overflow-hidden group cursor-pointer border border-white/12 shadow-2xl transition-all"
              >
                {featuredMemory.image ? (
                  <GlassImage src={featuredMemory.image} alt={featuredMemory.title} />
                ) : (
                  <div className="w-full h-full bg-neutral-950 flex items-center justify-center text-white/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                  <span className="text-[10px] bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-white/90 font-medium">
                    {featuredMemory.mood || '✨ featured'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => onToggleSave('moment', featuredMemory.id, e)}
                      className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/80 hover:text-white transition-all"
                    >
                      <Bookmark size={12} className={isSaved('moment', featuredMemory.id) ? 'fill-[#c7a6ff] text-[#c7a6ff]' : ''} />
                    </button>
                    <span className={`badge-privacy ${featuredMemory.privacy === 'public' ? 'is-public' : ''}`}>
                      {featuredMemory.privacy === 'private' ? <LockKeyhole size={9} /> : <Globe2 size={9} />}
                      {featuredMemory.privacy}
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 space-y-1.5 z-10">
                  <h2 className="text-2xl sm:text-3xl font-normal text-white group-hover:text-[#c7a6ff] transition-colors leading-tight">
                    {featuredMemory.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#b1afb8] line-clamp-2 max-w-xl">{featuredMemory.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-[#8b8991] pt-2">
                    {featuredMemory.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={10} className="text-[#c7a6ff]" /> {featuredMemory.location}
                      </span>
                    )}
                    <span>· {featuredMemory.date}</span>
                  </div>
                </div>
                <span className="corner-line-tl" />
              </div>
            </div>
          )}

          {/* RECENT MOMENTS RAIL / GRID */}
          <div>
            <div className="section-header">
              <h2>RECENT MOMENTS</h2>
              <button onClick={onOpenArchive}>
                View all archive <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {recentMoments.slice(0, 6).map(memory => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  onClick={() => onMemory(memory)}
                  isSaved={isSaved('moment', memory.id)}
                  onToggleSave={e => onToggleSave('moment', memory.id, e)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Side Column (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-8">
          {/* EDITORIAL QUOTE NOTE */}
          <div className="glass-card p-6 border-l-2 border-l-[#c7a6ff] relative">
            <span className="eyebrow block mb-2 text-[10px]">ARCHIVE REFLECTION</span>
            <p className="editorial-note-text text-sm sm:text-base">
              "Some places are worth remembering for reasons you can't explain."
            </p>
            <span className="text-[11px] text-[#66636c] block mt-3">— Personal Note ✦</span>
            <span className="corner-line-tl" />
          </div>

          {/* TONIGHT'S DISCOVERY */}
          {shuffledMemory && (
            <div className="shuffle-card">
              <div className="shuffle-card-content">
                <span className="eyebrow flex items-center gap-1.5 text-[10px] mb-1">
                  <Shuffle size={10} /> TONIGHT'S DISCOVERY
                </span>
                <p className="text-sm font-medium text-white">{shuffledMemory.title}</p>
                <small className="text-[11px] text-[#b1afb8] block mt-0.5">
                  {shuffledMemory.location && `${shuffledMemory.location} · `}
                  {shuffledMemory.date}
                </small>
              </div>
              <button onClick={() => onMemory(shuffledMemory)} className="btn-secondary px-3 py-1.5 text-xs ml-3">
                View <ArrowRight size={12} />
              </button>
            </div>
          )}

          {/* YOUR COLLECTIONS */}
          <div>
            <div className="section-header">
              <h2>YOUR COLLECTIONS</h2>
              <button onClick={onOpenArchive}>
                See all <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-4">
              {mainBoard && (
                <BoardCard
                  board={mainBoard}
                  allBoards={boards}
                  allMemories={memories}
                  onClick={() => onBoard(mainBoard)}
                  isSaved={isSaved('board', mainBoard.id)}
                  onToggleSave={e => onToggleSave('board', mainBoard.id, e)}
                />
              )}
              {otherBoards.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {otherBoards.map(board => (
                    <BoardCard
                      key={board.id}
                      board={board}
                      allBoards={boards}
                      allMemories={memories}
                      onClick={() => onBoard(board)}
                      isSaved={isSaved('board', board.id)}
                      onToggleSave={e => onToggleSave('board', board.id, e)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ARCHIVE NOTES */}
          <div>
            <div className="section-header">
              <h2>NOTES FROM MY UNIVERSE</h2>
            </div>
            <div className="space-y-3">
              {notes.map(note => (
                <div key={note.id} className="note-card glass-card">
                  <span className="text-[#c7a6ff] text-xs font-semibold block mb-1">✦</span>
                  <p>"{note.text}"</p>
                  <span>{note.date}</span>
                </div>
              ))}
              <button
                onClick={onCreate}
                className="w-full py-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-[#b1afb8] text-xs font-medium flex items-center justify-center gap-2 hover:border-white/30 hover:text-white transition-all"
              >
                <Plus size={14} /> Write a note
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* REUSABLE VERTICAL MEMORY CARD (3:4 Ratio Photo-Dominant) */
function MemoryCard({
  memory,
  onClick,
  isSaved,
  onToggleSave,
}: {
  memory: Memory
  onClick: () => void
  isSaved?: boolean
  onToggleSave?: (e: React.MouseEvent) => void
}) {
  return (
    <button className="memory-card group" onClick={onClick}>
      {memory.image ? (
        <GlassImage src={memory.image} alt={memory.title} />
      ) : (
        <div className="w-full h-full bg-neutral-950 flex items-center justify-center text-white/30">
          <ImagePlus size={22} />
        </div>
      )}

      <div className="memory-overlay">
        <div className="flex items-center justify-between gap-1">
          {memory.mood ? (
            <span className="text-[10px] bg-black/65 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/12 text-white/90 font-medium">
              {memory.mood}
            </span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-1.5">
            {onToggleSave && (
              <span
                onClick={onToggleSave}
                className="p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/12 text-white/80 hover:text-white transition-all"
              >
                <Bookmark size={10} className={isSaved ? 'fill-[#c7a6ff] text-[#c7a6ff]' : ''} />
              </span>
            )}
            <span className="p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/12 text-white/70">
              {memory.privacy === 'private' ? <LockKeyhole size={10} /> : <Globe2 size={10} className="text-[#c7a6ff]" />}
            </span>
          </div>
        </div>

        <div className="space-y-1 pt-4">
          <strong className="block text-sm text-white font-normal group-hover:text-[#c7a6ff] transition-colors leading-tight line-clamp-1">
            {memory.title}
          </strong>
          <small className="text-[#b1afb8] text-[11px] flex items-center gap-1.5">
            {memory.location && (
              <span className="flex items-center gap-1">
                <MapPin size={10} className="text-[#c7a6ff]" /> {memory.location}
              </span>
            )}
            {memory.location && memory.date && <span>·</span>}
            <span>{memory.date}</span>
          </small>
        </div>
      </div>

      <span className="corner-line-tl" />
    </button>
  )
}

/* BOARD / COLLECTION CARD COMPONENT */
function BoardCard({
  board,
  allBoards,
  allMemories,
  onClick,
  isSaved,
  onToggleSave,
}: {
  board: Board
  allBoards?: Board[]
  allMemories?: Memory[]
  onClick: () => void
  isSaved?: boolean
  onToggleSave?: (e: React.MouseEvent) => void
}) {
  const dynamicMemoriesCount = allMemories ? allMemories.filter(m => m.boardId === board.id).length : (board.count || 0)
  const dynamicChildCount = allBoards ? allBoards.filter(b => b.parentBoardId === board.id).length : (board.children?.length || 0)

  return (
    <button className="board-card glass-card group" onClick={onClick}>
      <div className="board-cover relative overflow-hidden">
        <GlassImage src={board.image} alt={board.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {onToggleSave && (
            <span
              onClick={onToggleSave}
              className="p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/12 text-white/80 hover:text-white transition-all"
            >
              <Bookmark size={10} className={isSaved ? 'fill-[#c7a6ff] text-[#c7a6ff]' : ''} />
            </span>
          )}
          <span className={`badge-privacy ${board.privacy === 'public' ? 'is-public' : ''}`}>
            {board.privacy === 'private' ? <LockKeyhole size={9} /> : <Globe2 size={9} />}
            {board.privacy}
          </span>
        </div>
      </div>
      <div className="board-card-body">
        <div className="flex items-center justify-between text-[10px] text-[#8b8991] uppercase tracking-wider">
          <span>{dynamicMemoriesCount} memories</span>
          {dynamicChildCount > 0 && <span>{dynamicChildCount} child</span>}
        </div>
        <strong className="group-hover:text-[#c7a6ff] transition-colors">{board.name}</strong>
        {board.location && (
          <small className="text-[#66636c] text-xs flex items-center gap-1 mt-0.5">
            <MapPin size={10} className="text-[#c7a6ff]" /> {board.location}
          </small>
        )}
      </div>
      <span className="corner-line-tl" />
    </button>
  )
}

/* SEARCH & DISCOVERY PAGE — PREMIUM EDITORIAL SEARCH */
function SearchPage({
  boards,
  memories,
  notes,
  onBoard,
  onMemory,
  isSaved,
  onToggleSave,
}: {
  boards: Board[]
  memories: Memory[]
  notes: Note[]
  onBoard: (b: Board) => void
  onMemory: (m: Memory) => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
}) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('ALL')
  const [isFocused, setIsFocused] = useState(false)

  const filterOptions = ['ALL', 'BOARDS', 'MEMORIES', 'PLACES', 'NOTES', 'TAGS']
  const feelingTags = ['nostalgic', 'cozy', 'dreamy', 'rainy', 'peaceful', 'late night', 'wanderlust']

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim()

    const matchingBoards = boards.filter(
      b =>
        (activeFilter === 'ALL' || activeFilter === 'BOARDS') &&
        (!q ||
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.location?.toLowerCase().includes(q))
    )

    const matchingMemories = memories.filter(
      m =>
        (activeFilter === 'ALL' || activeFilter === 'MEMORIES' || activeFilter === 'PLACES' || activeFilter === 'TAGS') &&
        (!q ||
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.location?.toLowerCase().includes(q) ||
          m.tags.some(t => t.toLowerCase().includes(q)))
    )

    return { boards: matchingBoards, memories: matchingMemories }
  }, [query, activeFilter, boards, memories])

  const totalResultsCount = filteredResults.boards.length + filteredResults.memories.length

  return (
    <section className="screen space-y-6">
      {/* Editorial Search Hero Header */}
      <div className="pt-2">
        <span className="eyebrow flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c7a6ff]" /> YOUR UNIVERSE
        </span>
        <h1 className="title-large">
          Search your <span className="font-normal text-[#c7a6ff]">universe.</span>
        </h1>
        <p className="lede mt-2 mb-0">Look for places, feelings, memories and little things.</p>
      </div>

      {/* Floating Smoked Glass Search Bar */}
      <div className="relative z-20">
        <div
          className={`flex items-center gap-3.5 bg-black/70 border rounded-2xl px-5 py-4 transition-all backdrop-blur-2xl shadow-2xl ${
            isFocused ? 'border-white/30 ring-1 ring-white/20' : 'border-white/12'
          }`}
        >
          <Search size={18} className={`transition-colors ${isFocused ? 'text-[#c7a6ff]' : 'text-[#8b8991]'}`} />
          <input
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search memories, places, feelings..."
            className="bg-transparent border-none outline-none text-white w-full text-sm placeholder:text-[#66636c]"
          />
          {query ? (
            <button onClick={() => setQuery('')} className="text-[#8b8991] hover:text-white transition-colors">
              <X size={16} />
            </button>
          ) : (
            <span className="text-[10px] text-[#8b8991] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md font-mono flex-shrink-0">
              ⌘ K
            </span>
          )}
        </div>

        {/* Dropdown Suggestions */}
        {isFocused && !query && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-card p-5 rounded-2xl border border-white/15 backdrop-blur-2xl shadow-2xl z-30 animate-fadeIn space-y-4">
            <div>
              <span className="text-[10px] text-[#66636c] font-semibold uppercase tracking-wider block mb-2">RECENT SEARCHES</span>
              <div className="flex flex-wrap gap-2">
                {['Tokyo', 'Cafés', 'Japan', 'Books'].map(item => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#b1afb8] hover:border-white/30 hover:text-white transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Minimal Editorial Filters */}
      <div className="flex gap-6 overflow-x-auto pb-2 border-b border-white/10">
        {filterOptions.map(option => (
          <button
            key={option}
            onClick={() => setActiveFilter(option)}
            className={`pb-2 text-xs font-medium tracking-wider transition-all relative ${
              activeFilter === option ? 'text-white' : 'text-[#8b8991] hover:text-white'
            }`}
          >
            {option}
            {activeFilter === option && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c7a6ff]" />}
          </button>
        ))}
      </div>

      {/* "Search By Feeling" */}
      {!query && (
        <div>
          <span className="eyebrow block mb-3 text-[10px]">SEARCH BY FEELING</span>
          <div className="flex flex-wrap gap-2">
            {feelingTags.map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-[#b1afb8] hover:border-white/25 hover:text-white transition-all flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#c7a6ff]" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      {query && (
        <div className="flex items-center justify-between text-xs text-[#8b8991]">
          <span>RESULTS FOR "{query}"</span>
          <span>{totalResultsCount} items found</span>
        </div>
      )}

      {/* Board Results */}
      {filteredResults.boards.length > 0 && (
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Collections</h3>
            <span className="text-[10px] text-[#66636c]">{filteredResults.boards.length} results</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.boards.map(b => (
              <BoardCard
                key={b.id}
                board={b}
                allBoards={boards}
                allMemories={memories}
                onClick={() => onBoard(b)}
                isSaved={isSaved('board', b.id)}
                onToggleSave={e => onToggleSave('board', b.id, e)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Memory Results */}
      {filteredResults.memories.length > 0 && (
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Memories</h3>
            <span className="text-[10px] text-[#66636c]">{filteredResults.memories.length} results</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredResults.memories.map(m => (
              <MemoryCard
                key={m.id}
                memory={m}
                onClick={() => onMemory(m)}
                isSaved={isSaved('moment', m.id)}
                onToggleSave={e => onToggleSave('moment', m.id, e)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredResults.boards.length === 0 && filteredResults.memories.length === 0 && (
        <div className="py-20 text-center glass-card border border-white/10 rounded-3xl p-8">
          <Compass size={32} className="mx-auto mb-3 text-[#8b8991]" />
          <h3 className="text-sm font-medium text-white mb-1">NOTHING HERE YET</h3>
          <p className="text-xs text-[#b1afb8] mb-6">Try another memory, place or feeling.</p>
        </div>
      )}
    </section>
  )
}

/* INBOX PAGE */
function InboxPage() {
  const notifications = [
    { id: 1, text: 'Someone saved your public collection "Japan — someday"', time: '2h ago', icon: <Heart size={16} /> },
    { id: 2, text: 'A new voyager found your visual memory archive', time: 'Yesterday', icon: <CircleUserRound size={16} /> },
    { id: 3, text: 'Your story "Rainy Evening" is ready to be revisited', time: '3d ago', icon: <BookOpen size={16} /> },
  ]

  return (
    <section className="screen space-y-6">
      <div className="pt-2">
        <span className="eyebrow block mb-2 text-[10px]">NOTIFICATIONS</span>
        <h1 className="title-large">Inbox</h1>
        <p className="lede mt-2 mb-0">Quiet updates from your visual archive.</p>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className="glass-card p-4 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white">{n.icon}</div>
            <div className="flex-1">
              <p className="text-xs text-white font-normal">{n.text}</p>
              <span className="text-[10px] text-[#66636c]">{n.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="py-16 text-center text-[#66636c] border border-dashed border-white/10 rounded-3xl">
        <Send size={24} className="mx-auto mb-2 text-[#8b8991]" />
        <p className="text-xs text-[#b1afb8]">Messages will live here.</p>
        <small className="text-[10px]">Keep your little universe quiet for now.</small>
      </div>
    </section>
  )
}

/* PROFILE PAGE */
function ProfilePage({
  profile,
  boards,
  memories,
  notes,
  onBoard,
  onMemory,
  onEditProfile,
  onOpenArchive,
  onOpenSaved,
  isSaved,
  onToggleSave,
}: {
  profile: Profile
  boards: Board[]
  memories: Memory[]
  notes: Note[]
  onBoard: (b: Board) => void
  onMemory: (m: Memory) => void
  onEditProfile: () => void
  onOpenArchive: () => void
  onOpenSaved: () => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
}) {
  const rootBoards = boards.filter(b => !b.parentBoardId)

  return (
    <section className="screen space-y-8">
      {/* Cover & Avatar Header */}
      <div className="relative h-48 sm:h-56 rounded-3xl overflow-hidden border border-white/10 glass-card">
        <img src={profile.cover} alt="Profile Cover" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <button onClick={onEditProfile} className="absolute top-4 right-4 btn-secondary text-xs px-3.5 py-1.5 backdrop-blur-md">
          <Pencil size={12} /> Edit Profile
        </button>
        <div className="absolute -bottom-6 left-6 flex items-end gap-4">
          <img
            src={profile.avatar}
            alt="Avatar"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-black shadow-2xl"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="pt-4 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-normal text-white flex items-center gap-3">
          @{profile.username}
          <span className="text-xs font-normal text-white border border-white/20 px-2.5 py-0.5 rounded-full bg-white/5">
            {profile.displayName || 'Creator'}
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-[#b1afb8]">{profile.bio}</p>
        <div className="flex items-center gap-4 text-xs text-[#b1afb8] pt-1">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-[#c7a6ff]" /> {profile.location}
          </span>
          <button onClick={onOpenArchive} className="text-[#c7a6ff] hover:underline flex items-center gap-1">
            <Archive size={12} /> Archive
          </button>
          <button onClick={onOpenSaved} className="text-[#c7a6ff] hover:underline flex items-center gap-1">
            <Bookmark size={12} /> Saved
          </button>
        </div>
      </div>

      {/* Dynamic Stats Counter */}
      <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl glass-card text-center">
        <div>
          <strong className="text-xl text-white block font-normal">{memories.length}</strong>
          <span className="text-[10px] text-[#66636c] uppercase tracking-wider">Memories</span>
        </div>
        <div>
          <strong className="text-xl text-white block font-normal">{boards.length}</strong>
          <span className="text-[10px] text-[#66636c] uppercase tracking-wider">Collections</span>
        </div>
        <div>
          <strong className="text-xl text-white block font-normal">{notes.length}</strong>
          <span className="text-[10px] text-[#66636c] uppercase tracking-wider">Notes</span>
        </div>
      </div>

      {/* CURRENT ERA Section */}
      <div className="era-card glass-card">
        <span className="eyebrow flex items-center gap-2 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c7a6ff]" /> CURRENT ERA
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
      <div>
        <div className="section-header">
          <h2>PINNED COLLECTIONS</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rootBoards.slice(0, 2).map(board => (
            <BoardCard
              key={board.id}
              board={board}
              allBoards={boards}
              allMemories={memories}
              onClick={() => onBoard(board)}
              isSaved={isSaved('board', board.id)}
              onToggleSave={e => onToggleSave('board', board.id, e)}
            />
          ))}
        </div>
      </div>

      {/* My Universe Archive Grid */}
      <div>
        <div className="section-header">
          <h2>MY UNIVERSE</h2>
          <button onClick={onOpenArchive}>
            View full archive <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {memories.map(m => (
            <MemoryCard
              key={m.id}
              memory={m}
              onClick={() => onMemory(m)}
              isSaved={isSaved('moment', m.id)}
              onToggleSave={e => onToggleSave('moment', m.id, e)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ARCHIVE PAGE — COMPLETE CONTENT HISTORY */
function ArchivePage({
  boards,
  memories,
  notes,
  onBoard,
  onMemory,
  onBack,
  isSaved,
  onToggleSave,
  onEditMemory,
  onDeleteMemory,
  onToggleMemoryPrivacy,
}: {
  boards: Board[]
  memories: Memory[]
  notes: Note[]
  onBoard: (b: Board) => void
  onMemory: (m: Memory) => void
  onBack: () => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
  onEditMemory: (m: Memory) => void
  onDeleteMemory: (m: Memory) => void
  onToggleMemoryPrivacy: (id: string) => void
}) {
  const [filter, setFilter] = useState<'ALL' | 'PHOTOS' | 'BOARDS' | 'NOTES' | 'PUBLIC' | 'PRIVATE'>('ALL')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  const items = useMemo(() => {
    let list: Array<{ type: 'memory' | 'board' | 'note'; date: string; data: any }> = []

    if (filter === 'ALL' || filter === 'PHOTOS' || filter === 'PUBLIC' || filter === 'PRIVATE') {
      memories.forEach(m => {
        if (filter === 'PUBLIC' && m.privacy !== 'public') return
        if (filter === 'PRIVATE' && m.privacy !== 'private') return
        list.push({ type: 'memory', date: m.createdAt || m.date, data: m })
      })
    }

    if (filter === 'ALL' || filter === 'BOARDS' || filter === 'PUBLIC' || filter === 'PRIVATE') {
      boards.forEach(b => {
        if (filter === 'PUBLIC' && b.privacy !== 'public') return
        if (filter === 'PRIVATE' && b.privacy !== 'private') return
        list.push({ type: 'board', date: b.createdAt || '2026-08-01', data: b })
      })
    }

    if (filter === 'ALL' || filter === 'NOTES' || filter === 'PRIVATE') {
      notes.forEach(n => {
        if (filter === 'PRIVATE' && n.privacy !== 'private') return
        list.push({ type: 'note', date: n.createdAt || n.date, data: n })
      })
    }

    list.sort((a, b) => {
      const timeA = new Date(a.date).getTime() || 0
      const timeB = new Date(b.date).getTime() || 0
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB
    })

    return list
  }, [memories, boards, notes, filter, sortOrder])

  return (
    <section className="screen space-y-6">
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-[#b1afb8] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#8b8991]">Sort:</span>
          <button
            onClick={() => setSortOrder(s => (s === 'newest' ? 'oldest' : 'newest'))}
            className="btn-secondary text-xs px-3 py-1.5"
          >
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>
      </div>

      <div>
        <span className="eyebrow block mb-2 text-[10px]">PERSONAL HISTORY</span>
        <h1 className="title-large">Visual Memory Archive</h1>
        <p className="lede mt-2 mb-0">Your complete personal collection of moments, boards, and thoughts.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-2 border-b border-white/10">
        {(['ALL', 'PHOTOS', 'BOARDS', 'NOTES', 'PUBLIC', 'PRIVATE'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-2 text-xs font-medium tracking-wider transition-all relative ${
              filter === f ? 'text-white' : 'text-[#8b8991] hover:text-white'
            }`}
          >
            {f}
            {filter === f && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c7a6ff]" />}
          </button>
        ))}
      </div>

      {/* Archive Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => {
            if (item.type === 'memory') {
              const m: Memory = item.data
              return (
                <MemoryCard
                  key={m.id}
                  memory={m}
                  onClick={() => onMemory(m)}
                  isSaved={isSaved('moment', m.id)}
                  onToggleSave={e => onToggleSave('moment', m.id, e)}
                />
              )
            }
            if (item.type === 'board') {
              const b: Board = item.data
              return (
                <BoardCard
                  key={b.id}
                  board={b}
                  allBoards={boards}
                  allMemories={memories}
                  onClick={() => onBoard(b)}
                  isSaved={isSaved('board', b.id)}
                  onToggleSave={e => onToggleSave('board', b.id, e)}
                />
              )
            }
            if (item.type === 'note') {
              const n: Note = item.data
              return (
                <div key={n.id} className="note-card glass-card">
                  <span className="text-[#c7a6ff] text-xs font-semibold block mb-1">✦ NOTE</span>
                  <p>"{n.text}"</p>
                  <span>{n.date}</span>
                </div>
              )
            }
            return null
          })}
        </div>
      ) : (
        <div className="py-20 text-center glass-card border border-dashed border-white/10 rounded-3xl p-8">
          <Archive size={32} className="mx-auto mb-3 text-[#8b8991]" />
          <h3 className="text-sm font-medium text-white mb-1">Your archive is empty</h3>
          <p className="text-xs text-[#b1afb8]">Create your first moment to start filling your archive.</p>
        </div>
      )}
    </section>
  )
}

/* SAVED PAGE — FAVORITES SECTION */
function SavedPage({
  savedItems,
  boards,
  memories,
  onBoard,
  onMemory,
  onBack,
  isSaved,
  onToggleSave,
}: {
  savedItems: SavedItem[]
  boards: Board[]
  memories: Memory[]
  onBoard: (b: Board) => void
  onMemory: (m: Memory) => void
  onBack: () => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
}) {
  const [filter, setFilter] = useState<'ALL' | 'BOARDS' | 'MOMENTS'>('ALL')

  const savedBoards = useMemo(() => {
    const ids = savedItems.filter(s => s.itemType === 'board').map(s => s.itemId)
    return boards.filter(b => ids.includes(b.id))
  }, [savedItems, boards])

  const savedMemories = useMemo(() => {
    const ids = savedItems.filter(s => s.itemType === 'moment').map(s => s.itemId)
    return memories.filter(m => ids.includes(m.id))
  }, [savedItems, memories])

  const isEmpty =
    (filter === 'ALL' && savedBoards.length === 0 && savedMemories.length === 0) ||
    (filter === 'BOARDS' && savedBoards.length === 0) ||
    (filter === 'MOMENTS' && savedMemories.length === 0)

  return (
    <section className="screen space-y-6">
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-[#b1afb8] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>

      <div>
        <span className="eyebrow block mb-2 text-[10px]">SAVED & FAVORITES</span>
        <h1 className="title-large">Saved Items</h1>
        <p className="lede mt-2 mb-0">Your bookmarked collections and favorite moments.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-6 border-b border-white/10 pb-2">
        {(['ALL', 'BOARDS', 'MOMENTS'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-2 text-xs font-medium tracking-wider transition-all relative ${
              filter === f ? 'text-white' : 'text-[#8b8991] hover:text-white'
            }`}
          >
            {f}
            {filter === f && <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c7a6ff]" />}
          </button>
        ))}
      </div>

      {!isEmpty ? (
        <div className="space-y-8">
          {(filter === 'ALL' || filter === 'BOARDS') && savedBoards.length > 0 && (
            <div>
              <div className="section-header">
                <h2>SAVED COLLECTIONS ({savedBoards.length})</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedBoards.map(b => (
                  <BoardCard
                    key={b.id}
                    board={b}
                    allBoards={boards}
                    allMemories={memories}
                    onClick={() => onBoard(b)}
                    isSaved={true}
                    onToggleSave={e => onToggleSave('board', b.id, e)}
                  />
                ))}
              </div>
            </div>
          )}

          {(filter === 'ALL' || filter === 'MOMENTS') && savedMemories.length > 0 && (
            <div>
              <div className="section-header">
                <h2>SAVED MOMENTS ({savedMemories.length})</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedMemories.map(m => (
                  <MemoryCard
                    key={m.id}
                    memory={m}
                    onClick={() => onMemory(m)}
                    isSaved={true}
                    onToggleSave={e => onToggleSave('moment', m.id, e)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-20 text-center glass-card border border-dashed border-white/10 rounded-3xl p-8">
          <Bookmark size={32} className="mx-auto mb-3 text-[#8b8991]" />
          <h3 className="text-sm font-medium text-white mb-1">Nothing saved yet</h3>
          <p className="text-xs text-[#b1afb8]">Explore and save something you love to view it here.</p>
        </div>
      )}
    </section>
  )
}

/* BOARD / COLLECTION PAGE */
function BoardPage({
  board,
  allBoards,
  blocks,
  allMemories,
  allNotes,
  onBack,
  onMemory,
  onBoard,
  onAddBlock,
  onEditBoard,
  onDeleteBoard,
  onAddChildBoard,
  onDeleteBlock,
  onReorderBlock,
  onShareBoard,
  isSaved,
  onToggleSave,
}: {
  board: Board
  allBoards: Board[]
  blocks: BoardBlock[]
  allMemories: Memory[]
  allNotes: Note[]
  onBack: () => void
  onMemory: (m: Memory) => void
  onBoard: (b: Board) => void
  onAddBlock: (blockData: Omit<BoardBlock, 'id' | 'order'>) => void
  onEditBoard: () => void
  onDeleteBoard: () => void
  onAddChildBoard: () => void
  onDeleteBlock: (blockId: string) => void
  onReorderBlock: (blockId: string, direction: 'up' | 'down') => void
  onShareBoard: () => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
}) {
  const [boardSheet, setBoardSheet] = useState<string | null>(null)

  // Calculate dynamic counts
  const childBoards = useMemo(() => allBoards.filter(b => b.parentBoardId === board.id), [allBoards, board.id])
  const parentBoard = useMemo(
    () => (board.parentBoardId ? allBoards.find(b => b.id === board.parentBoardId) : null),
    [allBoards, board.parentBoardId]
  )

  const heroMemory = allMemories[0]
  const remainingMemories = allMemories.slice(1)

  return (
    <section className="screen space-y-6">
      {/* Header Controls & Breadcrumbs */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-xs text-[#b1afb8]">
          <button onClick={onBack} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          {parentBoard && (
            <>
              <span>/</span>
              <button onClick={() => onBoard(parentBoard)} className="hover:text-white transition-colors">
                {parentBoard.name}
              </button>
            </>
          )}
          <span>/</span>
          <span className="text-white font-medium">{board.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={e => onToggleSave('board', board.id, e)} className="btn-secondary text-xs px-3 py-1.5">
            <Bookmark size={13} className={isSaved('board', board.id) ? 'fill-[#c7a6ff] text-[#c7a6ff]' : ''} />
            {isSaved('board', board.id) ? 'Saved' : 'Save'}
          </button>
          <button onClick={onShareBoard} className="btn-secondary text-xs px-3 py-1.5">
            <Share2 size={13} /> Share
          </button>
          <button onClick={onEditBoard} className="btn-secondary text-xs px-3 py-1.5" title="Edit collection">
            <Pencil size={13} /> Edit
          </button>
          <button onClick={onDeleteBoard} className="btn-secondary text-xs px-3 py-1.5 text-rose-400/80 hover:text-rose-400" title="Delete collection">
            <Trash2 size={13} />
          </button>
          <button onClick={() => setBoardSheet('add')} className="btn-secondary text-xs px-3 py-1.5">
            <Plus size={14} /> Add Block
          </button>
        </div>
      </div>

      {/* Cinematic Board Header */}
      <div className="relative h-72 sm:h-80 rounded-3xl overflow-hidden border border-white/10 glass-card">
        <img src={board.image} alt={board.name} className="w-full h-full object-cover opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute top-5 right-5 z-10">
          <span className={`badge-privacy ${board.privacy === 'public' ? 'is-public' : ''}`}>
            {board.privacy === 'private' ? <LockKeyhole size={10} /> : <Globe2 size={10} />}
            {board.privacy.toUpperCase()}
          </span>
        </div>
        <div className="absolute bottom-6 left-6 right-6 space-y-2 z-10">
          <span className="eyebrow flex items-center gap-2 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c7a6ff]" /> CURATED COLLECTION
          </span>
          <h1 className="text-3xl sm:text-4xl font-normal text-white">{board.name}</h1>
          {board.description && (
            <p className="text-xs sm:text-sm text-[#b1afb8] max-w-2xl font-serif italic leading-relaxed">
              "{board.description}"
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#8b8991] pt-1">
            <span>{allMemories.length} memories</span>
            <span>· {childBoards.length} child boards</span>
            <span>· {allNotes.length} notes</span>
            {board.location && (
              <span className="flex items-center gap-1">
                · <MapPin size={10} className="text-[#c7a6ff]" /> {board.location}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Child Boards Section */}
      <div>
        <div className="section-header">
          <h2>CHILD BOARDS ({childBoards.length})</h2>
          <button onClick={onAddChildBoard} className="text-xs text-[#c7a6ff] hover:underline flex items-center gap-1">
            <FolderPlus size={14} /> + Add Child Board
          </button>
        </div>
        {childBoards.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {childBoards.map((child, idx) => (
              <div
                key={child.id}
                onClick={() => onBoard(child)}
                className="glass-card p-4 flex flex-col justify-between group cursor-pointer hover:border-white/25 transition-all min-h-[110px]"
              >
                <div className="flex items-center justify-between text-[10px] text-[#c7a6ff]">
                  <span>Child #{idx + 1}</span>
                  <ChevronRight size={14} className="text-[#8b8991] group-hover:text-white" />
                </div>
                <div>
                  <strong className="text-xs sm:text-sm text-white font-medium block group-hover:text-[#c7a6ff] transition-colors">
                    {child.name}
                  </strong>
                  <small className="text-[10px] text-[#66636c] block mt-0.5">Explore sub-collection →</small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 px-4 rounded-2xl glass-card border border-dashed border-white/10 flex items-center justify-between">
            <span className="text-xs text-[#b1afb8]">No child boards yet in this collection.</span>
            <button onClick={onAddChildBoard} className="btn-secondary text-xs px-3 py-1">
              + Create Child Board
            </button>
          </div>
        )}
      </div>

      {/* Controlled Asymmetric Visual Layout */}
      <div>
        <div className="section-header">
          <h2>CURATED MOODBOARD ({allMemories.length} MEMORIES)</h2>
        </div>

        {allMemories.length > 0 ? (
          <div className="space-y-6">
            {heroMemory && (
              <div
                onClick={() => onMemory(heroMemory)}
                className="glass-card relative h-80 sm:h-[400px] rounded-3xl overflow-hidden group cursor-pointer border border-white/12 shadow-2xl"
              >
                {heroMemory.image ? (
                  <GlassImage src={heroMemory.image} alt={heroMemory.title} />
                ) : (
                  <div className="w-full h-full bg-neutral-950 flex items-center justify-center text-white/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                  <span className="text-[10px] bg-black/70 px-3 py-1 rounded-full border border-white/15 text-white/90 font-medium">
                    ✦ FEATURED OPENER
                  </span>
                  <span className={`badge-privacy ${heroMemory.privacy === 'public' ? 'is-public' : ''}`}>
                    {heroMemory.privacy === 'private' ? <LockKeyhole size={9} /> : <Globe2 size={9} />}
                    {heroMemory.privacy}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 space-y-1 z-10">
                  <h3 className="text-xl sm:text-2xl font-normal text-white group-hover:text-[#c7a6ff] transition-colors">
                    {heroMemory.title}
                  </h3>
                  <p className="text-xs text-[#b1afb8] line-clamp-2 max-w-xl">{heroMemory.description}</p>
                </div>
              </div>
            )}

            {/* EDITORIAL QUOTE NOTE BLOCK */}
            <div className="glass-card p-6 border-l-2 border-l-[#c7a6ff]">
              <span className="eyebrow block mb-2 text-[10px]">EDITORIAL NOTE</span>
              <p className="editorial-note-text text-sm sm:text-base">
                "Some places are worth remembering for reasons you can't explain. We collect pieces of moments to hold onto what time moves past."
              </p>
              <span className="text-[11px] text-[#66636c] block mt-3">— Archive Thought · {board.name}</span>
            </div>

            {/* REMAINING MEMORIES MASONRY GRID */}
            {remainingMemories.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {remainingMemories.map(m => (
                  <MemoryCard
                    key={m.id}
                    memory={m}
                    onClick={() => onMemory(m)}
                    isSaved={isSaved('moment', m.id)}
                    onToggleSave={e => onToggleSave('moment', m.id, e)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-white/12 rounded-3xl glass-card p-8">
            <Archive size={32} className="mx-auto mb-3 text-[#8b8991]" />
            <p className="text-sm font-medium text-white mb-1">No moments in this board yet</p>
            <p className="text-xs text-[#b1afb8] mb-6 max-w-xs mx-auto">
              Start assembling your moodboard with moments, photos, notes, and sub-boards.
            </p>
            <button onClick={() => setBoardSheet('add')} className="btn-primary max-w-xs mx-auto">
              + Add First Moment
            </button>
          </div>
        )}
      </div>

      {/* Creation Bottom Sheet inside Board */}
      {boardSheet && (
        <div className="sheet-backdrop" onClick={() => setBoardSheet(null)}>
          <div className="creation-sheet glass-card" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="flex justify-between items-center mb-6">
              <span className="eyebrow">ADD BLOCK TO {board.name.toUpperCase()}</span>
              <button onClick={() => setBoardSheet(null)} className="text-[#8b8991] hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setBoardSheet(null)
                  onAddBlock({
                    boardId: board.id,
                    type: 'photo',
                    title: 'New Visual Moment',
                    image: images.cafe,
                    date: 'August 2026',
                  })
                }}
                className="glass-card p-5 text-left hover:border-white/25 transition-all"
              >
                <div className="p-2.5 rounded-xl bg-white/5 text-white w-fit mb-3">
                  <ImagePlus size={18} />
                </div>
                <strong className="text-xs text-white block font-medium">Pin / Photo</strong>
                <small className="text-[10px] text-[#66636c]">Visual photo moment</small>
              </button>

              <button
                onClick={() => {
                  setBoardSheet(null)
                  onAddBlock({
                    boardId: board.id,
                    type: 'note',
                    content: 'A quiet thought for this collection.',
                    date: 'August 2026',
                  })
                }}
                className="glass-card p-5 text-left hover:border-white/25 transition-all"
              >
                <div className="p-2.5 rounded-xl bg-white/5 text-white w-fit mb-3">
                  <FileText size={18} />
                </div>
                <strong className="text-xs text-white block font-medium">Note</strong>
                <small className="text-[10px] text-[#66636c]">Editorial text fragment</small>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/* MEMORY VIEWER PAGE */
function MemoryPage({
  memory,
  board,
  onBack,
  onEdit,
  onDelete,
  onTogglePrivacy,
  onNext,
  onPrev,
  isSaved,
  onToggleSave,
}: {
  memory: Memory
  board?: Board
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
  onTogglePrivacy: () => void
  onNext: () => void
  onPrev: () => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
}) {
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
    <section className="screen min-h-svh flex flex-col space-y-6">
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-[#b1afb8] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-center gap-2">
          <button onClick={e => onToggleSave('moment', memory.id, e)} className="btn-secondary text-xs px-3 py-1">
            <Bookmark size={12} className={isSaved('moment', memory.id) ? 'fill-[#c7a6ff] text-[#c7a6ff]' : ''} />
            {isSaved('moment', memory.id) ? 'Saved' : 'Save'}
          </button>
          <button onClick={onEdit} className="btn-secondary text-xs px-3 py-1">
            <Pencil size={12} /> Edit
          </button>
          <button onClick={onPrev} className="btn-secondary text-xs px-3 py-1">
            ← Prev
          </button>
          <button onClick={onNext} className="btn-secondary text-xs px-3 py-1">
            Next →
          </button>
        </div>
      </div>

      {memory.image && (
        <div className="relative w-full h-[380px] sm:h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-black">
          <img src={memory.image} alt={memory.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex-1 space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <button onClick={onTogglePrivacy} className={`badge-privacy ${memory.privacy === 'public' ? 'is-public' : ''}`}>
            {memory.privacy === 'private' ? <LockKeyhole size={11} /> : <Globe2 size={11} />}
            {memory.privacy.toUpperCase()}
          </button>
          {memory.mood && (
            <span className="text-xs bg-white/5 text-[#b1afb8] border border-white/10 px-3 py-1 rounded-full">
              {memory.mood}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-normal text-white">{memory.title}</h1>
        <p className="text-sm text-[#b1afb8] leading-relaxed">{memory.description}</p>

        <div className="flex items-center gap-4 text-xs text-[#8b8991] border-t border-b border-white/10 py-4">
          {memory.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#c7a6ff]" /> {memory.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={13} /> {memory.date}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {memory.tags.map(t => (
            <span key={t} className="text-xs bg-white/5 border border-white/10 text-[#b1afb8] px-3 py-1 rounded-full">
              #{t}
            </span>
          ))}
        </div>

        {board && (
          <div className="glass-card p-4 flex items-center justify-between">
            <span className="text-xs text-[#8b8991]">COLLECTION</span>
            <strong className="text-xs text-white font-medium">{board.name}</strong>
          </div>
        )}

        <button onClick={onDelete} className="flex items-center gap-2 text-xs text-rose-400/80 hover:text-rose-400 pt-4">
          <Trash2 size={14} /> Delete memory from archive
        </button>
      </div>
    </section>
  )
}

/* CREATION / EDIT BOTTOM SHEET */
function CreationSheet({
  type,
  boards,
  profile,
  editingMemory,
  editingBoard,
  parentBoard,
  onClose,
  onBoard,
  onUpdateBoard,
  onMemory,
  onUpdateMemory,
  onNote,
  onProfile,
}: {
  type: string
  boards: Board[]
  profile: Profile
  editingMemory?: Memory | null
  editingBoard?: Board | null
  parentBoard?: Board | null
  onClose: () => void
  onBoard: (b: any) => void
  onUpdateBoard: (id: string, b: any) => void
  onMemory: (m: any) => void
  onUpdateMemory: (id: string, m: any) => void
  onNote: (n: string) => void
  onProfile: (p: Profile) => void
}) {
  const [mode, setMode] = useState<string>(
    type === 'menu' ? '' : type
  )

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="creation-sheet glass-card" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />

        <div className="flex justify-between items-center mb-6">
          <span className="eyebrow">
            {mode
              ? mode === 'profile'
                ? 'EDIT PROFILE'
                : mode === 'edit-memory'
                ? 'EDIT MOMENT'
                : mode === 'memory'
                ? 'ADD MOMENT'
                : mode === 'edit-board'
                ? 'EDIT COLLECTION'
                : mode === 'create-child-board'
                ? `NEW CHILD BOARD IN ${parentBoard?.name.toUpperCase() || 'BOARD'}`
                : mode === 'board'
                ? 'CREATE COLLECTION'
                : mode === 'story'
                ? 'CREATE STORY'
                : 'WRITE NOTE'
              : 'CREATE'}
          </span>
          <button onClick={onClose} className="text-[#8b8991] hover:text-white">
            <X size={18} />
          </button>
        </div>

        {!mode ? (
          <div className="space-y-3">
            <button
              onClick={() => setMode('memory')}
              className="w-full glass-card p-4 flex items-center gap-4 text-left hover:border-white/25 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-white/5 text-white">
                <ImagePlus size={20} />
              </div>
              <div className="flex-1">
                <strong className="text-sm text-white block font-medium">Add Moment</strong>
                <small className="text-xs text-[#b1afb8]">Save a visual photo or memory</small>
              </div>
              <ChevronRight size={16} className="text-[#8b8991]" />
            </button>

            <button
              onClick={() => setMode('board')}
              className="w-full glass-card p-4 flex items-center gap-4 text-left hover:border-white/25 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-white/5 text-white">
                <LayoutGrid size={20} />
              </div>
              <div className="flex-1">
                <strong className="text-sm text-white block font-medium">Create Board</strong>
                <small className="text-xs text-[#b1afb8]">Give this little world a place to live</small>
              </div>
              <ChevronRight size={16} className="text-[#8b8991]" />
            </button>

            <button
              onClick={() => setMode('note')}
              className="w-full glass-card p-4 flex items-center gap-4 text-left hover:border-white/25 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-white/5 text-white">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <strong className="text-sm text-white block font-medium">Add Note</strong>
                <small className="text-xs text-[#b1afb8]">Tuck away a personal thought</small>
              </div>
              <ChevronRight size={16} className="text-[#8b8991]" />
            </button>

            <button
              onClick={() => setMode('story')}
              className="w-full glass-card p-4 flex items-center gap-4 text-left hover:border-white/25 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-white/5 text-white">
                <BookOpen size={20} />
              </div>
              <div className="flex-1">
                <strong className="text-sm text-white block font-medium">Create Story</strong>
                <small className="text-xs text-[#b1afb8]">Write an editorial narrative fragment</small>
              </div>
              <ChevronRight size={16} className="text-[#8b8991]" />
            </button>
          </div>
        ) : mode === 'memory' || mode === 'edit-memory' ? (
          <MemoryForm
            boards={boards}
            initial={editingMemory}
            onSave={m => {
              if (editingMemory) {
                onUpdateMemory(editingMemory.id, m)
              } else {
                onMemory(m)
              }
            }}
          />
        ) : mode === 'board' || mode === 'edit-board' || mode === 'create-child-board' ? (
          <BoardForm
            initial={editingBoard}
            parentBoard={parentBoard}
            onSave={b => {
              if (editingBoard) {
                onUpdateBoard(editingBoard.id, b)
              } else {
                onBoard(b)
              }
            }}
          />
        ) : mode === 'story' ? (
          <MemoryForm
            boards={boards}
            isStory={true}
            onSave={m => onMemory(m)}
          />
        ) : mode === 'note' ? (
          <NoteForm onSave={onNote} />
        ) : (
          <ProfileForm profile={profile} onSave={onProfile} />
        )}
      </div>
    </div>
  )
}

/* Glass Confirmation Modal */
function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="sheet-backdrop" onClick={onCancel}>
      <div
        className="glass-card p-6 max-w-md w-full mx-4 rounded-3xl space-y-4 animate-fadeIn border border-white/15 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 text-rose-400">
          <Shield size={20} />
          <h3 className="text-base font-normal text-white">{title}</h3>
        </div>
        <p className="text-xs text-[#b1afb8] leading-relaxed">{message}</p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onCancel} className="btn-secondary text-xs px-4 py-2">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-primary text-xs px-4 py-2 bg-rose-950/60 border-rose-500/40 text-rose-200 hover:bg-rose-900/80"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* Mobile-Friendly Image Upload Component */
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
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full h-36 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] flex flex-col items-center justify-center gap-2 text-[#b1afb8] hover:border-white/40 transition-all overflow-hidden relative group"
        >
          {value ? (
            <>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition-opacity">
                Click to replace photo
              </div>
            </>
          ) : (
            <>
              <Camera size={22} className="text-white" />
              <span className="text-xs text-[#b1afb8]">Choose photo from camera roll</span>
            </>
          )}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-rose-400/80 hover:text-rose-400 block ml-auto"
          >
            Remove image
          </button>
        )}
      </div>
    </div>
  )
}

/* Memory Creation / Edit Form */
function MemoryForm({
  boards,
  initial,
  isStory,
  onSave,
}: {
  boards: Board[]
  initial?: Memory | null
  isStory?: boolean
  onSave: (m: any) => void
}) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [image, setImage] = useState(initial?.image || '')
  const [boardId, setBoardId] = useState(initial?.boardId || boards[0]?.id || '')
  const [date, setDate] = useState(initial?.date || 'August 2026')
  const [location, setLocation] = useState(initial?.location || '')
  const [mood, setMood] = useState(initial?.mood || '☁ nostalgic')
  const [tags, setTags] = useState(initial?.tags ? initial.tags.join(', ') : 'memory, quiet')
  const [privacy, setPrivacy] = useState<PrivacyStatus>(initial?.privacy || 'private')

  const moods = ['☁ nostalgic', '☕ cozy', '✨ serene', '📚 peaceful', '🌙 quiet', '🍃 fresh']

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (title.trim()) {
          onSave({
            title,
            description,
            image: image || (isStory ? images.library : images.rain),
            boardId,
            date,
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
        <label>{isStory ? 'Cover Photo (Optional)' : 'Photo'}</label>
        <ImageUpload value={image} onChange={setImage} />
      </div>

      <div className="form-group">
        <label>Title</label>
        <input
          required
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={isStory ? 'Story Title...' : 'Name this moment'}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>{isStory ? 'Story / Narrative Content' : 'Description'}</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder={isStory ? 'Write your story fragment here...' : 'What do you want to remember?'}
          className="form-textarea min-h-[110px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label>Collection</label>
          <select value={boardId} onChange={e => setBoardId(e.target.value)} className="form-select">
            <option value="" className="bg-black text-white">No collection (Archive)</option>
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

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label>Date</label>
          <input
            type="text"
            value={date}
            onChange={e => setDate(e.target.value)}
            placeholder="e.g. August 2026"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g. rain, quiet"
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
                mood === m ? 'bg-white/10 border-white text-white' : 'bg-white/5 border-white/10 text-[#8b8991]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
        <span className="text-xs text-[#b1afb8]">Visibility</span>
        <div className="flex gap-2">
          {(['private', 'public'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPrivacy(p)}
              className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 border transition-all ${
                privacy === p ? 'bg-white/10 border-white text-white' : 'bg-transparent border-white/10 text-[#66636c]'
              }`}
            >
              {p === 'private' ? <LockKeyhole size={10} /> : <Globe2 size={10} />}
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary mt-2">
        {initial ? 'Update Moment' : 'Save Moment'}
      </button>
    </form>
  )
}

/* Collection Creation / Edit Form */
function BoardForm({
  initial,
  parentBoard,
  onSave,
}: {
  initial?: Board | null
  parentBoard?: Board | null
  onSave: (b: any) => void
}) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [image, setImage] = useState(initial?.image || '')
  const [location, setLocation] = useState(initial?.location || '')
  const [privacy, setPrivacy] = useState<PrivacyStatus>(initial?.privacy || 'private')

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
            parentBoardId: initial?.parentBoardId || parentBoard?.id,
          })
        }
      }}
      className="space-y-4"
    >
      <div className="mb-2">
        <h3 className="text-lg font-normal text-white">
          {initial ? 'EDIT COLLECTION' : parentBoard ? `CHILD BOARD OF ${parentBoard.name}` : 'CREATE A COLLECTION'}
        </h3>
        <p className="text-xs text-[#b1afb8]">Give this little world a place to live.</p>
      </div>

      <div className="form-group">
        <label>Board name</label>
        <input
          required
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Japan — Someday"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="e.g. Tokyo, Kyoto, quiet streets..."
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label>Cover image</label>
        <ImageUpload value={image} onChange={setImage} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g. Japan"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Visibility</label>
          <select value={privacy} onChange={e => setPrivacy(e.target.value as PrivacyStatus)} className="form-select">
            <option value="private" className="bg-black text-white">Private</option>
            <option value="public" className="bg-black text-white">Public</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn-primary mt-2">
        {initial ? 'Update Collection' : 'Create collection'}
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
        <textarea value={p.bio} onChange={e => setP({ ...p, bio: e.target.value })} className="form-textarea" />
      </div>
      <button type="submit" className="btn-primary">
        Update Profile
      </button>
    </form>
  )
}
