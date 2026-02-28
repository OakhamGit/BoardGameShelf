import { useState, useMemo } from 'react'

const CATEGORIES = ['Any', 'Strategy', 'Party', 'Co-op', 'Family', '2-Player']

const styles = `
  .drawer-overlay {
    position: fixed; inset: 0; background: rgba(5,5,12,0.7); z-index: 60;
    display: flex; justify-content: flex-end;
    backdrop-filter: blur(4px); animation: fadeIn .2s ease;
  }
  .drawer {
    width: 370px; height: 100vh; overflow-y: auto;
    background: var(--surface2); border-left: 1px solid var(--border-glow);
    box-shadow: -20px 0 60px rgba(147,51,234,0.14);
    padding: 30px 26px; animation: slideIn .25s cubic-bezier(0.32,0.72,0,1);
  }
  @keyframes slideIn { from { transform: translateX(40px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
  .drawer-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .drawer-title { font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 0.05em; color: var(--purple-lt); }
  .drawer-close {
    background: var(--surface3); border: 1px solid var(--border); color: var(--muted-lt);
    border-radius: 5px; padding: 4px 10px; font-size: 11px;
    font-family: 'Rajdhani', sans-serif; letter-spacing: 0.1em; transition: all .15s;
  }
  .drawer-close:hover { color: var(--cream); border-color: var(--purple-dim); }
  .drawer-sub { font-size: 12px; color: var(--muted-lt); margin-bottom: 26px; line-height: 1.6; }
  .d-label {
    font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted-lt);
    margin-bottom: 6px; margin-top: 18px;
  }
  .d-value { font-family: 'Rajdhani', sans-serif; font-size: 26px; font-weight: 700; color: var(--cream); margin-bottom: 6px; }
  input[type="range"] { width: 100%; accent-color: var(--purple); cursor: pointer; }
  .d-select {
    width: 100%; padding: 9px 12px; background: var(--surface3);
    border: 1px solid var(--border); border-radius: 6px;
    color: var(--cream); font-family: 'Inter', sans-serif; font-size: 13px;
  }
  .results-section { margin-top: 28px; border-top: 1px solid var(--border); padding-top: 20px; }
  .results-head {
    font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--purple-lt); margin-bottom: 12px;
  }
  .r-item { padding: 10px 0; border-bottom: 1px solid var(--border); cursor: pointer; transition: .15s; }
  .r-item:last-child { border-bottom: none; }
  .r-item:hover .r-name { color: var(--purple-lt); }
  .r-name { font-size: 14px; font-weight: 500; color: var(--cream); margin-bottom: 2px; }
  .r-meta { font-size: 11px; color: var(--muted-lt); }
  .no-results { font-size: 13px; color: var(--muted-lt); font-style: italic; }
  @media (max-width: 600px) { .drawer { width: 100vw; } }
`

export default function GameFinder({ games, onClose, onSelectGame }) {
  const [players, setPlayers] = useState(4)
  const [time, setTime] = useState(60)
  const [genre, setGenre] = useState('Any')

  const results = useMemo(() => {
    return games.filter((g) => {
      const pOk = players >= g.players_min && players <= g.players_max
      const tOk = g.playtime <= time
      const gOk = genre === 'Any' || g.genre === genre
      return pOk && tOk && gOk
    })
  }, [games, players, time, genre])

  return (
    <>
      <style>{styles}</style>
      <div className="drawer-overlay" onClick={onClose}>
        <div className="drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-head">
            <span className="drawer-title">Game Finder</span>
            <button className="drawer-close" onClick={onClose}>✕</button>
          </div>
          <p className="drawer-sub">Tell us about your group and we'll find the best match from our library.</p>

          <div className="d-label">Players at the table</div>
          <div className="d-value">{players}</div>
          <input type="range" min={1} max={8} value={players} onChange={(e) => setPlayers(Number(e.target.value))} />

          <div className="d-label">Time available</div>
          <div className="d-value">{time} min</div>
          <input type="range" min={15} max={120} step={15} value={time} onChange={(e) => setTime(Number(e.target.value))} />

          <div className="d-label">Genre preference</div>
          <select className="d-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c === 'Any' ? 'Any genre' : c}</option>)}
          </select>

          <div className="results-section">
            <div className="results-head">{results.length} match{results.length !== 1 ? 'es' : ''}</div>
            {results.length === 0 && <p className="no-results">Try adjusting your filters.</p>}
            {results.map((g) => (
              <div className="r-item" key={g.id} onClick={() => { onSelectGame(g); onClose() }}>
                <div className="r-name">{g.name}</div>
                <div className="r-meta">{g.players_min}–{g.players_max} players · {g.playtime} min · {g.genre}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
