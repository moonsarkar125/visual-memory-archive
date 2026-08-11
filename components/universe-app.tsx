'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Archive, ArrowLeft, Bell, BookOpen, Camera, ChevronRight, CircleUserRound,
  Compass, FileText, Globe2, ImagePlus, LockKeyhole, MapPin, Menu, MoreHorizontal,
  Pencil, Plus, Search, Send, Settings, Sparkles, Trash2, X, Heart, LayoutGrid,
} from 'lucide-react'

const images = {
  cafe: 'https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=900&q=85',
  japan: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85',
  books: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=800&q=85',
  rain: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=85',
  tea: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=85',
  hills: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=85',
}

type Board = { id: string; name: string; description: string; image: string; count: number; location?: string; privacy: 'private' | 'public'; children?: string[] }
type Memory = { id: string; title: string; description: string; image?: string; boardId: string; date: string; location?: string; privacy: 'private' | 'public'; tags: string[] }
type Note = { id: string; text: string; date: string; privacy: 'private' | 'public' }
type Profile = { username: string; displayName: string; bio: string; avatar: string; cover: string }

const starterBoards: Board[] = [
  { id: 'cafes', name: 'Cafés in Jamshedpur', description: 'little tables, long conversations', image: images.cafe, count: 12, location: 'Jamshedpur', privacy: 'private', children: ['Favorite cafés', 'Study cafés'] },
  { id: 'japan', name: 'Japan — someday', description: 'a soft itinerary for later', image: images.japan, count: 12, location: 'Japan', privacy: 'public', children: ['Tokyo', 'Kyoto'] },
  { id: 'books', name: 'Books I have read', description: 'pages that stayed', image: images.books, count: 18, privacy: 'private' },
  { id: 'anime', name: 'Anime universe', description: 'favorites and recommendations', image: images.hills, count: 43, privacy: 'private' },
]
const starterMemories: Memory[] = [
  { id: 'rain', title: 'Rainy evening', description: 'One of those evenings that felt quietly perfect.', image: images.rain, boardId: 'cafes', date: 'August 9, 2026', location: 'Jamshedpur', privacy: 'private', tags: ['rain', 'quiet'] },
  { id: 'tea', title: 'A cup of calm', description: 'Some mornings are meant to be taken slowly.', image: images.tea, boardId: 'cafes', date: 'August 2, 2026', location: 'Home', privacy: 'private', tags: ['morning'] },
]

const uid = () => Math.random().toString(36).slice(2, 9)

export default function UniverseApp() {
  const [page, setPage] = useState('home')
  const [boards, setBoards] = useState<Board[]>(starterBoards)
  const [memories, setMemories] = useState<Memory[]>(starterMemories)
  const [notes, setNotes] = useState<Note[]>([{ id: 'note-1', text: 'Some places are worth remembering for reasons you can\'t explain.', date: 'August 6, 2026', privacy: 'private' }])
  const [profile, setProfile] = useState<Profile>({ username: 'terribleraccoon556', displayName: '', bio: 'collecting little moments ✦', avatar: 'https://i.pravatar.cc/160?img=47', cover: images.japan })
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [sheet, setSheet] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('little-universe-v1')
      if (saved) { const data = JSON.parse(saved); setBoards(data.boards); setMemories(data.memories); setNotes(data.notes); setProfile(data.profile) }
    } catch {}
  }, [])
  useEffect(() => { localStorage.setItem('little-universe-v1', JSON.stringify({ boards, memories, notes, profile })) }, [boards, memories, notes, profile])
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 2400); return () => clearTimeout(t) } }, [toast])

  const openBoard = (board: Board) => { setSelectedBoard(board); setPage('board') }
  const openMemory = (memory: Memory) => { setSelectedMemory(memory); setPage('memory') }
  const addBoard = (board: Omit<Board, 'id' | 'count'>) => { const next = { ...board, id: uid(), count: 0 }; setBoards(v => [next, ...v]); setSheet(null); setToast('Board added to your universe') }
  const addMemory = (memory: Omit<Memory, 'id'>) => { setMemories(v => [{ ...memory, id: uid() }, ...v]); setBoards(v => v.map(b => b.id === memory.boardId ? { ...b, count: b.count + 1 } : b)); setSheet(null); setToast('Memory saved privately') }
  const addNote = (text: string) => { setNotes(v => [{ id: uid(), text, date: 'August 11, 2026', privacy: 'private' }, ...v]); setSheet(null); setToast('Note tucked away') }
  const deleteMemory = () => { if (!selectedMemory) return; setMemories(v => v.filter(m => m.id !== selectedMemory.id)); setSelectedMemory(null); setPage('home'); setToast('Memory deleted') }

  return <div className="universe-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <aside className="reference-panel" aria-label="Visual memory archive concept">
      <span className="reference-kicker">VISUAL MEMORY ARCHIVE</span><h2>Concept ideas</h2>
      <p className="reference-label">Mood / Aesthetic</p><ul><li>Glassmorphism</li><li>Neon lavender glow</li><li>Dark cinematic base</li><li>Soft gradients</li><li>Floating elements</li></ul>
      <div className="reference-card"><span>Glassmorphism Card Style</span><div className="reference-swatch">Cafe Diaries<small>23 memories</small></div></div>
      <div className="reference-card"><span>Neon Lavender Lines &amp; Twists</span><i className="neon-swoop" /></div>
    </aside>
    <main className="app-frame">
      {page === 'home' && <Home profile={profile} boards={boards} memories={memories} notes={notes} onBoard={openBoard} onMemory={openMemory} onCreate={() => setSheet('menu')} />}
      {page === 'search' && <SearchPage boards={boards} memories={memories} onBoard={openBoard} onMemory={openMemory} />}
      {page === 'inbox' && <Inbox />}
      {page === 'profile' && <ProfilePage profile={profile} boards={boards} memories={memories} notes={notes} onBoard={openBoard} onMemory={openMemory} onEdit={() => setSheet('profile')} />}
      {page === 'board' && selectedBoard && <BoardPage board={selectedBoard} memories={memories.filter(m => m.boardId === selectedBoard.id)} onBack={() => setPage('home')} onMemory={openMemory} onCreate={() => setSheet('memory')} />}
      {page === 'memory' && selectedMemory && <MemoryPage memory={selectedMemory} board={boards.find(b => b.id === selectedMemory.boardId)} onBack={() => setPage('home')} onDelete={deleteMemory} />}
      {page !== 'board' && page !== 'memory' && <Nav page={page} setPage={setPage} onCreate={() => setSheet('menu')} />}
    </main>
    <aside className="insight-panel" aria-label="Archive profile summary">
      <div className="insight-cover" style={{ backgroundImage: `url(${profile.cover})` }}><img src={profile.avatar} alt="" /><strong>@{profile.username}</strong><span>{profile.bio}</span><small><MapPin size={12} /> Jamshedpur</small></div>
      <div className="insight-stats"><span><b>{boards.length}</b>Collections</span><span><b>{memories.length}</b>Memories</span><span><b>42</b>Followers</span></div>
      <div className="insight-section"><div><h3>Pinned collections</h3><button onClick={() => setPage('profile')}>Reorder</button></div><div className="pinned-grid">{boards.slice(0,3).map(b => <button key={b.id} onClick={() => openBoard(b)}><img src={b.image} alt="" /><strong>{b.name}</strong><small>{b.count} memories</small></button>)}</div></div>
      <button className="insight-edit" onClick={() => setPage('profile')}><Pencil size={14} /> Edit profile</button>
      <div className="board-preview"><div className="insight-section-title"><h3>Board preview</h3><MoreHorizontal size={15} /></div><button onClick={() => boards[0] && openBoard(boards[0])}><img src={boards[0]?.image} alt="" /><strong>{boards[0]?.name || 'New collection'}</strong><small>{boards[0]?.count || 0} memories · {boards[0]?.children?.length || 0} boards</small></button></div>
      <div className="right-create"><div className="insight-section-title"><h3>Create</h3><X size={15} /></div><button onClick={() => setSheet('menu')}><LayoutGrid size={16} /> Board</button><button onClick={() => setSheet('memory')}><ImagePlus size={16} /> Memory</button><button onClick={() => setSheet('note')}><FileText size={16} /> Note</button></div>
    </aside>
    {sheet && <CreationSheet type={sheet} boards={boards} profile={profile} onClose={() => setSheet(null)} onBoard={addBoard} onMemory={addMemory} onNote={addNote} onProfile={p => { setProfile(p); setSheet(null); setToast('Profile updated') }} />}
    {toast && <div className="toast"><Sparkles size={15} /> {toast}</div>}
  </div>
}

function Header({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) { return <header className="topbar"><div><span className="eyebrow">{eyebrow || 'LITTLE UNIVERSE'}</span><h1>{title}</h1></div>{action}</header> }
function Home({ profile, boards, memories, notes, onBoard, onMemory, onCreate }: any) {
  return <section className="screen archive-home">
    <div className="archive-header"><div><span className="eyebrow">VISUAL MEMORY ARCHIVE</span><h1>Good evening,<br /><b>@{profile.username}</b> <Sparkles size={18} /></h1><p className="lede">Your little universe, in pieces.</p></div><div className="archive-tools"><div className="desktop-search"><Search size={16} /><span>Search memories, boards, notes...</span></div><button className="icon-button"><Bell size={18} /></button></div></div>
    <div className="archive-main-grid"><div>
      <section className="hero-note"><div><span className="eyebrow">A SMALL REMINDER</span><p>Collecting is a way of paying attention.</p></div><Sparkles size={22} /></section>
      <SectionTitle title="Recent memories" action="View all" /><div className="memory-row">{memories.slice(0, 3).map((m: Memory) => <MemoryCard key={m.id} memory={m} onClick={() => onMemory(m)} />)}</div>
      <SectionTitle title="Your collections" action="See all" /><div className="board-grid">{boards.slice(0, 4).map((b: Board) => <BoardCard key={b.id} board={b} onClick={() => onBoard(b)} />)}</div>
      <SectionTitle title="Notes from my universe" action="See all" /><div className="notes-row">{notes.slice(0, 3).map((n: Note) => <div className="note-card" key={n.id}><FileText size={15} /><p>{n.text}</p><span>{n.date}</span></div>)}<button className="write-note" onClick={onCreate}><Plus size={18} /><span>Write a note</span></button></div>
    </div><div className="home-create-panel"><SectionTitle title="Create" /><button onClick={onCreate}><LayoutGrid size={20} /><span>Board</span></button><button onClick={onCreate}><ImagePlus size={20} /><span>Memory</span></button><button onClick={onCreate}><FileText size={20} /><span>Note</span></button><button onClick={onCreate}><BookOpen size={20} /><span>Story</span></button></div></div>
  </section>
}
function SectionTitle({ title, action }: { title: string; action?: string }) { return <div className="section-title"><h2>{title}</h2>{action && <button>{action}<ChevronRight size={14} /></button>}</div> }
function MemoryCard({ memory, onClick }: { memory: Memory; onClick: () => void }) { return <button className="memory-card" onClick={onClick}>{memory.image && <img src={memory.image} alt="" />}<div className="memory-overlay"><span>{memory.privacy === 'private' ? <LockKeyhole size={11} /> : <Globe2 size={11} />}</span><strong>{memory.title}</strong><small>{memory.location}</small></div></button> }
function BoardCard({ board, onClick }: { board: Board; onClick: () => void }) { return <button className="board-card" onClick={onClick}><img src={board.image} alt="" /><div><div className="card-kicker">{board.privacy === 'private' ? <LockKeyhole size={11} /> : <Globe2 size={11} />} {board.count} memories</div><strong>{board.name}</strong>{board.location && <small><MapPin size={11} /> {board.location}</small>}</div></button> }
function Nav({ page, setPage, onCreate }: { page: string; setPage: (s: string) => void; onCreate: () => void }) { return <nav className="bottom-nav"><NavItem icon={<Archive />} label="Home" active={page === 'home'} onClick={() => setPage('home')} /><NavItem icon={<Search />} label="Search" active={page === 'search'} onClick={() => setPage('search')} /><button className="create-button" onClick={onCreate}><Plus /></button><NavItem icon={<Bell />} label="Inbox" active={page === 'inbox'} onClick={() => setPage('inbox')} /><NavItem icon={<CircleUserRound />} label="Profile" active={page === 'profile'} onClick={() => setPage('profile')} /></nav> }
function NavItem({ icon, label, active, onClick }: any) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span></button> }
function SearchPage({ boards, memories, onBoard, onMemory }: any) { const [q, setQ] = useState(''); const [filter, setFilter] = useState('All'); const results = useMemo(() => [...boards.map((b: Board) => ({ ...b, kind: 'Board' })), ...memories.map((m: Memory) => ({ ...m, kind: 'Memory' }))].filter((x: any) => (filter === 'All' || x.kind === filter) && JSON.stringify(x).toLowerCase().includes(q.toLowerCase())), [q, filter, boards, memories]); return <section className="screen"><Header title="Search" action={<button className="icon-button"><Compass size={18} /></button>} /><div className="search-box"><Search size={18} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search your universe" /></div><div className="chips">{['All', 'Board', 'Memory', 'Places', 'Tags'].map(x => <button className={filter === x ? 'selected' : ''} key={x} onClick={() => setFilter(x)}>{x}</button>)}</div><p className="search-hint">{q ? `${results.length} things found` : 'Look for places, feelings, and little things.'}</p><div className="search-results">{results.map((x: any) => x.kind === 'Board' ? <BoardCard key={x.id} board={x} onClick={() => onBoard(x)} /> : <MemoryCard key={x.id} memory={x} onClick={() => onMemory(x)} />)}</div></section> }
function Inbox() { return <section className="screen"><Header title="Inbox" action={<button className="icon-button"><Settings size={18} /></button>} /><div className="tabs"><button className="selected">Notifications</button><button>Messages</button></div><div className="inbox-list"><InboxItem icon={<Heart />} text="Someone saved your public board." time="2h ago" /><InboxItem icon={<CircleUserRound />} text="A new person found your universe." time="Yesterday" /><InboxItem icon={<BookOpen />} text="Your story is ready to be revisited." time="3d ago" /></div><div className="empty-inbox"><Send size={24} /><p>Messages will live here.</p><small>Keep your little universe quiet for now.</small></div></section> }
function InboxItem({ icon, text, time }: any) { return <div className="inbox-item"><span className="inbox-icon">{icon}</span><div><p>{text}</p><small>{time}</small></div><ChevronRight size={16} /></div> }
function ProfilePage({ profile, boards, memories, notes, onBoard, onMemory, onEdit }: any) { return <section className="screen profile-screen"><div className="profile-cover"><img src={profile.cover} alt="" /><button className="icon-button"><MoreHorizontal size={18} /></button></div><div className="profile-head"><img className="avatar" src={profile.avatar} alt="Profile avatar" /><div className="profile-copy"><h1>@{profile.username}</h1>{profile.displayName && <p>{profile.displayName}</p>}<span>{profile.bio}</span></div><button className="outline-button" onClick={onEdit}><Pencil size={14} /> Edit</button></div><div className="stats"><div><strong>{boards.length}</strong><span>collections</span></div><div><strong>{memories.length}</strong><span>memories</span></div><div><strong>17</strong><span>followers</span></div></div><SectionTitle title="Your archive" action="Arrange" /><div className="masonry">{boards.map((b: Board, i: number) => <BoardCard key={b.id} board={b} onClick={() => onBoard(b)} />)}{memories.map((m: Memory) => <MemoryCard key={m.id} memory={m} onClick={() => onMemory(m)} />)}{notes.map((n: Note) => <div className="note-card" key={n.id}><FileText size={17} /><p>{n.text}</p><span>{n.date}</span></div>)}</div></section> }
function BoardPage({ board, memories, onBack, onMemory, onCreate }: any) { return <section className="screen detail-screen"><button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Back to universe</button><div className="detail-cover"><img src={board.image} alt="" /><div><span className="eyebrow">COLLECTION · {board.privacy.toUpperCase()}</span><h1>{board.name}</h1><p>{board.description}</p><small>{board.location && <><MapPin size={12} /> {board.location} · </>}{board.count} memories</small></div></div>{board.children && <><SectionTitle title="Inside this collection" /><div className="child-row">{board.children.map(c => <button key={c}>{c}<ChevronRight size={15} /></button>)}</div></>}<SectionTitle title="Memories" action="Newest" /><div className="board-memory-grid">{memories.length ? memories.map((m: Memory) => <MemoryCard key={m.id} memory={m} onClick={() => onMemory(m)} />) : <EmptyState text="No memories here yet." action={onCreate} />}</div></section> }
function MemoryPage({ memory, board, onBack, onDelete }: any) {
  return <section className="screen detail-screen memory-detail">
    <button className="back-button" onClick={onBack}><ArrowLeft size={18} /> Back</button>
    {memory.image && <img className="cinema-image" src={memory.image} alt={memory.title} />}
    <div className="memory-detail-copy">
      <div className="detail-meta">
        <span className="privacy-label">{memory.privacy === 'private' ? <LockKeyhole size={13} /> : <Globe2 size={13} />} {memory.privacy === 'private' ? 'Private memory' : 'Public memory'}</span>
        <button className="icon-button"><MoreHorizontal size={18} /></button>
      </div>
      <h1>{memory.title}</h1><p className="long-copy">{memory.description}</p>
      <div className="memory-facts">{memory.location && <span><MapPin size={14} />{memory.location}</span>}<span>{memory.date}</span></div>
      <div className="chips">{memory.tags.map((t: string) => <span key={t}>{t}</span>)}</div>
      <div className="related"><span className="eyebrow">RELATED COLLECTION</span><strong>{board?.name}</strong></div>
      <button className="delete-button" onClick={onDelete}><Trash2 size={15} /> Delete memory</button>
    </div>
  </section>
}
function EmptyState({ text, action }: any) { return <div className="empty-state"><Archive size={22} /><p>{text}</p><button onClick={action}><Plus size={15} /> Add memory</button></div> }
function CreationSheet({ type, boards, profile, onClose, onBoard, onMemory, onNote, onProfile }: any) { const [mode, setMode] = useState(type === 'menu' ? '' : type); return <div className="sheet-backdrop" onClick={onClose}><div className="creation-sheet" onClick={e => e.stopPropagation()}><div className="sheet-handle" /><div className="sheet-header"><div><span className="eyebrow">MAKE ROOM FOR IT</span><h2>{mode ? mode === 'profile' ? 'Edit profile' : mode === 'memory' ? 'Add a memory' : mode === 'note' ? 'Write a note' : 'Create a board' : 'Create something'}</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div>{!mode ? <div className="create-menu"><CreateOption icon={<LayoutGrid />} title="Create board" text="Start a new collection" onClick={() => setMode('board')} /><CreateOption icon={<ImagePlus />} title="Add memory" text="Save a moment from your camera roll" onClick={() => setMode('memory')} /><CreateOption icon={<FileText />} title="Write note" text="Put a thought somewhere safe" onClick={() => setMode('note')} /><CreateOption icon={<BookOpen />} title="Create story" text="Give a memory more room" onClick={() => setMode('board')} /></div> : mode === 'profile' ? <ProfileForm profile={profile} onSave={onProfile} /> : mode === 'board' ? <BoardForm onSave={onBoard} /> : mode === 'note' ? <NoteForm onSave={onNote} /> : <MemoryForm boards={boards} onSave={onMemory} />}</div></div> }
function CreateOption({ icon, title, text, onClick }: any) { return <button className="create-option" onClick={onClick}><span>{icon}</span><div><strong>{title}</strong><small>{text}</small></div><ChevronRight size={17} /></button> }
function ImageInput({ value, onChange }: { value: string; onChange: (s: string) => void }) { const ref = useRef<HTMLInputElement>(null); return <><input ref={ref} className="sr-only" type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => onChange(String(reader.result)); reader.readAsDataURL(file) }} /><button className={`upload-box ${value ? 'has-image' : ''}`} onClick={() => ref.current?.click()}>{value ? <img src={value} alt="Selected upload preview" /> : <><Camera size={20} /><span>Choose from camera roll</span></>}</button></> }
function BoardForm({ onSave }: any) { const [name, setName] = useState(''); const [description, setDescription] = useState(''); const [image, setImage] = useState(''); const [location, setLocation] = useState(''); const [privacy, setPrivacy] = useState<'private' | 'public'>('private'); return <form className="form" onSubmit={e => { e.preventDefault(); if (name.trim()) onSave({ name, description, image: image || images.cafe, location, privacy }) }}><label>Board name<input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. places worth returning to" /></label><label>Description<textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What belongs here?" /></label><label>Cover image<ImageInput value={image} onChange={setImage} /></label><label>Location<input value={location} onChange={e => setLocation(e.target.value)} placeholder="Optional" /></label><Privacy value={privacy} onChange={setPrivacy} /><button className="primary-button">Create board</button></form> }
function MemoryForm({ boards, onSave }: any) { const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [image, setImage] = useState(''); const [boardId, setBoardId] = useState(boards[0]?.id || ''); const [location, setLocation] = useState(''); const [privacy, setPrivacy] = useState<'private' | 'public'>('private'); return <form className="form" onSubmit={e => { e.preventDefault(); if (title.trim() && boardId) onSave({ title, description, image: image || images.rain, boardId, date: 'August 11, 2026', location, privacy, tags: ['new'] }) }}><label>Image<ImageInput value={image} onChange={setImage} /></label><label>Title<input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Name this moment" /></label><label>Description<textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What do you want to remember?" /></label><label>Location<input value={location} onChange={e => setLocation(e.target.value)} placeholder="Optional" /></label><label>Collection<select value={boardId} onChange={e => setBoardId(e.target.value)}>{boards.map((b: Board) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label><Privacy value={privacy} onChange={setPrivacy} /><button className="primary-button">Save memory</button></form> }
function NoteForm({ onSave }: any) { const [text, setText] = useState(''); return <form className="form" onSubmit={e => { e.preventDefault(); if (text.trim()) onSave(text) }}><label>Your thought<textarea required autoFocus value={text} onChange={e => setText(e.target.value)} placeholder="Currently thinking about..." /></label><Privacy value="private" onChange={() => {}} /><button className="primary-button">Save note</button></form> }
function ProfileForm({ profile, onSave }: any) { const [p, setP] = useState(profile); return <form className="form" onSubmit={e => { e.preventDefault(); onSave(p) }}><label>Avatar<ImageInput value={p.avatar} onChange={avatar => setP({ ...p, avatar })} /></label><label>Username<input value={p.username} onChange={e => setP({ ...p, username: e.target.value.replace('@', '') })} /></label><label>Display name<input value={p.displayName} onChange={e => setP({ ...p, displayName: e.target.value })} /></label><label>Bio<textarea value={p.bio} onChange={e => setP({ ...p, bio: e.target.value })} /></label><button className="primary-button">Update profile</button></form> }
function Privacy({ value, onChange }: { value: string; onChange: (v: any) => void }) { return <div className="privacy"><span>Visibility</span><div>{(['private', 'public'] as const).map(x => <button type="button" key={x} className={value === x ? 'selected' : ''} onClick={() => onChange(x)}>{x === 'private' ? <LockKeyhole size={14} /> : <Globe2 size={14} />} {x}</button>)}</div></div> }

