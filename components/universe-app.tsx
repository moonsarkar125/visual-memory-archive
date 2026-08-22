'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import {
  Archive, ArrowLeft, Bell, BookOpen, Camera, ChevronRight, CircleUserRound,
  FileText, Globe2, ImagePlus, LockKeyhole, MapPin, MoreHorizontal,
  Pencil, Plus, Search, Send, Settings, Sparkles, Trash2, X, Heart, LayoutGrid,
  Shuffle, ArrowRight, Compass, Eye, Shield, Tag, Calendar, Layers,
  Pin, Share2, Quote, ExternalLink, SlidersHorizontal, ArrowUp, ArrowDown,
  Bookmark, FolderPlus, UserPlus, UserCheck, Users, User
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
  kyotoTemple: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=85',
  streetArt: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=85',
}

export type PrivacyStatus = 'private' | 'public'

export type Mood = {
  id: string
  name: string
  icon: string
  description?: string
}

export type Place = {
  id: string
  name: string
  location: string
  coordinates?: string
  image?: string
  description?: string
  ownerId?: string
  createdAt?: string
  updatedAt?: string
}

export type EraItem = {
  id: string
  label: string
  icon?: string
  order: number
}

export type Board = {
  id: string
  name: string
  description: string
  image: string
  count?: number
  location?: string
  placeId?: string
  privacy: PrivacyStatus
  parentBoardId?: string
  children?: string[]
  ownerId?: string
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
  placeId?: string
  date: string
  location?: string
  privacy: PrivacyStatus
  tags: string[]
  mood?: string
  moodId?: string
  ownerId?: string
  createdAt?: string
  updatedAt?: string
}

export type Note = {
  id: string
  text: string
  date: string
  privacy: PrivacyStatus
  boardId?: string
  placeId?: string
  moodId?: string
  ownerId?: string
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
  currentEraItems?: EraItem[]
  isPublic?: boolean
}

export type SavedItem = {
  id: string
  userId: string
  itemType: 'board' | 'moment'
  itemId: string
  savedAt: string
}

export type Follow = {
  id: string
  followerId: string
  followingId: string
  createdAt: string
}

const starterMoods: Mood[] = [
  { id: 'nostalgic', name: 'Nostalgic', icon: '☁', description: 'Memories that feel soft and distant' },
  { id: 'cozy', name: 'Cozy', icon: '☕', description: 'Warm cups, quiet corners, and soft light' },
  { id: 'rainy', name: 'Rainy', icon: '🌧', description: 'Tapping raindrops on window panes' },
  { id: 'late-night', name: 'Late Night', icon: '🌙', description: '2am thoughts and dim neon' },
  { id: 'dreamy', name: 'Dreamy', icon: '✨', description: 'Subtle wonder and starry skies' },
  { id: 'peaceful', name: 'Peaceful', icon: '🌿', description: 'Calm mornings and green leaves' },
  { id: 'dark', name: 'Dark', icon: '🖤', description: 'Deep shadows, ambient black, and mystery' },
]

const starterPlaces: Place[] = [
  {
    id: 'blue-door-cafe',
    name: 'Blue Door Café',
    location: 'Jamshedpur',
    image: images.cafe,
    description: 'Little tables, warm espresso, and long afternoon conversations.',
    ownerId: 'terribleracoon556',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'shinjuku-alley',
    name: 'Shinjuku Alley',
    location: 'Tokyo, Japan',
    image: images.tokyo,
    description: 'Narrow neon-lit alleys and late night ramen counters.',
    ownerId: 'terribleracoon556',
    createdAt: '2026-08-03T10:00:00.000Z',
    updatedAt: '2026-08-03T10:00:00.000Z',
  },
  {
    id: 'gion-kyoto',
    name: 'Gion Rain Street',
    location: 'Kyoto, Japan',
    image: images.rain,
    description: 'Quiet wooden eaves and rainy evenings.',
    ownerId: 'voyager_kyoto',
    createdAt: '2026-08-04T10:00:00.000Z',
    updatedAt: '2026-08-04T10:00:00.000Z',
  },
  {
    id: 'arashiyama-bamboo',
    name: 'Arashiyama Bamboo Grove',
    location: 'Kyoto, Japan',
    image: images.kyotoTemple,
    description: 'Towering green bamboo stalks whispering in the wind.',
    ownerId: 'voyager_kyoto',
    createdAt: '2026-08-05T10:00:00.000Z',
    updatedAt: '2026-08-05T10:00:00.000Z',
  },
]

const starterEraItems: EraItem[] = [
  { id: 'era-1', label: 'late night coding', icon: '💻', order: 1 },
  { id: 'era-2', label: 'coffee', icon: '☕', order: 2 },
  { id: 'era-3', label: 'cybersecurity', icon: '💻', order: 3 },
  { id: 'era-4', label: 'books', icon: '📚', order: 4 },
  { id: 'era-5', label: '2am thoughts', icon: '🌙', order: 5 },
]

const starterProfiles: Profile[] = [
  {
    username: 'terribleracoon556',
    displayName: 'Shreya',
    bio: 'collecting little moments ✦',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    cover: images.japan,
    location: 'Jamshedpur',
    currentEra: ['late night coding', '☕ coffee', '💻 cybersecurity', '📚 books', '🌙 2am thoughts'],
    currentEraItems: starterEraItems,
    isPublic: true,
  },
  {
    username: 'voyager_kyoto',
    displayName: 'Ren',
    bio: 'wandering through quiet tea houses & temple gardens 🌿',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    cover: images.kyotoTemple,
    location: 'Kyoto, Japan',
    currentEra: ['🍵 matcha tasting', '📸 film photography', '🌿 zen gardens'],
    currentEraItems: [
      { id: 'v-1', label: 'matcha tasting', icon: '🍵', order: 1 },
      { id: 'v-2', label: 'film photography', icon: '📸', order: 2 },
      { id: 'v-3', label: 'zen gardens', icon: '🌿', order: 3 },
    ],
    isPublic: true,
  },
  {
    username: 'tokyo_wanderer',
    displayName: 'Kenji',
    bio: 'capturing neon lights and 2am ramen counters 🌙',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    cover: images.tokyo,
    location: 'Tokyo, Japan',
    currentEra: ['🌙 late night walks', '🍜 ramen hunting', '🌆 urban exploring'],
    currentEraItems: [
      { id: 'k-1', label: 'late night walks', icon: '🌙', order: 1 },
      { id: 'k-2', label: 'ramen hunting', icon: '🍜', order: 2 },
      { id: 'k-3', label: 'urban exploring', icon: '🌆', order: 3 },
    ],
    isPublic: true,
  },
]

const starterFollows: Follow[] = [
  { id: 'f-1', followerId: 'terribleracoon556', followingId: 'voyager_kyoto', createdAt: '2026-08-10T10:00:00.000Z' },
  { id: 'f-2', followerId: 'tokyo_wanderer', followingId: 'terribleracoon556', createdAt: '2026-08-12T10:00:00.000Z' },
  { id: 'f-3', followerId: 'voyager_kyoto', followingId: 'tokyo_wanderer', createdAt: '2026-08-14T10:00:00.000Z' },
]

const starterBoards: Board[] = [
  {
    id: 'cafes',
    name: 'Cafés in Jamshedpur',
    description: 'little tables, long conversations, and warm cups',
    image: images.cafe,
    location: 'Jamshedpur',
    placeId: 'blue-door-cafe',
    privacy: 'private',
    ownerId: 'terribleracoon556',
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
    ownerId: 'terribleracoon556',
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
    placeId: 'shinjuku-alley',
    privacy: 'public',
    ownerId: 'terribleracoon556',
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
    placeId: 'gion-kyoto',
    privacy: 'public',
    ownerId: 'terribleracoon556',
    createdAt: '2026-08-04T10:00:00.000Z',
    updatedAt: '2026-08-04T10:00:00.000Z',
  },
  {
    id: 'books',
    name: 'Books I have read',
    description: 'pages that stayed long after finishing',
    image: images.books,
    privacy: 'private',
    ownerId: 'terribleracoon556',
    createdAt: '2026-08-05T10:00:00.000Z',
    updatedAt: '2026-08-05T10:00:00.000Z',
  },
  {
    id: 'anime',
    name: 'Anime universe',
    description: 'favorites and recommendations',
    image: images.hills,
    privacy: 'private',
    ownerId: 'terribleracoon556',
    createdAt: '2026-08-06T10:00:00.000Z',
    updatedAt: '2026-08-06T10:00:00.000Z',
  },
  {
    id: 'kyoto-zen',
    name: 'Kyoto Architecture & Zen',
    description: 'Moments of peace in ancient temples and moss gardens.',
    image: images.kyotoTemple,
    location: 'Kyoto, Japan',
    privacy: 'public',
    ownerId: 'voyager_kyoto',
    createdAt: '2026-08-08T10:00:00.000Z',
    updatedAt: '2026-08-08T10:00:00.000Z',
  },
  {
    id: 'tokyo-streets',
    name: 'Tokyo Street Photography',
    description: 'Reflections, crosswalks, and midnight shadows.',
    image: images.streetArt,
    location: 'Tokyo, Japan',
    privacy: 'public',
    ownerId: 'tokyo_wanderer',
    createdAt: '2026-08-09T10:00:00.000Z',
    updatedAt: '2026-08-09T10:00:00.000Z',
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
]

const starterMemories: Memory[] = [
  {
    id: 'rain',
    title: 'Rainy evening in Kyoto',
    description: 'Watching the rain fall softly over green tea roofs in Gion.',
    image: images.rain,
    boardId: 'japan',
    placeId: 'gion-kyoto',
    date: 'August 2026',
    location: 'Kyoto, Japan',
    privacy: 'public',
    mood: '🌧 Rainy',
    moodId: 'rainy',
    tags: ['japan', 'rain', 'quiet'],
    ownerId: 'terribleracoon556',
    createdAt: '2026-08-14T18:30:00.000Z',
    updatedAt: '2026-08-14T18:30:00.000Z',
  },
  {
    id: 'tokyo',
    title: 'Tokyo night lights',
    description: 'Walking alone through Shinjuku past neon signs reflecting on wet asphalt.',
    image: images.tokyo,
    boardId: 'tokyo-nights',
    placeId: 'shinjuku-alley',
    date: 'July 2026',
    location: 'Shinjuku, Tokyo',
    privacy: 'public',
    mood: '🌙 Late Night',
    moodId: 'late-night',
    tags: ['tokyo', 'night', 'neon'],
    ownerId: 'terribleracoon556',
    createdAt: '2026-07-28T22:15:00.000Z',
    updatedAt: '2026-07-28T22:15:00.000Z',
  },
  {
    id: 'tea',
    title: 'Quiet tea house',
    description: 'A steaming cup of matcha in a wooden room with tatami mats.',
    image: images.tea,
    boardId: 'japan',
    date: 'June 2026',
    location: 'Uji, Kyoto',
    privacy: 'private',
    mood: '☕ Cozy',
    moodId: 'cozy',
    tags: ['matcha', 'peaceful'],
    ownerId: 'terribleracoon556',
    createdAt: '2026-06-10T11:00:00.000Z',
    updatedAt: '2026-06-10T11:00:00.000Z',
  },
  {
    id: 'books-read',
    title: 'Reading by candlelight',
    description: 'Lost in Murakami chapters while rain taps against the window glass.',
    image: images.books,
    boardId: 'books',
    date: 'July 2026',
    location: 'Jamshedpur',
    privacy: 'private',
    mood: '☁ Nostalgic',
    moodId: 'nostalgic',
    tags: ['books', 'quiet'],
    ownerId: 'terribleracoon556',
    createdAt: '2026-07-15T14:00:00.000Z',
    updatedAt: '2026-07-15T14:00:00.000Z',
  },
  {
    id: 'espresso',
    title: 'Late night espresso',
    description: 'The aroma of freshly roasted beans in a dimly lit corner café.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=85',
    boardId: 'cafes',
    placeId: 'blue-door-cafe',
    date: 'August 2026',
    location: 'Jamshedpur',
    privacy: 'private',
    mood: '☕ Cozy',
    moodId: 'cozy',
    tags: ['coffee', 'night'],
    ownerId: 'terribleracoon556',
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
    mood: '✨ Dreamy',
    moodId: 'dreamy',
    tags: ['night', 'stars'],
    ownerId: 'terribleracoon556',
    createdAt: '2026-08-12T23:00:00.000Z',
    updatedAt: '2026-08-12T23:00:00.000Z',
  },
  {
    id: 'kyoto-bamboo-walk',
    title: 'Morning in Arashiyama',
    description: 'Sunbeams breaking through the bamboo forest path.',
    image: images.kyotoTemple,
    boardId: 'kyoto-zen',
    placeId: 'arashiyama-bamboo',
    date: 'August 2026',
    location: 'Kyoto, Japan',
    privacy: 'public',
    mood: '🌿 Peaceful',
    moodId: 'peaceful',
    tags: ['kyoto', 'bamboo', 'morning'],
    ownerId: 'voyager_kyoto',
    createdAt: '2026-08-15T08:00:00.000Z',
    updatedAt: '2026-08-15T08:00:00.000Z',
  },
  {
    id: 'tokyo-neon-rain',
    title: 'Midnight Crossing',
    description: 'Shibuya scramble crossing after a sudden summer shower.',
    image: images.streetArt,
    boardId: 'tokyo-streets',
    date: 'August 2026',
    location: 'Shibuya, Tokyo',
    privacy: 'public',
    mood: '🖤 Dark',
    moodId: 'dark',
    tags: ['tokyo', 'rain', 'night'],
    ownerId: 'tokyo_wanderer',
    createdAt: '2026-08-16T23:30:00.000Z',
    updatedAt: '2026-08-16T23:30:00.000Z',
  },
]

const starterNotes: Note[] = [
  {
    id: 'note-1',
    text: "Some places are worth remembering for reasons you can't explain.",
    date: 'August 6, 2026',
    privacy: 'private',
    placeId: 'blue-door-cafe',
    moodId: 'nostalgic',
    ownerId: 'terribleracoon556',
    createdAt: '2026-08-06T10:00:00.000Z',
    updatedAt: '2026-08-06T10:00:00.000Z',
  },
  {
    id: 'note-2',
    text: 'Maybe the best part of today was doing absolutely nothing.',
    date: 'August 12, 2026',
    privacy: 'private',
    moodId: 'peaceful',
    ownerId: 'terribleracoon556',
    createdAt: '2026-08-12T10:00:00.000Z',
    updatedAt: '2026-08-12T10:00:00.000Z',
  },
]

const starterSavedItems: SavedItem[] = [
  {
    id: 'saved-1',
    userId: 'terribleracoon556',
    itemType: 'board',
    itemId: 'kyoto-zen',
    savedAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'saved-2',
    userId: 'terribleracoon556',
    itemType: 'moment',
    itemId: 'tokyo-neon-rain',
    savedAt: '2026-08-16T14:00:00.000Z',
  },
]

const uid = () => Math.random().toString(36).slice(2, 9)

export default function UniverseApp() {
  const [page, setPage] = useState<'home' | 'search' | 'inbox' | 'profile' | 'public-profile' | 'board' | 'memory' | 'archive' | 'saved' | 'timeline' | 'place'>('home')
  const [boards, setBoards] = useState<Board[]>(starterBoards)
  const [boardBlocks, setBoardBlocks] = useState<BoardBlock[]>(starterBoardBlocks)
  const [memories, setMemories] = useState<Memory[]>(starterMemories)
  const [notes, setNotes] = useState<Note[]>(starterNotes)
  const [profiles, setProfiles] = useState<Profile[]>(starterProfiles)
  const [profile, setProfile] = useState<Profile>(starterProfiles[0])
  const [savedItems, setSavedItems] = useState<SavedItem[]>(starterSavedItems)
  const [places, setPlaces] = useState<Place[]>(starterPlaces)
  const [moods, setMoods] = useState<Mood[]>(starterMoods)
  const [eraItems, setEraItems] = useState<EraItem[]>(starterEraItems)
  const [follows, setFollows] = useState<Follow[]>(starterFollows)

  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)

  const [sheet, setSheet] = useState<string | null>(null)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [editingBoard, setEditingBoard] = useState<Board | null>(null)
  const [editingPlace, setEditingPlace] = useState<Place | null>(null)
  const [parentForNewChild, setParentForNewChild] = useState<Board | null>(null)

  const [userListModal, setUserListModal] = useState<{ title: string; users: Profile[] } | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'memory' | 'board' | 'note' | 'place'
    id: string
    title: string
    message: string
  } | null>(null)
  const [toast, setToast] = useState('')
  const [shuffledMemory, setShuffledMemory] = useState<Memory | null>(null)

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('little-universe-v3') || localStorage.getItem('little-universe-v2')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.boards) setBoards(data.boards)
        if (data.boardBlocks) setBoardBlocks(data.boardBlocks)
        if (data.memories) setMemories(data.memories)
        if (data.notes) setNotes(data.notes)
        if (data.profiles) setProfiles(data.profiles)
        if (data.profile) setProfile(data.profile)
        if (data.savedItems) setSavedItems(data.savedItems)
        if (data.places) setPlaces(data.places)
        if (data.moods) setMoods(data.moods)
        if (data.eraItems) setEraItems(data.eraItems)
        if (data.follows) setFollows(data.follows)
      }
    } catch {}
  }, [])

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(
      'little-universe-v3',
      JSON.stringify({ boards, boardBlocks, memories, notes, profiles, profile, savedItems, places, moods, eraItems, follows })
    )
  }, [boards, boardBlocks, memories, notes, profiles, profile, savedItems, places, moods, eraItems, follows])

  // Clear toast automatically
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2400)
      return () => clearTimeout(t)
    }
  }, [toast])

  // Pick initial shuffle memory (only user's memories or public memories)
  useEffect(() => {
    const pool = memories.filter(m => m.ownerId === profile.username || m.privacy === 'public')
    if (pool.length > 0 && !shuffledMemory) {
      const randomIdx = Math.floor(Math.random() * pool.length)
      setShuffledMemory(pool[randomIdx])
    }
  }, [memories, profile.username, shuffledMemory])

  const handleShuffle = useCallback(() => {
    const pool = memories.filter(m => m.ownerId === profile.username || m.privacy === 'public')
    if (pool.length === 0) return
    const currentId = shuffledMemory?.id
    const candidates = pool.filter(m => m.id !== currentId)
    const selectionPool = candidates.length > 0 ? candidates : pool
    const randomIdx = Math.floor(Math.random() * selectionPool.length)
    setShuffledMemory(selectionPool[randomIdx])
    setToast('Surfaced a random memory ✦')
  }, [memories, profile.username, shuffledMemory])

  const openBoard = (board: Board) => {
    setSelectedBoard(board)
    setPage('board')
  }

  const openMemory = (memory: Memory) => {
    setSelectedMemory(memory)
    setPage('memory')
  }

  const openPlace = (place: Place) => {
    setSelectedPlace(place)
    setPage('place')
  }

  const openPublicProfile = (username: string) => {
    if (username === profile.username) {
      setPage('profile')
    } else {
      setSelectedUsername(username)
      setPage('public-profile')
    }
  }

  // Saved / Favorites toggle
  const isSaved = (type: 'board' | 'moment', id: string) => {
    return savedItems.some(s => s.userId === profile.username && s.itemType === type && s.itemId === id)
  }

  const toggleSave = (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (isSaved(type, id)) {
      setSavedItems(prev => prev.filter(s => !(s.userId === profile.username && s.itemType === type && s.itemId === id)))
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

  // Follow system logic
  const isFollowing = (targetUsername: string) => {
    return follows.some(f => f.followerId === profile.username && f.followingId === targetUsername)
  }

  const toggleFollow = (targetUsername: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (targetUsername === profile.username) return
    if (isFollowing(targetUsername)) {
      setFollows(prev => prev.filter(f => !(f.followerId === profile.username && f.followingId === targetUsername)))
      setToast(`Unfollowed @${targetUsername}`)
    } else {
      const newFollow: Follow = {
        id: uid(),
        followerId: profile.username,
        followingId: targetUsername,
        createdAt: new Date().toISOString(),
      }
      setFollows(prev => [...prev, newFollow])
      setToast(`Now following @${targetUsername} ✦`)
    }
  }

  const getFollowersCount = (username: string) => follows.filter(f => f.followingId === username).length
  const getFollowingCount = (username: string) => follows.filter(f => f.followerId === username).length

  const getFollowersList = (username: string): Profile[] => {
    const followerUsernames = follows.filter(f => f.followingId === username).map(f => f.followerId)
    return profiles.filter(p => followerUsernames.includes(p.username))
  }

  const getFollowingList = (username: string): Profile[] => {
    const followingUsernames = follows.filter(f => f.followerId === username).map(f => f.followingId)
    return profiles.filter(p => followingUsernames.includes(p.username))
  }

  // Board CRUD operations
  const addBoard = (boardData: Omit<Board, 'id'>) => {
    const now = new Date().toISOString()
    const nextBoard: Board = {
      ...boardData,
      id: uid(),
      privacy: boardData.privacy || 'private',
      ownerId: profile.username,
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
      ownerId: profile.username,
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

  // Place CRUD operations
  const addPlace = (placeData: Omit<Place, 'id'>) => {
    const now = new Date().toISOString()
    const newPlace: Place = {
      ...placeData,
      id: uid(),
      ownerId: profile.username,
      createdAt: now,
      updatedAt: now,
    }
    setPlaces(prev => [newPlace, ...prev])
    setSheet(null)
    setToast('Place created in your archive 📍')
  }

  const updatePlaceDetails = (placeId: string, updates: Partial<Place>) => {
    const now = new Date().toISOString()
    setPlaces(prev =>
      prev.map(p => (p.id === placeId ? { ...p, ...updates, updatedAt: now } : p))
    )
    if (selectedPlace && selectedPlace.id === placeId) {
      setSelectedPlace(prev => (prev ? { ...prev, ...updates, updatedAt: now } : null))
    }
    setEditingPlace(null)
    setSheet(null)
    setToast('Place updated ✦')
  }

  const requestDeletePlace = (place: Place) => {
    const containedMemories = memories.filter(m => m.placeId === place.id).length
    const containedNotes = notes.filter(n => n.placeId === place.id).length
    setConfirmDialog({
      type: 'place',
      id: place.id,
      title: `Delete place "${place.name}"?`,
      message: `This place has ${containedMemories} memories and ${containedNotes} notes linked to it. Deleting this place will remove the link, keeping your memories and notes safely in your Archive.`,
    })
  }

  const performDeletePlace = (placeId: string) => {
    setMemories(prev => prev.map(m => (m.placeId === placeId ? { ...m, placeId: undefined } : m)))
    setNotes(prev => prev.map(n => (n.placeId === placeId ? { ...n, placeId: undefined } : n)))
    setBoards(prev => prev.map(b => (b.placeId === placeId ? { ...b, placeId: undefined } : b)))
    setPlaces(prev => prev.filter(p => p.id !== placeId))
    if (selectedPlace?.id === placeId) {
      setSelectedPlace(null)
      setPage('home')
    }
    setConfirmDialog(null)
    setToast('Place deleted. Contents kept safely in Archive.')
  }

  // Current Era updates
  const updateEraItems = (items: EraItem[]) => {
    setEraItems(items)
    const currentEraLabels = items.map(item => (item.icon ? `${item.icon} ${item.label}` : item.label))
    const updatedProfile = {
      ...profile,
      currentEra: currentEraLabels,
      currentEraItems: items,
    }
    setProfile(updatedProfile)
    setProfiles(prev => prev.map(p => (p.username === profile.username ? updatedProfile : p)))
    setSheet(null)
    setToast('Current Era updated ✦')
  }

  const addNote = (text: string, boardId?: string) => {
    const now = new Date().toISOString()
    const nextNote: Note = {
      id: uid(),
      text,
      date: 'August 2026',
      privacy: 'private',
      boardId,
      ownerId: profile.username,
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

  const switchUserContext = (targetUsername: string) => {
    const targetProf = profiles.find(p => p.username === targetUsername)
    if (targetProf) {
      setProfile(targetProf)
      setToast(`Switched user context to @${targetProf.username}`)
    }
  }

  return (
    <div className="universe-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <main className="app-frame">
        {page === 'home' && (
          <HomePage
            profile={profile}
            boards={boards.filter(b => (b.ownerId || profile.username) === profile.username)}
            memories={memories.filter(m => (m.ownerId || profile.username) === profile.username)}
            notes={notes.filter(n => (n.ownerId || profile.username) === profile.username)}
            shuffledMemory={shuffledMemory}
            onShuffle={handleShuffle}
            onBoard={openBoard}
            onMemory={openMemory}
            onCreate={() => setSheet('menu')}
            onOpenArchive={() => setPage('archive')}
            onOpenSaved={() => setPage('saved')}
            onOpenTimeline={() => setPage('timeline')}
            isSaved={isSaved}
            onToggleSave={toggleSave}
          />
        )}

        {page === 'search' && (
          <SearchPage
            currentUsername={profile.username}
            profiles={profiles}
            boards={boards}
            memories={memories}
            notes={notes}
            places={places}
            moods={moods}
            follows={follows}
            onBoard={openBoard}
            onMemory={openMemory}
            onPlace={openPlace}
            onUser={openPublicProfile}
            isSaved={isSaved}
            onToggleSave={toggleSave}
            isFollowing={isFollowing}
            onToggleFollow={toggleFollow}
          />
        )}

        {page === 'inbox' && <InboxPage />}

        {page === 'profile' && (
          <ProfilePage
            profile={profile}
            allProfiles={profiles}
            boards={boards.filter(b => (b.ownerId || profile.username) === profile.username)}
            memories={memories.filter(m => (m.ownerId || profile.username) === profile.username)}
            notes={notes.filter(n => (n.ownerId || profile.username) === profile.username)}
            places={places.filter(p => (p.ownerId || profile.username) === profile.username)}
            eraItems={eraItems}
            followersCount={getFollowersCount(profile.username)}
            followingCount={getFollowingCount(profile.username)}
            onShowFollowers={() => setUserListModal({ title: 'Followers', users: getFollowersList(profile.username) })}
            onShowFollowing={() => setUserListModal({ title: 'Following', users: getFollowingList(profile.username) })}
            onBoard={openBoard}
            onMemory={openMemory}
            onEditProfile={() => setSheet('profile')}
            onEditEra={() => setSheet('current-era')}
            onOpenArchive={() => setPage('archive')}
            onOpenSaved={() => setPage('saved')}
            onOpenTimeline={() => setPage('timeline')}
            onSwitchUser={switchUserContext}
            isSaved={isSaved}
            onToggleSave={toggleSave}
          />
        )}

        {page === 'public-profile' && selectedUsername && (
          <PublicProfilePage
            username={selectedUsername}
            profile={profiles.find(p => p.username === selectedUsername) || {
              username: selectedUsername,
              displayName: selectedUsername,
              bio: 'Visual Memory Creator ✦',
              avatar: images.japan,
              cover: images.tokyo,
              location: 'Worldwide',
              currentEra: [],
            }}
            currentUsername={profile.username}
            boards={boards.filter(b => b.ownerId === selectedUsername && b.privacy === 'public')}
            memories={memories.filter(m => m.ownerId === selectedUsername && m.privacy === 'public')}
            followersCount={getFollowersCount(selectedUsername)}
            followingCount={getFollowingCount(selectedUsername)}
            isFollowing={isFollowing(selectedUsername)}
            onToggleFollow={e => toggleFollow(selectedUsername, e)}
            onShowFollowers={() => setUserListModal({ title: 'Followers', users: getFollowersList(selectedUsername) })}
            onShowFollowing={() => setUserListModal({ title: 'Following', users: getFollowingList(selectedUsername) })}
            onBoard={openBoard}
            onMemory={openMemory}
            onBack={() => setPage('search')}
            isSaved={isSaved}
            onToggleSave={toggleSave}
          />
        )}

        {page === 'archive' && (
          <ArchivePage
            currentUsername={profile.username}
            boards={boards.filter(b => (b.ownerId || profile.username) === profile.username)}
            memories={memories.filter(m => (m.ownerId || profile.username) === profile.username)}
            notes={notes.filter(n => (n.ownerId || profile.username) === profile.username)}
            places={places.filter(p => (p.ownerId || profile.username) === profile.username)}
            onBoard={openBoard}
            onMemory={openMemory}
            onPlace={openPlace}
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
            currentUsername={profile.username}
            savedItems={savedItems.filter(s => s.userId === profile.username)}
            boards={boards}
            memories={memories}
            profiles={profiles}
            onBoard={openBoard}
            onMemory={openMemory}
            onUser={openPublicProfile}
            onBack={() => setPage('home')}
            isSaved={isSaved}
            onToggleSave={toggleSave}
          />
        )}

        {page === 'timeline' && (
          <TimelinePage
            memories={memories.filter(m => (m.ownerId || profile.username) === profile.username)}
            notes={notes.filter(n => (n.ownerId || profile.username) === profile.username)}
            boards={boards.filter(b => (b.ownerId || profile.username) === profile.username)}
            places={places.filter(p => (p.ownerId || profile.username) === profile.username)}
            onMemory={openMemory}
            onBoard={openBoard}
            onPlace={openPlace}
            onBack={() => setPage('home')}
            onCreate={() => setSheet('memory')}
            isSaved={isSaved}
            onToggleSave={toggleSave}
          />
        )}

        {page === 'place' && selectedPlace && (
          <PlacePage
            place={selectedPlace}
            currentUsername={profile.username}
            memories={memories}
            notes={notes}
            boards={boards}
            onBack={() => setPage('home')}
            onMemory={openMemory}
            onBoard={openBoard}
            onEditPlace={p => {
              setEditingPlace(p)
              setSheet('edit-place')
            }}
            onDeletePlace={requestDeletePlace}
            isSaved={isSaved}
            onToggleSave={toggleSave}
          />
        )}

        {page === 'board' && selectedBoard && (
          <BoardPage
            board={selectedBoard}
            currentUsername={profile.username}
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
            onUser={openPublicProfile}
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
            currentUsername={profile.username}
            board={boards.find(b => b.id === selectedMemory.boardId)}
            place={places.find(p => p.id === selectedMemory.placeId)}
            owner={profiles.find(p => p.username === (selectedMemory.ownerId || profile.username))}
            onBack={() => setPage('home')}
            onEdit={() => {
              setEditingMemory(selectedMemory)
              setSheet('edit-memory')
            }}
            onDelete={() => requestDeleteMemory(selectedMemory)}
            onTogglePrivacy={() => toggleMemoryPrivacy(selectedMemory.id)}
            onUser={openPublicProfile}
            onNext={() => navigateMemory('next')}
            onPrev={() => navigateMemory('prev')}
            isSaved={isSaved}
            onToggleSave={toggleSave}
          />
        )}

        {/* Floating 5-Item Bottom Navigation */}
        {page !== 'board' && page !== 'memory' && page !== 'place' && page !== 'public-profile' && (
          <BottomNav
            activeTab={page === 'archive' || page === 'saved' || page === 'timeline' ? 'home' : page}
            onTabSelect={setPage}
            onCreateSelect={() => setSheet('menu')}
          />
        )}
      </main>

      {/* Creation / Edit Bottom Sheet */}
      {sheet && (
        <CreationSheet
          type={sheet}
          boards={boards.filter(b => (b.ownerId || profile.username) === profile.username)}
          places={places.filter(p => (p.ownerId || profile.username) === profile.username)}
          moods={moods}
          profile={profile}
          eraItems={eraItems}
          editingMemory={editingMemory}
          editingBoard={editingBoard}
          editingPlace={editingPlace}
          parentBoard={parentForNewChild}
          onClose={() => {
            setSheet(null)
            setEditingMemory(null)
            setEditingBoard(null)
            setEditingPlace(null)
            setParentForNewChild(null)
          }}
          onBoard={addBoard}
          onUpdateBoard={updateBoardDetails}
          onMemory={addMemory}
          onUpdateMemory={updateMemory}
          onPlace={addPlace}
          onUpdatePlace={updatePlaceDetails}
          onNote={addNote}
          onEraSave={updateEraItems}
          onProfile={p => {
            setProfile(p)
            setProfiles(prev => prev.map(prof => (prof.username === p.username ? p : prof)))
            setSheet(null)
            setToast('Profile updated')
          }}
        />
      )}

      {/* User List Modal (Followers / Following) */}
      {userListModal && (
        <UserListModal
          title={userListModal.title}
          users={userListModal.users}
          currentUsername={profile.username}
          isFollowing={isFollowing}
          onToggleFollow={toggleFollow}
          onSelectUser={u => {
            setUserListModal(null)
            openPublicProfile(u.username)
          }}
          onClose={() => setUserListModal(null)}
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
            if (confirmDialog.type === 'place') performDeletePlace(confirmDialog.id)
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
  onOpenTimeline,
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
  onOpenTimeline: () => void
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
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <button onClick={onOpenTimeline} className="text-xs text-[#c7a6ff] hover:underline flex items-center gap-1">
              <Calendar size={12} /> View Timeline
            </button>
            <span className="text-[#66636c]">·</span>
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

/* PLACE CARD COMPONENT */
function PlaceCard({
  place,
  allMemories,
  allNotes,
  allBoards,
  onClick,
}: {
  place: Place
  allMemories?: Memory[]
  allNotes?: Note[]
  allBoards?: Board[]
  onClick: () => void
}) {
  const memoryCount = allMemories ? allMemories.filter(m => m.placeId === place.id).length : 0
  const noteCount = allNotes ? allNotes.filter(n => n.placeId === place.id).length : 0

  return (
    <button className="board-card glass-card group text-left w-full" onClick={onClick}>
      <div className="board-cover relative overflow-hidden">
        {place.image ? (
          <GlassImage src={place.image} alt={place.name} />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white/30">
            <MapPin size={24} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/12 text-[#c7a6ff] flex items-center gap-1 font-medium">
            <MapPin size={10} /> PLACE
          </span>
        </div>
      </div>
      <div className="board-card-body">
        <div className="flex items-center justify-between text-[10px] text-[#8b8991] uppercase tracking-wider">
          <span>{memoryCount} memories</span>
          {noteCount > 0 && <span>{noteCount} notes</span>}
        </div>
        <strong className="group-hover:text-[#c7a6ff] transition-colors block text-white font-medium">{place.name}</strong>
        {place.location && (
          <small className="text-[#66636c] text-xs flex items-center gap-1 mt-0.5">
            <MapPin size={10} className="text-[#c7a6ff]" /> {place.location}
          </small>
        )}
      </div>
      <span className="corner-line-tl" />
    </button>
  )
}

/* USER / CREATOR PROFILE CARD COMPONENT */
function UserCard({
  profile,
  publicBoardCount,
  followersCount,
  isFollowing,
  onSelect,
  onToggleFollow,
}: {
  profile: Profile
  publicBoardCount: number
  followersCount: number
  isFollowing?: boolean
  onSelect: () => void
  onToggleFollow?: (e: React.MouseEvent) => void
}) {
  return (
    <div
      onClick={onSelect}
      className="glass-card p-4 rounded-2xl cursor-pointer hover:border-white/25 transition-all group flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <img src={profile.avatar} alt={profile.username} className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0" />
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-white group-hover:text-[#c7a6ff] transition-colors truncate flex items-center gap-1.5">
            @{profile.username}
            <span className="text-[10px] text-[#8b8991] font-normal">({profile.displayName})</span>
          </h4>
          <p className="text-xs text-[#b1afb8] truncate">{profile.bio}</p>
          <div className="flex items-center gap-3 text-[10px] text-[#8b8991] mt-1">
            <span>{publicBoardCount} collections</span>
            <span>·</span>
            <span>{followersCount} followers</span>
          </div>
        </div>
      </div>

      {onToggleFollow && (
        <button
          onClick={onToggleFollow}
          className={`btn-secondary text-xs px-3 py-1.5 flex-shrink-0 flex items-center gap-1 ${
            isFollowing ? 'bg-white/15 text-white border-white/30' : ''
          }`}
        >
          {isFollowing ? (
            <>
              <UserCheck size={12} className="text-[#c7a6ff]" /> Following
            </>
          ) : (
            <>
              <UserPlus size={12} /> Follow
            </>
          )}
        </button>
      )}
    </div>
  )
}

/* SEARCH & PUBLIC DISCOVERY PAGE */
function SearchPage({
  currentUsername,
  profiles,
  boards,
  memories,
  notes,
  places,
  moods,
  follows,
  onBoard,
  onMemory,
  onPlace,
  onUser,
  isSaved,
  onToggleSave,
  isFollowing,
  onToggleFollow,
}: {
  currentUsername: string
  profiles: Profile[]
  boards: Board[]
  memories: Memory[]
  notes: Note[]
  places: Place[]
  moods: Mood[]
  follows: Follow[]
  onBoard: (b: Board) => void
  onMemory: (m: Memory) => void
  onPlace: (p: Place) => void
  onUser: (username: string) => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
  isFollowing: (username: string) => boolean
  onToggleFollow: (username: string, e?: React.MouseEvent) => void
}) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('ALL')
  const [isFocused, setIsFocused] = useState(false)

  const filterOptions = ['ALL', 'BOARDS', 'MEMORIES', 'USERS', 'PLACES', 'TAGS']

  // Public discovery query filter (Excludes private content!)
  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim()

    // Boards must be public
    const matchingBoards = boards.filter(
      b =>
        b.privacy === 'public' &&
        (activeFilter === 'ALL' || activeFilter === 'BOARDS') &&
        (!q ||
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.location?.toLowerCase().includes(q))
    )

    // Memories must be public
    const matchingMemories = memories.filter(
      m =>
        m.privacy === 'public' &&
        (activeFilter === 'ALL' || activeFilter === 'MEMORIES' || activeFilter === 'PLACES' || activeFilter === 'TAGS') &&
        (!q ||
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.location?.toLowerCase().includes(q) ||
          m.mood?.toLowerCase().includes(q) ||
          m.tags.some(t => t.toLowerCase().includes(q)))
    )

    // Places must have public memories or boards
    const matchingPlaces = places.filter(p => {
      const hasPublicContent = memories.some(m => m.placeId === p.id && m.privacy === 'public') || boards.some(b => b.placeId === p.id && b.privacy === 'public')
      return (
        hasPublicContent &&
        (activeFilter === 'ALL' || activeFilter === 'PLACES') &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q))
      )
    })

    // Users / Creators
    const matchingUsers = profiles.filter(
      p =>
        (activeFilter === 'ALL' || activeFilter === 'USERS') &&
        (!q || p.username.toLowerCase().includes(q) || p.displayName.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q))
    )

    return { boards: matchingBoards, memories: matchingMemories, places: matchingPlaces, users: matchingUsers }
  }, [query, activeFilter, boards, memories, places, profiles])

  const totalResultsCount =
    filteredResults.boards.length + filteredResults.memories.length + filteredResults.places.length + filteredResults.users.length

  return (
    <section className="screen space-y-6">
      {/* Editorial Search Hero Header */}
      <div className="pt-2">
        <span className="eyebrow flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c7a6ff]" /> PUBLIC DISCOVERY
        </span>
        <h1 className="title-large">
          Discover other <span className="font-normal text-[#c7a6ff]">worlds.</span>
        </h1>
        <p className="lede mt-2 mb-0">Explore public collections, creators, places, and shared memories.</p>
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
            placeholder="Search public collections, creators, feelings..."
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

      {/* "Search By Feeling / Mood" */}
      {!query && (
        <div>
          <span className="eyebrow block mb-3 text-[10px]">DISCOVER BY FEELING & MOOD</span>
          <div className="flex flex-wrap gap-2">
            {moods.map(m => (
              <button
                key={m.id}
                onClick={() => setQuery(m.name)}
                className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-[#b1afb8] hover:border-white/25 hover:text-white transition-all flex items-center gap-2"
              >
                <span>{m.icon}</span>
                <span>{m.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Featured Creators Section when not querying */}
      {!query && activeFilter === 'ALL' && (
        <div>
          <div className="section-header">
            <h2>DISCOVER CREATORS</h2>
          </div>
          <div className="space-y-3">
            {profiles.map(p => (
              <UserCard
                key={p.username}
                profile={p}
                publicBoardCount={boards.filter(b => b.ownerId === p.username && b.privacy === 'public').length}
                followersCount={follows.filter(f => f.followingId === p.username).length}
                isFollowing={isFollowing(p.username)}
                onSelect={() => onUser(p.username)}
                onToggleFollow={p.username !== currentUsername ? e => onToggleFollow(p.username, e) : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      {query && (
        <div className="flex items-center justify-between text-xs text-[#8b8991]">
          <span>PUBLIC RESULTS FOR "{query}"</span>
          <span>{totalResultsCount} items found</span>
        </div>
      )}

      {/* Creator / User Results */}
      {filteredResults.users.length > 0 && (query || activeFilter === 'USERS') && (
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Creators</h3>
            <span className="text-[10px] text-[#66636c]">{filteredResults.users.length} results</span>
          </div>
          <div className="space-y-3">
            {filteredResults.users.map(u => (
              <UserCard
                key={u.username}
                profile={u}
                publicBoardCount={boards.filter(b => b.ownerId === u.username && b.privacy === 'public').length}
                followersCount={follows.filter(f => f.followingId === u.username).length}
                isFollowing={isFollowing(u.username)}
                onSelect={() => onUser(u.username)}
                onToggleFollow={u.username !== currentUsername ? e => onToggleFollow(u.username, e) : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Place Results */}
      {filteredResults.places.length > 0 && (
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Public Places</h3>
            <span className="text-[10px] text-[#66636c]">{filteredResults.places.length} results</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.places.map(p => (
              <PlaceCard
                key={p.id}
                place={p}
                allMemories={memories.filter(m => m.privacy === 'public')}
                allNotes={notes.filter(n => n.privacy === 'public')}
                allBoards={boards.filter(b => b.privacy === 'public')}
                onClick={() => onPlace(p)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Board Results */}
      {filteredResults.boards.length > 0 && (
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Public Collections</h3>
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
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Public Memories</h3>
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
      {totalResultsCount === 0 && (
        <div className="py-20 text-center glass-card border border-white/10 rounded-3xl p-8">
          <Compass size={32} className="mx-auto mb-3 text-[#8b8991]" />
          <h3 className="text-sm font-medium text-white mb-1">NO PUBLIC CONTENT FOUND</h3>
          <p className="text-xs text-[#b1afb8] mb-6">Try searching for another memory, creator, or place.</p>
        </div>
      )}
    </section>
  )
}

/* INBOX PAGE */
function InboxPage() {
  const notifications = [
    { id: 1, text: 'Someone saved your public collection "Japan — someday"', time: '2h ago', icon: <Heart size={16} /> },
    { id: 2, text: 'A new voyager started following your visual universe', time: 'Yesterday', icon: <CircleUserRound size={16} /> },
    { id: 3, text: 'Your story "Rainy Evening" was featured in Kyoto discovery', time: '3d ago', icon: <BookOpen size={16} /> },
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

/* OWNER PROFILE PAGE */
function ProfilePage({
  profile,
  allProfiles,
  boards,
  memories,
  notes,
  places,
  eraItems,
  followersCount,
  followingCount,
  onShowFollowers,
  onShowFollowing,
  onBoard,
  onMemory,
  onEditProfile,
  onEditEra,
  onOpenArchive,
  onOpenSaved,
  onOpenTimeline,
  onSwitchUser,
  isSaved,
  onToggleSave,
}: {
  profile: Profile
  allProfiles: Profile[]
  boards: Board[]
  memories: Memory[]
  notes: Note[]
  places: Place[]
  eraItems?: EraItem[]
  followersCount: number
  followingCount: number
  onShowFollowers: () => void
  onShowFollowing: () => void
  onBoard: (b: Board) => void
  onMemory: (m: Memory) => void
  onEditProfile: () => void
  onEditEra: () => void
  onOpenArchive: () => void
  onOpenSaved: () => void
  onOpenTimeline: () => void
  onSwitchUser: (username: string) => void
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

      {/* User Info & Prototype User Context Switcher */}
      <div className="pt-4 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl sm:text-3xl font-normal text-white flex items-center gap-3">
            @{profile.username}
            <span className="text-xs font-normal text-white border border-white/20 px-2.5 py-0.5 rounded-full bg-white/5">
              {profile.displayName || 'Creator'}
            </span>
          </h1>

          {/* Prototype Context Switcher */}
          <div className="flex items-center gap-2 text-xs text-[#8b8991] bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <span>Active User:</span>
            <select
              value={profile.username}
              onChange={e => onSwitchUser(e.target.value)}
              className="bg-transparent text-white border-none outline-none text-xs font-medium cursor-pointer"
            >
              {allProfiles.map(p => (
                <option key={p.username} value={p.username} className="bg-black text-white">
                  @{p.username} ({p.displayName})
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#b1afb8]">{profile.bio}</p>

        {/* Dynamic Followers / Following Counts */}
        <div className="flex items-center gap-5 text-xs text-white pt-1">
          <button onClick={onShowFollowers} className="hover:text-[#c7a6ff] transition-colors flex items-center gap-1.5">
            <strong className="font-medium text-white">{followersCount}</strong>
            <span className="text-[#8b8991]">followers</span>
          </button>
          <span className="text-[#66636c]">·</span>
          <button onClick={onShowFollowing} className="hover:text-[#c7a6ff] transition-colors flex items-center gap-1.5">
            <strong className="font-medium text-white">{followingCount}</strong>
            <span className="text-[#8b8991]">following</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-[#b1afb8] pt-2 flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-[#c7a6ff]" /> {profile.location}
          </span>
          <button onClick={onOpenTimeline} className="text-[#c7a6ff] hover:underline flex items-center gap-1">
            <Calendar size={12} /> Timeline
          </button>
          <button onClick={onOpenArchive} className="text-[#c7a6ff] hover:underline flex items-center gap-1">
            <Archive size={12} /> Archive
          </button>
          <button onClick={onOpenSaved} className="text-[#c7a6ff] hover:underline flex items-center gap-1">
            <Bookmark size={12} /> Saved
          </button>
        </div>
      </div>

      {/* Dynamic Stats Counter */}
      <div className="grid grid-cols-4 gap-3 p-4 rounded-2xl glass-card text-center">
        <div>
          <strong className="text-lg text-white block font-normal">{memories.length}</strong>
          <span className="text-[9px] sm:text-[10px] text-[#66636c] uppercase tracking-wider">Memories</span>
        </div>
        <div>
          <strong className="text-lg text-white block font-normal">{boards.length}</strong>
          <span className="text-[9px] sm:text-[10px] text-[#66636c] uppercase tracking-wider">Collections</span>
        </div>
        <div>
          <strong className="text-lg text-white block font-normal">{notes.length}</strong>
          <span className="text-[9px] sm:text-[10px] text-[#66636c] uppercase tracking-wider">Notes</span>
        </div>
        <div>
          <strong className="text-lg text-white block font-normal">{places.length}</strong>
          <span className="text-[9px] sm:text-[10px] text-[#66636c] uppercase tracking-wider">Places</span>
        </div>
      </div>

      {/* CURRENT ERA Section */}
      <div className="era-card glass-card">
        <div className="flex items-center justify-between mb-3">
          <span className="eyebrow flex items-center gap-2 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c7a6ff]" /> CURRENT ERA
          </span>
          <button onClick={onEditEra} className="text-xs text-[#c7a6ff] hover:underline flex items-center gap-1">
            <Pencil size={11} /> Edit Era
          </button>
        </div>
        {eraItems && eraItems.length > 0 ? (
          <div className="era-tags">
            {eraItems.slice().sort((a, b) => a.order - b.order).map(item => (
              <span key={item.id} className="era-tag flex items-center gap-1">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        ) : profile.currentEra && profile.currentEra.length > 0 ? (
          <div className="era-tags">
            {profile.currentEra.map((item, idx) => (
              <span key={idx} className="era-tag">
                {item}
              </span>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-[#b1afb8] border border-dashed border-white/10 rounded-2xl">
            "What's your world feeling like lately?"
            <button onClick={onEditEra} className="block mx-auto mt-2 btn-secondary text-xs px-3 py-1">
              + Add something
            </button>
          </div>
        )}
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

/* PUBLIC VISITOR PROFILE PAGE */
function PublicProfilePage({
  username,
  profile,
  currentUsername,
  boards,
  memories,
  followersCount,
  followingCount,
  isFollowing,
  onToggleFollow,
  onShowFollowers,
  onShowFollowing,
  onBoard,
  onMemory,
  onBack,
  isSaved,
  onToggleSave,
}: {
  username: string
  profile: Profile
  currentUsername: string
  boards: Board[]
  memories: Memory[]
  followersCount: number
  followingCount: number
  isFollowing: boolean
  onToggleFollow: (e: React.MouseEvent) => void
  onShowFollowers: () => void
  onShowFollowing: () => void
  onBoard: (b: Board) => void
  onMemory: (m: Memory) => void
  onBack: () => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
}) {
  return (
    <section className="screen space-y-8">
      {/* Back button */}
      <div className="pt-2">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-[#8b8991] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Discovery
        </button>
      </div>

      {/* Cover & Avatar Header */}
      <div className="relative h-48 sm:h-56 rounded-3xl overflow-hidden border border-white/10 glass-card">
        <img src={profile.cover} alt="Profile Cover" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={onToggleFollow}
            className={`btn-secondary text-xs px-4 py-1.5 backdrop-blur-md flex items-center gap-1.5 ${
              isFollowing ? 'bg-white/20 text-white border-white/40' : 'btn-primary'
            }`}
          >
            {isFollowing ? (
              <>
                <UserCheck size={14} className="text-[#c7a6ff]" /> Following
              </>
            ) : (
              <>
                <UserPlus size={14} /> Follow Creator
              </>
            )}
          </button>
        </div>
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
          <span className="text-xs font-normal text-[#c7a6ff] border border-[#c7a6ff]/30 px-2.5 py-0.5 rounded-full bg-[#c7a6ff]/10">
            {profile.displayName}
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-[#b1afb8]">{profile.bio}</p>

        {/* Followers / Following Counts */}
        <div className="flex items-center gap-5 text-xs text-white pt-1">
          <button onClick={onShowFollowers} className="hover:text-[#c7a6ff] transition-colors flex items-center gap-1.5">
            <strong className="font-medium text-white">{followersCount}</strong>
            <span className="text-[#8b8991]">followers</span>
          </button>
          <span className="text-[#66636c]">·</span>
          <button onClick={onShowFollowing} className="hover:text-[#c7a6ff] transition-colors flex items-center gap-1.5">
            <strong className="font-medium text-white">{followingCount}</strong>
            <span className="text-[#8b8991]">following</span>
          </button>
        </div>

        {profile.location && (
          <div className="text-xs text-[#b1afb8] pt-1">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-[#c7a6ff]" /> {profile.location}
            </span>
          </div>
        )}
      </div>

      {/* Dynamic Public Stats Counter */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl glass-card text-center">
        <div>
          <strong className="text-lg text-white block font-normal">{memories.length}</strong>
          <span className="text-[10px] text-[#66636c] uppercase tracking-wider">Public Memories</span>
        </div>
        <div>
          <strong className="text-lg text-white block font-normal">{boards.length}</strong>
          <span className="text-[10px] text-[#66636c] uppercase tracking-wider">Public Collections</span>
        </div>
      </div>

      {/* CURRENT ERA Section */}
      {profile.currentEra && profile.currentEra.length > 0 && (
        <div className="era-card glass-card">
          <span className="eyebrow flex items-center gap-2 text-[10px] mb-3">
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
      )}

      {/* Public Collections */}
      <div>
        <div className="section-header">
          <h2>PUBLIC COLLECTIONS ({boards.length})</h2>
        </div>
        {boards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {boards.map(board => (
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
        ) : (
          <p className="text-xs text-[#8b8991]">No public collections shared yet.</p>
        )}
      </div>

      {/* Public Memories */}
      <div>
        <div className="section-header">
          <h2>PUBLIC MEMORIES ({memories.length})</h2>
        </div>
        {memories.length > 0 ? (
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
        ) : (
          <p className="text-xs text-[#8b8991]">No public memories shared yet.</p>
        )}
      </div>
    </section>
  )
}

/* USER LIST MODAL (FOLLOWERS / FOLLOWING) */
function UserListModal({
  title,
  users,
  currentUsername,
  isFollowing,
  onToggleFollow,
  onSelectUser,
  onClose,
}: {
  title: string
  users: Profile[]
  currentUsername: string
  isFollowing: (u: string) => boolean
  onToggleFollow: (u: string, e?: React.MouseEvent) => void
  onSelectUser: (u: Profile) => void
  onClose: () => void
}) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="glass-card p-6 max-w-md w-full mx-4 rounded-3xl space-y-4 animate-fadeIn border border-white/15 shadow-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Users size={16} className="text-[#c7a6ff]" /> {title} ({users.length})
          </h3>
          <button onClick={onClose} className="text-[#8b8991] hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {users.length > 0 ? (
            users.map(u => (
              <div
                key={u.username}
                onClick={() => onSelectUser(u)}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/25 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={u.avatar} alt={u.username} className="w-10 h-10 rounded-xl object-cover border border-white/10 flex-shrink-0" />
                  <div className="min-w-0">
                    <strong className="text-xs font-medium text-white block truncate">@{u.username}</strong>
                    <span className="text-[11px] text-[#b1afb8] block truncate">{u.bio}</span>
                  </div>
                </div>

                {u.username !== currentUsername && (
                  <button
                    onClick={e => onToggleFollow(u.username, e)}
                    className={`btn-secondary text-[11px] px-2.5 py-1 flex-shrink-0 flex items-center gap-1 ${
                      isFollowing(u.username) ? 'bg-white/15 text-white' : ''
                    }`}
                  >
                    {isFollowing(u.username) ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-[#8b8991]">No creators in this list.</div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ARCHIVE PAGE — COMPLETE CONTENT HISTORY */
function ArchivePage({
  currentUsername,
  boards,
  memories,
  notes,
  places,
  onBoard,
  onMemory,
  onPlace,
  onBack,
  isSaved,
  onToggleSave,
  onEditMemory,
  onDeleteMemory,
  onToggleMemoryPrivacy,
}: {
  currentUsername: string
  boards: Board[]
  memories: Memory[]
  notes: Note[]
  places: Place[]
  onBoard: (b: Board) => void
  onMemory: (m: Memory) => void
  onPlace: (p: Place) => void
  onBack: () => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
  onEditMemory: (m: Memory) => void
  onDeleteMemory: (m: Memory) => void
  onToggleMemoryPrivacy: (id: string) => void
}) {
  const [filter, setFilter] = useState<'ALL' | 'PHOTOS' | 'BOARDS' | 'PLACES' | 'NOTES' | 'PUBLIC' | 'PRIVATE'>('ALL')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  const items = useMemo(() => {
    let list: Array<{ type: 'memory' | 'board' | 'note' | 'place'; date: string; data: any }> = []

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

    if (filter === 'ALL' || filter === 'PLACES') {
      places.forEach(p => {
        list.push({ type: 'place', date: p.createdAt || '2026-08-01', data: p })
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
  }, [memories, boards, notes, places, filter, sortOrder])

  return (
    <section className="screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-[#8b8991] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to My Universe
        </button>
        <button
          onClick={() => setSortOrder(prev => (prev === 'newest' ? 'oldest' : 'newest'))}
          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          <SlidersHorizontal size={12} />
          {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      <div>
        <span className="eyebrow block mb-2 text-[10px]">PERSONAL HISTORY</span>
        <h1 className="title-large">Full Archive</h1>
        <p className="lede mt-1 mb-0">Every moment, collection, place, and note you have saved.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
        {(['ALL', 'PHOTOS', 'BOARDS', 'PLACES', 'NOTES', 'PUBLIC', 'PRIVATE'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs transition-all border ${
              filter === tab ? 'bg-white/10 border-white text-white font-medium' : 'bg-white/[0.03] border-white/10 text-[#8b8991] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => {
            if (item.type === 'memory') {
              return (
                <MemoryCard
                  key={item.data.id}
                  memory={item.data}
                  onClick={() => onMemory(item.data)}
                  isSaved={isSaved('moment', item.data.id)}
                  onToggleSave={e => onToggleSave('moment', item.data.id, e)}
                />
              )
            }
            if (item.type === 'board') {
              return (
                <BoardCard
                  key={item.data.id}
                  board={item.data}
                  allBoards={boards}
                  allMemories={memories}
                  onClick={() => onBoard(item.data)}
                  isSaved={isSaved('board', item.data.id)}
                  onToggleSave={e => onToggleSave('board', item.data.id, e)}
                />
              )
            }
            if (item.type === 'place') {
              return (
                <PlaceCard
                  key={item.data.id}
                  place={item.data}
                  allMemories={memories}
                  allNotes={notes}
                  allBoards={boards}
                  onClick={() => onPlace(item.data)}
                />
              )
            }
            return (
              <div key={item.data.id} className="note-card glass-card">
                <span className="text-[#c7a6ff] text-xs font-semibold block mb-1">✦ Personal Note</span>
                <p>"{item.data.text}"</p>
                <span>{item.data.date}</span>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center glass-card border border-white/10 rounded-3xl p-8">
          <Archive size={32} className="mx-auto mb-3 text-[#8b8991]" />
          <h3 className="text-sm font-medium text-white mb-1">YOUR ARCHIVE IS EMPTY</h3>
          <p className="text-xs text-[#b1afb8]">Create your first moment or collection to start filling your archive.</p>
        </div>
      )}
    </section>
  )
}

/* TIMELINE PAGE — CHRONOLOGICAL HISTORY VIEW */
function TimelinePage({
  memories,
  notes,
  boards,
  places,
  onMemory,
  onBoard,
  onPlace,
  onBack,
  onCreate,
  isSaved,
  onToggleSave,
}: {
  memories: Memory[]
  notes: Note[]
  boards: Board[]
  places: Place[]
  onMemory: (m: Memory) => void
  onBoard: (b: Board) => void
  onPlace: (p: Place) => void
  onBack: () => void
  onCreate: () => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
}) {
  const [filter, setFilter] = useState<'ALL' | 'MOMENTS' | 'NOTES' | 'BOARDS' | 'PLACES'>('ALL')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  const groupedTimeline = useMemo(() => {
    type TimelineItem = {
      id: string
      type: 'moment' | 'note' | 'board' | 'place'
      title: string
      date: string
      rawDate: string
      data: any
    }

    let items: TimelineItem[] = []

    if (filter === 'ALL' || filter === 'MOMENTS') {
      memories.forEach(m => {
        items.push({
          id: m.id,
          type: 'moment',
          title: m.title,
          date: m.date || 'August 2026',
          rawDate: m.createdAt || m.date || '2026-08-01',
          data: m,
        })
      })
    }

    if (filter === 'ALL' || filter === 'NOTES') {
      notes.forEach(n => {
        items.push({
          id: n.id,
          type: 'note',
          title: n.text.slice(0, 40) + '...',
          date: n.date || 'August 2026',
          rawDate: n.createdAt || n.date || '2026-08-01',
          data: n,
        })
      })
    }

    if (filter === 'ALL' || filter === 'BOARDS') {
      boards.forEach(b => {
        items.push({
          id: b.id,
          type: 'board',
          title: b.name,
          date: b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'August 2026',
          rawDate: b.createdAt || '2026-08-01',
          data: b,
        })
      })
    }

    if (filter === 'ALL' || filter === 'PLACES') {
      places.forEach(p => {
        items.push({
          id: p.id,
          type: 'place',
          title: p.name,
          date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'August 2026',
          rawDate: p.createdAt || '2026-08-01',
          data: p,
        })
      })
    }

    items.sort((a, b) => {
      const tA = new Date(a.rawDate).getTime() || 0
      const tB = new Date(b.rawDate).getTime() || 0
      return sortOrder === 'newest' ? tB - tA : tA - tB
    })

    const groups: { [key: string]: TimelineItem[] } = {}
    items.forEach(item => {
      const groupKey = item.date.toUpperCase()
      if (!groups[groupKey]) groups[groupKey] = []
      groups[groupKey].push(item)
    })

    return Object.entries(groups).map(([group, groupItems]) => ({
      group,
      items: groupItems,
    }))
  }, [memories, notes, boards, places, filter, sortOrder])

  return (
    <section className="screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-[#8b8991] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to My Universe
        </button>
        <button
          onClick={() => setSortOrder(prev => (prev === 'newest' ? 'oldest' : 'newest'))}
          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
        >
          <SlidersHorizontal size={12} />
          {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      <div>
        <span className="eyebrow block mb-2 text-[10px]">CHRONOLOGICAL HISTORY</span>
        <h1 className="title-large">Your Timeline</h1>
        <p className="lede mt-1 mb-0">What was happening in your life across moments, places and notes.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
        {(['ALL', 'MOMENTS', 'NOTES', 'BOARDS', 'PLACES'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs transition-all border ${
              filter === tab ? 'bg-white/10 border-white text-white font-medium' : 'bg-white/[0.03] border-white/10 text-[#8b8991] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Timeline Groups */}
      {groupedTimeline.length > 0 ? (
        <div className="space-y-10 relative pt-2">
          <div className="absolute top-4 bottom-4 left-4 sm:left-6 w-px bg-white/10 pointer-events-none" />

          {groupedTimeline.map(({ group, items }) => (
            <div key={group} className="space-y-4 relative z-10">
              <div className="flex items-center gap-3 pl-2">
                <span className="w-3 h-3 rounded-full bg-[#c7a6ff] border-2 border-black flex-shrink-0" />
                <h2 className="text-sm font-semibold text-white tracking-widest uppercase">{group}</h2>
              </div>

              <div className="pl-8 sm:pl-12 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(item => {
                    if (item.type === 'moment') {
                      return (
                        <MemoryCard
                          key={item.id}
                          memory={item.data}
                          onClick={() => onMemory(item.data)}
                          isSaved={isSaved('moment', item.id)}
                          onToggleSave={e => onToggleSave('moment', item.id, e)}
                        />
                      )
                    }
                    if (item.type === 'board') {
                      return (
                        <BoardCard
                          key={item.id}
                          board={item.data}
                          allBoards={boards}
                          allMemories={memories}
                          onClick={() => onBoard(item.data)}
                          isSaved={isSaved('board', item.id)}
                          onToggleSave={e => onToggleSave('board', item.id, e)}
                        />
                      )
                    }
                    if (item.type === 'place') {
                      return (
                        <PlaceCard
                          key={item.id}
                          place={item.data}
                          allMemories={memories}
                          allNotes={notes}
                          allBoards={boards}
                          onClick={() => onPlace(item.data)}
                        />
                      )
                    }
                    return (
                      <div key={item.id} className="note-card glass-card">
                        <span className="text-[#c7a6ff] text-xs font-semibold block mb-1">✦ Personal Note</span>
                        <p>"{item.data.text}"</p>
                        <span>{item.data.date}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center glass-card border border-white/10 rounded-3xl p-8 space-y-4">
          <Calendar size={32} className="mx-auto text-[#8b8991]" />
          <div>
            <h3 className="text-base font-normal text-white">YOUR TIMELINE IS QUIET</h3>
            <p className="text-xs text-[#b1afb8] mt-1 max-w-sm mx-auto">
              Create a moment and your story will begin to take shape.
            </p>
          </div>
          <button onClick={onCreate} className="btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-2">
            <Plus size={14} /> Add Moment
          </button>
        </div>
      )}
    </section>
  )
}

/* PLACE PAGE — PLACE DETAIL VIEW */
function PlacePage({
  place,
  currentUsername,
  memories,
  notes,
  boards,
  onBack,
  onMemory,
  onBoard,
  onEditPlace,
  onDeletePlace,
  isSaved,
  onToggleSave,
}: {
  place: Place
  currentUsername: string
  memories: Memory[]
  notes: Note[]
  boards: Board[]
  onBack: () => void
  onMemory: (m: Memory) => void
  onBoard: (b: Board) => void
  onEditPlace: (p: Place) => void
  onDeletePlace: (p: Place) => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
}) {
  const isOwner = (place.ownerId || currentUsername) === currentUsername

  // Public/Owner visibility rule for memories & boards at this place
  const linkedMemories = memories.filter(m => m.placeId === place.id && (isOwner || m.privacy === 'public'))
  const linkedNotes = notes.filter(n => n.placeId === place.id && (isOwner || n.privacy === 'public'))
  const linkedBoards = boards.filter(b => b.placeId === place.id && (isOwner || b.privacy === 'public'))

  return (
    <section className="screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-[#8b8991] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to My Universe
        </button>
        {isOwner && (
          <div className="flex items-center gap-2">
            <button onClick={() => onEditPlace(place)} className="btn-secondary text-xs px-3 py-1.5">
              <Pencil size={12} /> Edit Place
            </button>
            <button
              onClick={() => onDeletePlace(place)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-rose-400 hover:bg-rose-950/40 transition-all"
              title="Delete Place"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Hero Banner */}
      <div className="relative h-52 sm:h-64 rounded-3xl overflow-hidden glass-card border border-white/12">
        {place.image ? (
          <GlassImage src={place.image} alt={place.name} />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white/20">
            <MapPin size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 space-y-1 z-10">
          <span className="eyebrow flex items-center gap-1.5 text-[10px] text-[#c7a6ff]">
            <MapPin size={11} /> PLACE MEMORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-normal text-white">{place.name}</h1>
          <p className="text-xs text-[#b1afb8] flex items-center gap-1 pt-0.5">
            <MapPin size={12} className="text-[#c7a6ff]" /> {place.location}
          </p>
          {place.description && <p className="text-xs text-[#8b8991] max-w-xl pt-1">{place.description}</p>}
        </div>
        <span className="corner-line-tl" />
      </div>

      {/* Dynamic Stats Counter */}
      <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl glass-card text-center">
        <div>
          <strong className="text-lg text-white block font-normal">{linkedMemories.length}</strong>
          <span className="text-[10px] text-[#66636c] uppercase tracking-wider">Memories</span>
        </div>
        <div>
          <strong className="text-lg text-white block font-normal">{linkedNotes.length}</strong>
          <span className="text-[10px] text-[#66636c] uppercase tracking-wider">Notes</span>
        </div>
        <div>
          <strong className="text-lg text-white block font-normal">{linkedBoards.length}</strong>
          <span className="text-[10px] text-[#66636c] uppercase tracking-wider">Collections</span>
        </div>
      </div>

      {/* Linked Memories */}
      {linkedMemories.length > 0 && (
        <div>
          <div className="section-header">
            <h2>MEMORIES AT THIS PLACE</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {linkedMemories.map(m => (
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

      {/* Linked Boards */}
      {linkedBoards.length > 0 && (
        <div>
          <div className="section-header">
            <h2>COLLECTIONS AT THIS PLACE</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {linkedBoards.map(b => (
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

      {/* Linked Notes */}
      {linkedNotes.length > 0 && (
        <div>
          <div className="section-header">
            <h2>NOTES AT THIS PLACE</h2>
          </div>
          <div className="space-y-3">
            {linkedNotes.map(n => (
              <div key={n.id} className="note-card glass-card">
                <span className="text-[#c7a6ff] text-xs font-semibold block mb-1">✦</span>
                <p>"{n.text}"</p>
                <span>{n.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {linkedMemories.length === 0 && linkedNotes.length === 0 && linkedBoards.length === 0 && (
        <div className="py-16 text-center glass-card border border-white/10 rounded-3xl p-8">
          <MapPin size={32} className="mx-auto mb-3 text-[#8b8991]" />
          <h3 className="text-sm font-medium text-white mb-1">NO MEMORIES LINKED YET</h3>
          <p className="text-xs text-[#b1afb8]">Assign moments or notes to this place to see them here.</p>
        </div>
      )}
    </section>
  )
}

/* SAVED / FAVORITES PAGE WITH PUBLIC SAVES SUPPORT */
function SavedPage({
  currentUsername,
  savedItems,
  boards,
  memories,
  profiles,
  onBoard,
  onMemory,
  onUser,
  onBack,
  isSaved,
  onToggleSave,
}: {
  currentUsername: string
  savedItems: SavedItem[]
  boards: Board[]
  memories: Memory[]
  profiles: Profile[]
  onBoard: (b: Board) => void
  onMemory: (m: Memory) => void
  onUser: (u: string) => void
  onBack: () => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
}) {
  const [filter, setFilter] = useState<'ALL' | 'BOARDS' | 'MOMENTS'>('ALL')

  // Exclude private/deleted saved items from other users!
  const savedBoards = useMemo(() => {
    const ids = savedItems.filter(s => s.itemType === 'board').map(s => s.itemId)
    return boards.filter(b => ids.includes(b.id) && ((b.ownerId || currentUsername) === currentUsername || b.privacy === 'public'))
  }, [savedItems, boards, currentUsername])

  const savedMemories = useMemo(() => {
    const ids = savedItems.filter(s => s.itemType === 'moment').map(s => s.itemId)
    return memories.filter(m => ids.includes(m.id) && ((m.ownerId || currentUsername) === currentUsername || m.privacy === 'public'))
  }, [savedItems, memories, currentUsername])

  return (
    <section className="screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-[#8b8991] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to My Universe
        </button>
      </div>

      <div>
        <span className="eyebrow block mb-2 text-[10px]">CURATED SELECTIONS</span>
        <h1 className="title-large">Saved Favorites</h1>
        <p className="lede mt-1 mb-0">Public and private moments you have bookmarked across your universe.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
        {(['ALL', 'BOARDS', 'MOMENTS'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs transition-all border ${
              filter === tab ? 'bg-white/10 border-white text-white font-medium' : 'bg-white/[0.03] border-white/10 text-[#8b8991] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {(filter === 'ALL' || filter === 'BOARDS') && savedBoards.length > 0 && (
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Saved Collections</h3>
            <span className="text-[10px] text-[#66636c]">{savedBoards.length} saved</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedBoards.map(b => (
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

      {(filter === 'ALL' || filter === 'MOMENTS') && savedMemories.length > 0 && (
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">Saved Moments</h3>
            <span className="text-[10px] text-[#66636c]">{savedMemories.length} saved</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedMemories.map(m => (
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

      {savedBoards.length === 0 && savedMemories.length === 0 && (
        <div className="py-20 text-center glass-card border border-white/10 rounded-3xl p-8">
          <Bookmark size={32} className="mx-auto mb-3 text-[#8b8991]" />
          <h3 className="text-sm font-medium text-white mb-1">NO SAVED ITEMS</h3>
          <p className="text-xs text-[#b1afb8]">Bookmark your favorite memories or collections to easily find them here.</p>
        </div>
      )}
    </section>
  )
}

/* EDITORIAL BOARD PAGE WITH CHILD BOARDS */
function BoardPage({
  board,
  currentUsername,
  allBoards,
  blocks,
  allMemories,
  allNotes,
  onBack,
  onMemory,
  onBoard,
  onUser,
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
  currentUsername: string
  allBoards: Board[]
  blocks: BoardBlock[]
  allMemories: Memory[]
  allNotes: Note[]
  onBack: () => void
  onMemory: (m: Memory) => void
  onBoard: (b: Board) => void
  onUser: (username: string) => void
  onAddBlock: (b: any) => void
  onEditBoard: () => void
  onDeleteBoard: () => void
  onAddChildBoard: () => void
  onDeleteBlock: (id: string) => void
  onReorderBlock: (id: string, dir: 'up' | 'down') => void
  onShareBoard: () => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
}) {
  const isOwner = (board.ownerId || currentUsername) === currentUsername
  const childBoards = allBoards.filter(b => b.parentBoardId === board.id && (isOwner || b.privacy === 'public'))
  const parentBoard = board.parentBoardId ? allBoards.find(b => b.id === board.parentBoardId) : null

  return (
    <section className="screen space-y-8">
      {/* Breadcrumbs & Navigation Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-xs text-[#8b8991]">
          <button onClick={onBack} className="hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Back
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
          <button onClick={onShareBoard} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white transition-all">
            <Share2 size={14} />
          </button>
          <button onClick={e => onToggleSave('board', board.id, e)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white transition-all">
            <Bookmark size={14} className={isSaved('board', board.id) ? 'fill-[#c7a6ff] text-[#c7a6ff]' : ''} />
          </button>
          {isOwner && (
            <>
              <button onClick={onEditBoard} className="btn-secondary text-xs px-3 py-1.5">
                <Pencil size={12} /> Edit
              </button>
              <button onClick={onDeleteBoard} className="p-2 rounded-xl bg-white/5 border border-white/10 text-rose-400 hover:bg-rose-950/40 transition-all">
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Cinematic Hero Header */}
      <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden glass-card border border-white/12">
        <GlassImage src={board.image} alt={board.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span className={`badge-privacy ${board.privacy === 'public' ? 'is-public' : ''}`}>
            {board.privacy === 'private' ? <LockKeyhole size={9} /> : <Globe2 size={9} />}
            {board.privacy}
          </span>
          {parentBoard && (
            <span className="text-[10px] bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/12 text-[#c7a6ff]">
              Child Board
            </span>
          )}
          {board.ownerId && board.ownerId !== currentUsername && (
            <button
              onClick={() => onUser(board.ownerId!)}
              className="text-[10px] bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15 text-white hover:text-[#c7a6ff] transition-colors"
            >
              by @{board.ownerId}
            </button>
          )}
        </div>
        <div className="absolute bottom-6 left-6 right-6 space-y-2 z-10">
          <h1 className="text-3xl sm:text-4xl font-normal text-white">{board.name}</h1>
          <p className="text-xs sm:text-sm text-[#b1afb8] max-w-2xl">{board.description}</p>
          <div className="flex items-center gap-4 text-xs text-[#8b8991] pt-1">
            <span>{allMemories.length} memories</span>
            <span>·</span>
            <span>{childBoards.length} child boards</span>
            {board.location && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1 text-[#c7a6ff]">
                  <MapPin size={10} /> {board.location}
                </span>
              </>
            )}
          </div>
        </div>
        <span className="corner-line-tl" />
      </div>

      {/* Child Boards Section */}
      <div>
        <div className="section-header">
          <h2>CHILD BOARDS ({childBoards.length})</h2>
          {isOwner && (
            <button onClick={onAddChildBoard} className="text-xs text-[#c7a6ff] hover:underline flex items-center gap-1">
              <FolderPlus size={14} /> + Add Child Board
            </button>
          )}
        </div>
        {childBoards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {childBoards.map(cb => (
              <BoardCard
                key={cb.id}
                board={cb}
                allBoards={allBoards}
                allMemories={allMemories}
                onClick={() => onBoard(cb)}
                isSaved={isSaved('board', cb.id)}
                onToggleSave={e => onToggleSave('board', cb.id, e)}
              />
            ))}
          </div>
        ) : isOwner ? (
          <button
            onClick={onAddChildBoard}
            className="w-full py-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-[#b1afb8] text-xs font-medium flex items-center justify-center gap-2 hover:border-white/30 hover:text-white transition-all"
          >
            <FolderPlus size={14} /> Create nested child board inside {board.name}
          </button>
        ) : null}
      </div>

      {/* Asymmetric / Scrapbook Board Blocks Layout */}
      <div>
        <div className="section-header">
          <h2>COLLECTION MEMORIES & BLOCKS</h2>
        </div>
        {allMemories.length > 0 || blocks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allMemories.map(m => (
              <MemoryCard
                key={m.id}
                memory={m}
                onClick={() => onMemory(m)}
                isSaved={isSaved('moment', m.id)}
                onToggleSave={e => onToggleSave('moment', m.id, e)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center glass-card border border-white/10 rounded-3xl p-8">
            <LayoutGrid size={32} className="mx-auto mb-3 text-[#8b8991]" />
            <h3 className="text-sm font-medium text-white mb-1">NO CONTENT IN THIS COLLECTION YET</h3>
            <p className="text-xs text-[#b1afb8]">Add moments or child boards to populate this space.</p>
          </div>
        )}
      </div>
    </section>
  )
}

/* MEMORY PAGE — DETAILED MOMENT VIEW */
function MemoryPage({
  memory,
  currentUsername,
  board,
  place,
  owner,
  onBack,
  onEdit,
  onDelete,
  onTogglePrivacy,
  onUser,
  onNext,
  onPrev,
  isSaved,
  onToggleSave,
}: {
  memory: Memory
  currentUsername: string
  board?: Board | null
  place?: Place | null
  owner?: Profile | null
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
  onTogglePrivacy: () => void
  onUser: (username: string) => void
  onNext: () => void
  onPrev: () => void
  isSaved: (type: 'board' | 'moment', id: string) => boolean
  onToggleSave: (type: 'board' | 'moment', id: string, e?: React.MouseEvent) => void
}) {
  const isOwner = (memory.ownerId || currentUsername) === currentUsername

  return (
    <section className="screen space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="flex items-center gap-2 text-xs text-[#8b8991] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2">
          <button onClick={onNext} className="btn-secondary text-xs px-3 py-1.5" title="Next Memory">
            Next <ChevronRight size={14} />
          </button>
          {isOwner && (
            <button onClick={onEdit} className="btn-secondary text-xs px-3 py-1.5">
              <Pencil size={12} /> Edit
            </button>
          )}
          <button onClick={e => onToggleSave('moment', memory.id, e)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white transition-all">
            <Bookmark size={14} className={isSaved('moment', memory.id) ? 'fill-[#c7a6ff] text-[#c7a6ff]' : ''} />
          </button>
        </div>
      </div>

      {/* Main Full-Size Image Container */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-white/15 shadow-2xl max-h-[520px] flex items-center justify-center bg-black">
        {memory.image ? (
          <img src={memory.image} alt={memory.title} className="max-h-[520px] w-full object-contain" />
        ) : (
          <div className="py-24 text-white/30 flex items-center justify-center">No Image</div>
        )}
      </div>

      {/* Memory Content Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {memory.mood && (
              <span className="text-xs bg-white/10 border border-white/15 px-3 py-1 rounded-full text-white font-medium">
                {memory.mood}
              </span>
            )}
            {board && (
              <span className="text-xs text-[#c7a6ff] bg-[#c7a6ff]/10 border border-[#c7a6ff]/20 px-3 py-1 rounded-full">
                {board.name}
              </span>
            )}
            {place && (
              <span className="text-xs text-[#c7a6ff] bg-white/5 border border-white/10 px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin size={10} /> {place.name}
              </span>
            )}
            {owner && (
              <button
                onClick={() => onUser(owner.username)}
                className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/80 hover:text-[#c7a6ff] transition-colors flex items-center gap-1.5"
              >
                <User size={10} /> @{owner.username}
              </button>
            )}
          </div>

          {isOwner ? (
            <button onClick={onTogglePrivacy} className={`badge-privacy cursor-pointer ${memory.privacy === 'public' ? 'is-public' : ''}`}>
              {memory.privacy === 'private' ? <LockKeyhole size={10} /> : <Globe2 size={10} />}
              {memory.privacy.toUpperCase()}
            </button>
          ) : (
            <span className={`badge-privacy ${memory.privacy === 'public' ? 'is-public' : ''}`}>
              <Globe2 size={10} /> PUBLIC
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-normal text-white">{memory.title}</h1>
        <p className="text-sm text-[#b1afb8] leading-relaxed max-w-2xl">{memory.description}</p>

        <div className="flex items-center gap-4 text-xs text-[#8b8991] pt-2 border-t border-white/10">
          {memory.location && (
            <span className="flex items-center gap-1 text-[#c7a6ff]">
              <MapPin size={12} /> {memory.location}
            </span>
          )}
          <span>·</span>
          <span>{memory.date}</span>
        </div>

        {isOwner && (
          <button onClick={onDelete} className="flex items-center gap-2 text-xs text-rose-400/80 hover:text-rose-400 pt-4">
            <Trash2 size={14} /> Delete memory from archive
          </button>
        )}
      </div>
    </section>
  )
}

/* CREATION / EDIT BOTTOM SHEET */
function CreationSheet({
  type,
  boards,
  places,
  moods,
  profile,
  eraItems,
  editingMemory,
  editingBoard,
  editingPlace,
  parentBoard,
  onClose,
  onBoard,
  onUpdateBoard,
  onMemory,
  onUpdateMemory,
  onPlace,
  onUpdatePlace,
  onNote,
  onEraSave,
  onProfile,
}: {
  type: string
  boards: Board[]
  places: Place[]
  moods: Mood[]
  profile: Profile
  eraItems?: EraItem[]
  editingMemory?: Memory | null
  editingBoard?: Board | null
  editingPlace?: Place | null
  parentBoard?: Board | null
  onClose: () => void
  onBoard: (b: any) => void
  onUpdateBoard: (id: string, b: any) => void
  onMemory: (m: any) => void
  onUpdateMemory: (id: string, m: any) => void
  onPlace: (p: any) => void
  onUpdatePlace: (id: string, p: any) => void
  onNote: (n: string) => void
  onEraSave: (items: EraItem[]) => void
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
                : mode === 'current-era'
                ? 'EDIT CURRENT ERA'
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
                : mode === 'place' || mode === 'edit-place'
                ? mode === 'edit-place' ? 'EDIT PLACE' : 'CREATE PLACE'
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
              onClick={() => setMode('place')}
              className="w-full glass-card p-4 flex items-center gap-4 text-left hover:border-white/25 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-white/5 text-white">
                <MapPin size={20} />
              </div>
              <div className="flex-1">
                <strong className="text-sm text-white block font-medium">Create Place</strong>
                <small className="text-xs text-[#b1afb8]">Save a real location for memories</small>
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
            places={places}
            moods={moods}
            initial={editingMemory}
            onSave={m => {
              if (editingMemory) {
                onUpdateMemory(editingMemory.id, m)
              } else {
                onMemory(m)
              }
            }}
            onQuickBoard={name => {
              const newBoardData = {
                name,
                description: 'Personal collection',
                image: images.cafe,
                privacy: 'private' as PrivacyStatus,
              }
              onBoard(newBoardData)
              return name
            }}
          />
        ) : mode === 'board' || mode === 'edit-board' || mode === 'create-child-board' ? (
          <BoardForm
            places={places}
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
        ) : mode === 'place' || mode === 'edit-place' ? (
          <PlaceForm
            initial={editingPlace}
            onSave={p => {
              if (editingPlace) {
                onUpdatePlace(editingPlace.id, p)
              } else {
                onPlace(p)
              }
            }}
          />
        ) : mode === 'current-era' ? (
          <EraSheet items={eraItems || starterEraItems} onSave={onEraSave} />
        ) : mode === 'story' ? (
          <MemoryForm
            boards={boards}
            places={places}
            moods={moods}
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

/* Memory Creation / Edit Form (Phase 5 Quick Save & Post-Save Enrichment) */
function MemoryForm({
  boards,
  places,
  moods,
  initial,
  isStory,
  onSave,
  onQuickBoard,
}: {
  boards: Board[]
  places: Place[]
  moods: Mood[]
  initial?: Memory | null
  isStory?: boolean
  onSave: (m: any) => void
  onQuickBoard?: (name: string) => string
}) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [image, setImage] = useState(initial?.image || '')
  const [boardId, setBoardId] = useState(initial?.boardId || '')
  const [placeId, setPlaceId] = useState(initial?.placeId || '')
  const [date, setDate] = useState(initial?.date || 'August 2026')
  const [location, setLocation] = useState(initial?.location || '')
  const [mood, setMood] = useState(initial?.mood || '')
  const [moodId, setMoodId] = useState(initial?.moodId || '')
  const [tags, setTags] = useState(initial?.tags ? initial.tags.join(', ') : '')
  const [privacy, setPrivacy] = useState<PrivacyStatus>(initial?.privacy || 'private')

  const [isQuickCreatingBoard, setIsQuickCreatingBoard] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const isQuickSaveMode = !initial && !isStory

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!image && isQuickSaveMode) {
      setErrorMsg('Please select a photo first')
      return
    }
    setErrorMsg('')
    setIsSaving(true)

    const finalTitle = title.trim() || (description.trim() ? description.trim().slice(0, 30) : 'Untitled Moment')

    onSave({
      title: finalTitle,
      description: description.trim(),
      image: image || (isStory ? images.library : images.rain),
      boardId,
      placeId,
      date: date || 'August 2026',
      location,
      mood,
      moodId,
      privacy,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    })
  }

  // Quick Save Mode (Step 1: Photo -> Step 2: Note -> Step 3: Board -> Save)
  if (isQuickSaveMode) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-base font-normal text-white">QUICK SAVE MOMENT</h3>
          <p className="text-xs text-[#b1afb8]">Capture now, organize later.</p>
        </div>

        {/* Step 1: Image Selection (Required) */}
        <div className="form-group">
          <label className="flex items-center justify-between text-xs text-white">
            <span>Photo <span className="text-[#c7a6ff]">*</span></span>
            <span className="text-[10px] text-[#8b8991]">Required</span>
          </label>
          <ImageUpload
            value={image}
            onChange={v => {
              setImage(v)
              if (v) setErrorMsg('')
            }}
          />
        </div>

        {/* Step 2: Optional Short Note */}
        <div className="form-group">
          <label className="text-xs text-[#b1afb8]">Add a little note... (Optional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Say something about this moment..."
            className="form-textarea min-h-[80px]"
          />
        </div>

        {/* Step 3: Optional Board Selection / Quick Board Create */}
        <div className="form-group">
          <label className="text-xs text-[#b1afb8]">Collection (Optional)</label>
          {isQuickCreatingBoard ? (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newBoardName}
                onChange={e => setNewBoardName(e.target.value)}
                placeholder="New collection name..."
                className="form-input flex-1 text-xs"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  if (newBoardName.trim() && onQuickBoard) {
                    const createdId = onQuickBoard(newBoardName.trim())
                    setBoardId(createdId)
                    setIsQuickCreatingBoard(false)
                  }
                }}
                className="btn-secondary text-xs px-3 py-2 flex-shrink-0"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsQuickCreatingBoard(false)}
                className="text-xs text-[#8b8991] px-2 hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <select
              value={boardId}
              onChange={e => {
                if (e.target.value === '__new__') {
                  setIsQuickCreatingBoard(true)
                } else {
                  setBoardId(e.target.value)
                }
              }}
              className="form-select text-xs"
            >
              <option value="" className="bg-black text-white">No collection (Unassigned Archive)</option>
              {boards.map(b => (
                <option key={b.id} value={b.id} className="bg-black text-white">
                  {b.name}
                </option>
              ))}
              <option value="__new__" className="bg-black text-[#c7a6ff]">
                + Create new board...
              </option>
            </select>
          )}
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-xl">{errorMsg}</p>
        )}

        {/* Save Action */}
        <button
          type="submit"
          disabled={!image || isSaving}
          className="btn-primary w-full py-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Quick Save'}
        </button>
      </form>
    )
  }

  // Full Edit Form (Post-Save Enrichment / Editing existing memory or story)
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <label>{isStory ? 'Cover Photo (Optional)' : 'Photo'}</label>
        <ImageUpload value={image} onChange={setImage} />
      </div>

      <div className="form-group">
        <label>Title</label>
        <input
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
          <label>Place</label>
          <select value={placeId} onChange={e => setPlaceId(e.target.value)} className="form-select">
            <option value="" className="bg-black text-white">No place selected</option>
            {places.map(p => (
              <option key={p.id} value={p.id} className="bg-black text-white">
                📍 {p.name}
              </option>
            ))}
          </select>
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
          <label>Location text</label>
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
        <label>Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="e.g. rain, quiet"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Mood</label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {moods.map(m => {
            const moodLabel = `${m.icon} ${m.name}`
            const isSelected = moodId === m.id || mood === moodLabel
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMoodId(m.id)
                  setMood(moodLabel)
                }}
                className={`px-3 py-1 rounded-full text-xs transition-all border flex items-center gap-1 ${
                  isSelected
                    ? 'bg-white/10 border-white text-white font-medium'
                    : 'bg-white/5 border-white/10 text-[#8b8991]'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.name}</span>
              </button>
            )
          })}
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

      <button type="submit" disabled={isSaving} className="btn-primary mt-2">
        {isSaving ? 'Saving...' : initial ? 'Update Moment' : 'Save Moment'}
      </button>
    </form>
  )
}

/* Collection Creation / Edit Form */
function BoardForm({
  places,
  initial,
  parentBoard,
  onSave,
}: {
  places: Place[]
  initial?: Board | null
  parentBoard?: Board | null
  onSave: (b: any) => void
}) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [image, setImage] = useState(initial?.image || '')
  const [location, setLocation] = useState(initial?.location || '')
  const [placeId, setPlaceId] = useState(initial?.placeId || '')
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
            placeId,
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
          <label>Place</label>
          <select value={placeId} onChange={e => setPlaceId(e.target.value)} className="form-select">
            <option value="" className="bg-black text-white">No place selected</option>
            {places.map(p => (
              <option key={p.id} value={p.id} className="bg-black text-white">
                📍 {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Visibility</label>
        <select value={privacy} onChange={e => setPrivacy(e.target.value as PrivacyStatus)} className="form-select">
          <option value="private" className="bg-black text-white">Private</option>
          <option value="public" className="bg-black text-white">Public</option>
        </select>
      </div>

      <button type="submit" className="btn-primary mt-2">
        {initial ? 'Update Collection' : 'Create collection'}
      </button>
    </form>
  )
}

/* Place Creation / Edit Form */
function PlaceForm({
  initial,
  onSave,
}: {
  initial?: Place | null
  onSave: (p: any) => void
}) {
  const [name, setName] = useState(initial?.name || '')
  const [location, setLocation] = useState(initial?.location || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [image, setImage] = useState(initial?.image || '')

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (name.trim()) {
          onSave({
            name,
            location,
            description,
            image: image || images.cafe,
          })
        }
      }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-normal text-white">{initial ? 'EDIT PLACE' : 'CREATE NEW PLACE'}</h3>
        <p className="text-xs text-[#b1afb8]">Save a real location associated with memories or notes.</p>
      </div>

      <div className="form-group">
        <label>Place Name</label>
        <input
          required
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Blue Door Café"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Location / City</label>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="e.g. Jamshedpur or Tokyo, Japan"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="e.g. Warm coffee spot near Gion..."
          className="form-textarea"
        />
      </div>

      <div className="form-group">
        <label>Cover Image</label>
        <ImageUpload value={image} onChange={setImage} />
      </div>

      <button type="submit" className="btn-primary">
        {initial ? 'Update Place' : 'Save Place'}
      </button>
    </form>
  )
}

/* Current Era Management Form */
function EraSheet({
  items,
  onSave,
}: {
  items: EraItem[]
  onSave: (updated: EraItem[]) => void
}) {
  const [list, setList] = useState<EraItem[]>(items)
  const [newLabel, setNewLabel] = useState('')
  const [newIcon, setNewIcon] = useState('✦')

  const icons = ['💻', '☕', '📚', '🌙', '🎧', '📷', '✈️', '🎨', '✨', '✦']

  const handleAdd = () => {
    if (newLabel.trim()) {
      const newItem: EraItem = {
        id: uid(),
        label: newLabel.trim(),
        icon: newIcon,
        order: list.length + 1,
      }
      setList(prev => [...prev, newItem])
      setNewLabel('')
    }
  }

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(item => item.id !== id))
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= list.length) return
    const updated = [...list]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    updated.forEach((item, idx) => {
      item.order = idx + 1
    })
    setList(updated)
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSave(list)
      }}
      className="space-y-5"
    >
      <div>
        <h3 className="text-lg font-normal text-white">EDIT CURRENT ERA</h3>
        <p className="text-xs text-[#b1afb8]">What is your world feeling like right now?</p>
      </div>

      {list.length > 0 ? (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {list.map((item, idx) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-base">{item.icon || '✦'}</span>
                <span className="text-xs text-white">{item.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 rounded bg-white/5 hover:bg-white/15 disabled:opacity-30 text-white"
                  title="Move Up"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === list.length - 1}
                  className="p-1 rounded bg-white/5 hover:bg-white/15 disabled:opacity-30 text-white"
                  title="Move Down"
                >
                  <ArrowDown size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded bg-rose-950/40 text-rose-300 hover:bg-rose-900/60"
                  title="Delete Item"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center rounded-2xl border border-dashed border-white/15 text-xs text-[#b1afb8]">
          "What's your world feeling like lately?"
        </div>
      )}

      <div className="space-y-2 pt-2 border-t border-white/10">
        <label className="text-xs text-[#b1afb8]">Add Era Item</label>
        <div className="flex gap-2">
          <select value={newIcon} onChange={e => setNewIcon(e.target.value)} className="form-select w-20">
            {icons.map(ic => (
              <option key={ic} value={ic} className="bg-black text-white">
                {ic}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            placeholder="e.g. photography, rainy evenings..."
            className="form-input flex-1"
          />
          <button type="button" onClick={handleAdd} className="btn-secondary text-xs px-3">
            Add
          </button>
        </div>
      </div>

      <button type="submit" className="btn-primary mt-2">
        Save Current Era
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
