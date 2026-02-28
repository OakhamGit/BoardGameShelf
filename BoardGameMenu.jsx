import { useState, useMemo } from "react";

const GAMES = [
  { id: 1, name: "Catan", players: [3, 4], playtime: 90, genre: "Strategy", shelf: "A3", description: "Trade, build, and settle across the island. A timeless negotiation classic — great for groups who love a bit of friendly betrayal.", tags: ["Negotiation", "Classic"] },
  { id: 2, name: "Ticket to Ride", players: [2, 5], playtime: 60, genre: "Family", shelf: "B1", description: "Claim railway routes across the continent before your opponents block you. Accessible rules, high drama.", tags: ["Routes", "Easy to learn"] },
  { id: 3, name: "Pandemic", players: [2, 4], playtime: 45, genre: "Co-op", shelf: "A5", description: "The world is on the brink. Work together, or fall apart. One of the best cooperative games ever made.", tags: ["Team play", "Tense"] },
  { id: 4, name: "Codenames", players: [2, 8], playtime: 15, genre: "Party", shelf: "C2", description: "One word, multiple meanings. Give the perfect clue without leading your team astray. Addictive for large groups.", tags: ["Words", "Quick"] },
  { id: 5, name: "7 Wonders", players: [3, 7], playtime: 30, genre: "Strategy", shelf: "A4", description: "Draft cards and build a civilization across three ages. Scales beautifully from 3 to 7 players.", tags: ["Drafting", "Civilisation"] },
  { id: 6, name: "Patchwork", players: [2, 2], playtime: 30, genre: "2-Player", shelf: "D1", description: "A peaceful but sharp spatial duel over quilt pieces. The perfect two-player game.", tags: ["Puzzle", "Quick"] },
  { id: 7, name: "Root", players: [2, 4], playtime: 90, genre: "Strategy", shelf: "A2", description: "Asymmetric woodland warfare. Each faction plays completely differently — deep, theatrical, and wildly replayable.", tags: ["Asymmetric", "Complex"] },
  { id: 8, name: "Coup", players: [2, 6], playtime: 15, genre: "Party", shelf: "C1", description: "Bluff your way to power. Compact, ruthless, and over in 20 minutes. Perfect filler or nightcap game.", tags: ["Bluffing", "Quick"] },
  { id: 9, name: "Wingspan", players: [1, 5], playtime: 70, genre: "Family", shelf: "B2", description: "Attract birds to your wildlife preserve in this gorgeous engine-building game. Calm, clever, and visually stunning.", tags: ["Engine building", "Relaxed"] },
  { id: 10, name: "Gloomhaven: Jaws", players: [1, 4], playtime: 60, genre: "Co-op", shelf: "A6", description: "A standalone dungeon-crawler intro to the Gloomhaven universe. Tactical card combat with a campaign to sink into.", tags: ["Dungeon crawler", "Campaign"] },
  { id: 11, name: "Azul", players: [2, 4], playtime: 45, genre: "Family", shelf: "B3", description: "Tile-drafting beauty. Pick Portuguese tiles and arrange them on your board — elegant, satisfying, and competitive.", tags: ["Abstract", "Tactile"] },
  { id: 12, name: "Jaipur", players: [2, 2], playtime: 30, genre: "2-Player", shelf: "D2", description: "A fast card-trading duel set in a bustling Indian market. Our most-played 2-player game by far.", tags: ["Trading", "Favourite"] },
  { id: 13, name: "Splendor", players: [2, 4], playtime: 30, genre: "Strategy", shelf: "A7", description: "Collect gem tokens and build the most prestigious jewellery empire. Deceptively simple, deeply strategic.", tags: ["Engine building", "Accessible"] },
  { id: 14, name: "King of Tokyo", players: [2, 6], playtime: 30, genre: "Party", shelf: "C3", description: "Roll dice, smash Tokyo, and become the ultimate monster. Raucous fun for any group size.", tags: ["Dice", "Chaotic"] },
  { id: 15, name: "Dead of Winter", players: [2, 5], playtime: 100, genre: "Co-op", shelf: "A8", description: "Survive a zombie apocalypse — but one of your group might be a traitor. Tense, narrative, unforgettable.", tags: ["Traitor", "Story"] },
  { id: 16, name: "Sushi Go!", players: [2, 5], playtime: 15, genre: "Family", shelf: "B4", description: "Speedy card-drafting with adorable sushi artwork. Wonderful intro game for all ages.", tags: ["Drafting", "Quick"] },
];

const CATEGORIES = ["All", "Strategy", "Party", "Co-op", "Family", "2-Player"];
const GENRE_ICONS = { Strategy: "♟", Party: "🎲", "Co-op": "🤝", Family: "🏠", "2-Player": "⚔" };

const STAFF_PICKS = [
  { id: 7, note: "Staff favourite — no two games are ever the same." },
  { id: 15, note: "Perfect for a dramatic evening. Someone always betrays." },
  { id: 4, note: "Works with any group. Always gets people talking." },
];

const EVENTS = [
  { time: "7:00 PM", title: "Catan Night" },
  { time: "8:30 PM", title: "Casual Tables Open" },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedGame, setSelectedGame] = useState(null);
  const [finderOpen, setFinderOpen] = useState(false);
  const [finderPlayers, setFinderPlayers] = useState(4);
  const [finderTime, setFinderTime] = useState(60);
  const [finderGenre, setFinderGenre] = useState("Any");

  const displayedGames = useMemo(() => {
    if (activeCategory === "All") return GAMES;
    return GAMES.filter((g) => g.genre === activeCategory);
  }, [activeCategory]);

  const finderResults = useMemo(() => {
    return GAMES.filter((g) => {
      const pOk = finderPlayers >= g.players[0] && finderPlayers <= g.players[1];
      const tOk = g.playtime <= finderTime;
      const gOk = finderGenre === "Any" || g.genre === finderGenre;
      return pOk && tOk && gOk;
    });
  }, [finderPlayers, finderTime, finderGenre]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0a0a12; --surface: #10101c; --surface2: #161625; --surface3: #1e1e32;
          --border: #2a2a45; --border-glow: #4a2a6a;
          --purple: #9333ea; --purple-lt: #c084fc; --purple-dim: #4c1d95;
          --pink: #db2777; --teal: #06b6d4;
          --cream: #e8e8f0; --muted: #6b6b8a; --muted-lt: #9999b8;
          --radius: 8px; --radius-lg: 14px;
        }
        body { background: var(--bg); color: var(--cream); font-family: 'Inter', sans-serif; min-height: 100vh; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--surface); }
        ::-webkit-scrollbar-thumb { background: var(--purple-dim); border-radius: 3px; }

        header {
          position: sticky; top: 0; z-index: 40;
          background: rgba(10,10,18,0.92); border-bottom: 1px solid var(--border);
          backdrop-filter: blur(16px);
        }
        .header-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 32px;
          display: flex; align-items: center; justify-content: space-between; height: 64px;
        }
        .logo-wrap { display: flex; align-items: center; gap: 12px; }
        .logo-wrap img { height: 34px; }
        .logo-label { font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted-lt); }
        .logo-label strong { display: block; color: var(--purple-lt); font-size: 15px; font-weight: 700; }
        .header-right { display: flex; align-items: center; gap: 6px; }
        .nav-pill { font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; padding: 6px 14px; border-radius: 20px; background: transparent; border: 1px solid var(--border); color: var(--muted-lt); cursor: pointer; transition: all .2s; }
        .nav-pill:hover { border-color: var(--purple-dim); color: var(--cream); }
        .finder-btn { font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; padding: 8px 20px; border-radius: 20px; background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 100%); border: none; color: #fff; cursor: pointer; box-shadow: 0 0 20px rgba(147,51,234,0.4); transition: all .2s; }
        .finder-btn:hover { box-shadow: 0 0 30px rgba(147,51,234,0.65); transform: translateY(-1px); }

        .hero { max-width: 1280px; margin: 0 auto; padding: 52px 32px 36px; display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: start; }
        .hero-eyebrow { font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: var(--purple-lt); display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .hero-eyebrow::after { content: ''; width: 50px; height: 1px; background: var(--purple-dim); }
        .hero h1 { font-family: 'Rajdhani', sans-serif; font-size: clamp(30px, 4.5vw, 50px); font-weight: 700; line-height: 1.05; letter-spacing: 0.02em; color: var(--cream); }
        .hero h1 em { font-style: normal; color: var(--purple-lt); }
        .hero-sub { margin-top: 12px; font-size: 14px; color: var(--muted-lt); line-height: 1.7; max-width: 400px; }
        .hero-actions { display: flex; gap: 10px; margin-top: 22px; }
        .cta-primary { font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.12em; padding: 10px 24px; border-radius: 6px; background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 100%); border: none; color: #fff; cursor: pointer; box-shadow: 0 0 22px rgba(147,51,234,0.35); transition: all .2s; }
        .cta-primary:hover { box-shadow: 0 0 34px rgba(147,51,234,0.55); transform: translateY(-1px); }
        .cta-secondary { font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 13px; letter-spacing: 0.1em; padding: 10px 22px; border-radius: 6px; background: transparent; border: 1px solid var(--border); color: var(--muted-lt); cursor: pointer; transition: all .2s; }
        .cta-secondary:hover { border-color: var(--purple-dim); color: var(--cream); }

        .events-box { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 20px; min-width: 215px; }
        .panel-title { font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--purple-lt); margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
        .event-row { display: flex; justify-content: space-between; align-items: baseline; padding: 7px 0; border-bottom: 1px solid var(--border); }
        .event-row:last-child { border-bottom: none; padding-bottom: 0; }
        .event-time { font-family: 'Rajdhani', sans-serif; font-size: 11px; color: var(--teal); letter-spacing: 0.08em; }
        .event-name { font-size: 12px; color: var(--muted-lt); }

        .cat-bar { max-width: 1280px; margin: 0 auto; padding: 0 32px 24px; display: flex; gap: 8px; overflow-x: auto; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
        .cat-btn { font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap; padding: 8px 18px; border-radius: 6px; background: transparent; border: 1px solid var(--border); color: var(--muted-lt); cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 6px; }
        .cat-btn:hover { border-color: var(--purple-dim); color: var(--cream); }
        .cat-btn.active { background: linear-gradient(135deg, rgba(147,51,234,0.22) 0%, rgba(219,39,119,0.12) 100%); border-color: var(--purple); color: var(--purple-lt); box-shadow: 0 0 14px rgba(147,51,234,0.2); }

        .main-wrap { max-width: 1280px; margin: 0 auto; padding: 0 32px 60px; display: grid; grid-template-columns: 1fr 255px; gap: 28px; }
        .count-bar { font-family: 'Rajdhani', sans-serif; font-size: 12px; color: var(--muted); margin-bottom: 16px; letter-spacing: 0.06em; }
        .count-bar strong { color: var(--purple-lt); }

        .games-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px; }
        .game-card { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px 16px 14px; cursor: pointer; position: relative; overflow: hidden; transition: transform .2s, border-color .2s, box-shadow .2s; }
        .game-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(147,51,234,0.07) 0%, transparent 60%); opacity: 0; transition: opacity .2s; pointer-events: none; }
        .game-card:hover { transform: translateY(-3px); border-color: var(--border-glow); box-shadow: 0 8px 30px rgba(147,51,234,0.18), 0 0 0 1px rgba(147,51,234,0.1); }
        .game-card:hover::after { opacity: 1; }
        .card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 9px; }
        .card-genre-badge { font-family: 'Rajdhani', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--purple-lt); background: rgba(147,51,234,0.15); padding: 3px 7px; border-radius: 4px; border: 1px solid rgba(147,51,234,0.25); }
        .card-shelf { font-family: 'Rajdhani', sans-serif; font-size: 9px; color: var(--muted); letter-spacing: 0.12em; }
        .card-name { font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 700; letter-spacing: 0.02em; color: var(--cream); margin-bottom: 3px; line-height: 1.1; }
        .card-meta { font-size: 11px; color: var(--muted-lt); margin-bottom: 8px; }
        .card-desc { font-size: 12px; color: var(--muted-lt); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .card-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 10px; }
        .tag { font-size: 10px; padding: 3px 7px; border-radius: 4px; border: 1px solid var(--border); color: var(--muted-lt); background: var(--surface); letter-spacing: 0.05em; }

        .sidebar { display: flex; flex-direction: column; gap: 16px; }
        .sidebar-panel { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 18px; }
        .pick-item { padding: 10px 0; border-bottom: 1px solid var(--border); cursor: pointer; transition: .15s; }
        .pick-item:last-child { border-bottom: none; padding-bottom: 0; }
        .pick-item:hover .pick-name { color: var(--purple-lt); }
        .pick-name { font-size: 14px; font-weight: 500; color: var(--cream); margin-bottom: 3px; }
        .pick-note { font-size: 11px; color: var(--muted-lt); line-height: 1.55; font-style: italic; }
        .book-panel { background: linear-gradient(135deg, #120a1e 0%, #0d1a24 100%); border-color: var(--border-glow); }
        .book-desc { font-size: 12px; color: var(--muted-lt); line-height: 1.65; margin-bottom: 14px; }
        .book-btn { width: 100%; padding: 11px; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 100%); border: none; border-radius: 6px; color: #fff; cursor: pointer; box-shadow: 0 0 18px rgba(147,51,234,0.3); transition: all .2s; }
        .book-btn:hover { box-shadow: 0 0 28px rgba(147,51,234,0.5); transform: translateY(-1px); }

        /* OVERLAY */
        .overlay { position: fixed; inset: 0; background: rgba(5,5,12,0.82); z-index: 60; display: flex; align-items: center; justify-content: center; padding: 24px; backdrop-filter: blur(6px); animation: fadeIn .2s ease; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        /* MODAL */
        .modal { background: var(--surface2); border: 1px solid var(--border-glow); border-radius: 16px; max-width: 580px; width: 100%; position: relative; overflow: hidden; animation: popIn .22s cubic-bezier(0.34,1.4,0.64,1); box-shadow: 0 0 60px rgba(147,51,234,0.22), 0 30px 80px rgba(0,0,0,0.7); }
        @keyframes popIn { from { transform: scale(0.94); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        .modal-glow { position: absolute; top: -80px; right: -80px; width: 220px; height: 220px; border-radius: 50%; background: radial-gradient(circle, rgba(147,51,234,0.14) 0%, transparent 70%); pointer-events: none; }
        .modal-body { padding: 30px; }
        .modal-close { position: absolute; top: 12px; right: 12px; background: var(--surface3); border: 1px solid var(--border); color: var(--muted-lt); border-radius: 5px; padding: 4px 10px; cursor: pointer; font-size: 11px; font-family: 'Rajdhani', sans-serif; letter-spacing: 0.1em; transition: all .15s; }
        .modal-close:hover { color: var(--cream); border-color: var(--purple-dim); }
        .modal-badge { font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--purple-lt); background: rgba(147,51,234,0.15); border: 1px solid rgba(147,51,234,0.28); padding: 4px 10px; border-radius: 4px; display: inline-block; margin-bottom: 12px; }
        .modal-title { font-family: 'Rajdhani', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: 0.02em; color: var(--cream); margin-bottom: 6px; }
        .modal-meta { font-size: 13px; color: var(--muted-lt); margin-bottom: 18px; }
        .modal-divider { border: none; border-top: 1px solid var(--border); margin: 0 0 16px; }
        .modal-desc { font-size: 14px; color: var(--cream); line-height: 1.8; }
        .modal-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
        .modal-shelf { margin-top: 18px; padding: 13px 15px; background: var(--surface3); border: 1px solid var(--border); border-radius: 8px; display: flex; align-items: center; gap: 11px; }
        .modal-shelf .s-icon { font-size: 18px; }
        .modal-shelf .s-label strong { font-size: 13px; color: var(--cream); display: block; }
        .modal-shelf .s-label span { font-size: 11px; color: var(--muted-lt); }
        .modal-actions { display: flex; gap: 10px; margin-top: 18px; }
        .m-primary { flex: 1; padding: 11px; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 100%); border: none; border-radius: 6px; color: #fff; cursor: pointer; box-shadow: 0 0 18px rgba(147,51,234,0.3); transition: all .2s; }
        .m-primary:hover { box-shadow: 0 0 28px rgba(147,51,234,0.5); }
        .m-secondary { padding: 11px 16px; border-radius: 6px; background: transparent; border: 1px solid var(--border); color: var(--muted-lt); cursor: pointer; font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; transition: all .15s; }
        .m-secondary:hover { border-color: var(--purple-dim); color: var(--cream); }

        /* DRAWER */
        .drawer-overlay { position: fixed; inset: 0; background: rgba(5,5,12,0.7); z-index: 60; display: flex; justify-content: flex-end; backdrop-filter: blur(4px); animation: fadeIn .2s ease; }
        .drawer { width: 370px; height: 100vh; overflow-y: auto; background: var(--surface2); border-left: 1px solid var(--border-glow); box-shadow: -20px 0 60px rgba(147,51,234,0.14); padding: 30px 26px; animation: slideIn .25s cubic-bezier(0.32,0.72,0,1); }
        @keyframes slideIn { from { transform: translateX(40px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        .drawer-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .drawer-title { font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 0.05em; color: var(--purple-lt); }
        .drawer-sub { font-size: 12px; color: var(--muted-lt); margin-bottom: 26px; line-height: 1.6; }
        .d-label { font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted-lt); margin-bottom: 6px; margin-top: 18px; }
        .d-value { font-family: 'Rajdhani', sans-serif; font-size: 26px; font-weight: 700; color: var(--cream); margin-bottom: 6px; }
        input[type="range"] { width: 100%; accent-color: var(--purple); cursor: pointer; }
        .d-select { width: 100%; padding: 9px 12px; background: var(--surface3); border: 1px solid var(--border); border-radius: 6px; color: var(--cream); font-family: 'Inter', sans-serif; font-size: 13px; }
        .results-section { margin-top: 28px; border-top: 1px solid var(--border); padding-top: 20px; }
        .results-head { font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--purple-lt); margin-bottom: 12px; }
        .r-item { padding: 10px 0; border-bottom: 1px solid var(--border); cursor: pointer; transition: .15s; }
        .r-item:last-child { border-bottom: none; }
        .r-item:hover .r-name { color: var(--purple-lt); }
        .r-name { font-size: 14px; font-weight: 500; color: var(--cream); margin-bottom: 2px; }
        .r-meta { font-size: 11px; color: var(--muted-lt); }
        .no-results { font-size: 13px; color: var(--muted-lt); font-style: italic; }

        @media (max-width: 900px) {
          .main-wrap { grid-template-columns: 1fr; }
          .sidebar { display: grid; grid-template-columns: 1fr 1fr; }
          .hero { grid-template-columns: 1fr; }
          .events-box { display: none; }
        }
        @media (max-width: 600px) {
          .header-inner, .hero, .cat-bar, .main-wrap { padding-left: 16px; padding-right: 16px; }
          nav, .nav-pill { display: none; }
          .sidebar { grid-template-columns: 1fr; }
          .drawer { width: 100vw; }
        }
      `}</style>

      {/* HEADER */}
      <header>
        <div className="header-inner">
          <div className="logo-wrap">
            <img src="https://mysterytavern.co.uk/cdn/shop/files/tavernlogo-trans.png?v=1740138228&width=260" alt="Mystery Tavern" />
            <div className="logo-label">
              <strong>Mystery Tavern</strong>
              Board Game Menu
            </div>
          </div>
          <div className="header-right">
            {["Home", "TCG", "Events", "Contact"].map((l) => (
              <button key={l} className="nav-pill">{l}</button>
            ))}
            <button className="finder-btn" onClick={() => setFinderOpen(true)}>Find a Game →</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="hero">
        <div>
          <div className="hero-eyebrow">Tonight's Library</div>
          <h1>What are you<br /><em>playing tonight?</em></h1>
          <p className="hero-sub">Browse our full game library, check out staff picks, or use the Game Finder to match the perfect game to your group.</p>
          <div className="hero-actions">
            <button className="cta-primary" onClick={() => setFinderOpen(true)}>Find a Game for Your Group</button>
            <button className="cta-secondary">Book a Table</button>
          </div>
        </div>
        <div className="events-box">
          <div className="panel-title">Tonight's Events</div>
          {EVENTS.map((e, i) => (
            <div className="event-row" key={i}>
              <span className="event-time">{e.time}</span>
              <span className="event-name">{e.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY BAR */}
      <div className="cat-bar">
        {CATEGORIES.map((c) => (
          <button key={c} className={`cat-btn${activeCategory === c ? " active" : ""}`} onClick={() => setActiveCategory(c)}>
            {c !== "All" && <span>{GENRE_ICONS[c]}</span>}
            {c}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div className="main-wrap">
        <div>
          <div className="count-bar">
            <strong>{displayedGames.length}</strong> game{displayedGames.length !== 1 ? "s" : ""}
            {activeCategory !== "All" ? ` · ${activeCategory}` : " in the library"}
          </div>
          <div className="games-grid">
            {displayedGames.map((g) => (
              <div className="game-card" key={g.id} onClick={() => setSelectedGame(g)}>
                <div className="card-top">
                  <span className="card-genre-badge">{g.genre}</span>
                  <span className="card-shelf">SHELF {g.shelf}</span>
                </div>
                <div className="card-name">{g.name}</div>
                <div className="card-meta">{g.players[0]}–{g.players[1]} players · {g.playtime} min</div>
                <div className="card-desc">{g.description}</div>
                <div className="card-tags">{g.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="sidebar">
          <div className="sidebar-panel">
            <div className="panel-title">Staff Picks</div>
            {STAFF_PICKS.map((p) => {
              const g = GAMES.find((x) => x.id === p.id);
              return (
                <div className="pick-item" key={p.id} onClick={() => setSelectedGame(g)}>
                  <div className="pick-name">{g.name}</div>
                  <div className="pick-note">"{p.note}"</div>
                </div>
              );
            })}
          </div>
          <div className="sidebar-panel book-panel">
            <div className="panel-title">Reserve a Table</div>
            <p className="book-desc">Got a game in mind? Book a table for your group and we'll have it ready and waiting.</p>
            <button className="book-btn">Book a Table</button>
          </div>
        </aside>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #2a2a45", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1280, margin: "0 auto", fontSize: 12, color: "#6b6b8a" }}>
        <span>© Mystery Tavern</span>
        <div style={{ display: "flex", gap: 18 }}>
          {["Privacy", "Terms"].map((l) => <a key={l} style={{ color: "#6b6b8a", cursor: "pointer" }}>{l}</a>)}
        </div>
      </footer>

      {/* GAME MODAL */}
      {selectedGame && (
        <div className="overlay" onClick={() => setSelectedGame(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-glow" />
            <button className="modal-close" onClick={() => setSelectedGame(null)}>CLOSE</button>
            <div className="modal-body">
              <div className="modal-badge">{selectedGame.genre}</div>
              <div className="modal-title">{selectedGame.name}</div>
              <div className="modal-meta">{selectedGame.players[0]}–{selectedGame.players[1]} players · {selectedGame.playtime} min</div>
              <hr className="modal-divider" />
              <div className="modal-desc">{selectedGame.description}</div>
              <div className="modal-tags">{selectedGame.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
              <div className="modal-shelf">
                <span className="s-icon">📚</span>
                <div className="s-label">
                  <strong>Shelf {selectedGame.shelf}</strong>
                  <span>Ask a member of staff if you need help locating it</span>
                </div>
              </div>
              <div className="modal-actions">
                <button className="m-primary">Reserve This Game</button>
                <button className="m-secondary">Locate on Shelf</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FINDER DRAWER */}
      {finderOpen && (
        <div className="drawer-overlay" onClick={() => setFinderOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <span className="drawer-title">Game Finder</span>
              <button className="modal-close" style={{ position: "static" }} onClick={() => setFinderOpen(false)}>✕</button>
            </div>
            <p className="drawer-sub">Tell us about your group and we'll find the best match from our library.</p>

            <div className="d-label">Players at the table</div>
            <div className="d-value">{finderPlayers}</div>
            <input type="range" min={1} max={8} value={finderPlayers} onChange={(e) => setFinderPlayers(Number(e.target.value))} />

            <div className="d-label">Time available</div>
            <div className="d-value">{finderTime} min</div>
            <input type="range" min={15} max={120} step={15} value={finderTime} onChange={(e) => setFinderTime(Number(e.target.value))} />

            <div className="d-label">Genre preference</div>
            <select className="d-select" value={finderGenre} onChange={(e) => setFinderGenre(e.target.value)}>
              <option value="Any">Any genre</option>
              {CATEGORIES.slice(1).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="results-section">
              <div className="results-head">{finderResults.length} match{finderResults.length !== 1 ? "es" : ""}</div>
              {finderResults.length === 0 && <p className="no-results">Try adjusting your filters.</p>}
              {finderResults.map((g) => (
                <div className="r-item" key={g.id} onClick={() => { setSelectedGame(g); setFinderOpen(false); }}>
                  <div className="r-name">{g.name}</div>
                  <div className="r-meta">{g.players[0]}–{g.players[1]} players · {g.playtime} min · {g.genre}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
