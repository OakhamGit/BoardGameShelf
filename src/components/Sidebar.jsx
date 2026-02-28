const styles = `
  .sidebar { display: flex; flex-direction: column; gap: 16px; }
  .sidebar-panel {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 18px;
  }
  .panel-title {
    font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--purple-lt);
    margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid var(--border);
  }
  .pick-item {
    padding: 10px 0; border-bottom: 1px solid var(--border);
    cursor: pointer; transition: .15s;
  }
  .pick-item:last-child { border-bottom: none; padding-bottom: 0; }
  .pick-item:hover .pick-name { color: var(--purple-lt); }
  .pick-name { font-size: 14px; font-weight: 500; color: var(--cream); margin-bottom: 3px; }
  .pick-note { font-size: 11px; color: var(--muted-lt); line-height: 1.55; font-style: italic; }
  .picks-empty { font-size: 12px; color: var(--muted); font-style: italic; }
  .book-panel {
    background: linear-gradient(135deg, #120a1e 0%, #0d1a24 100%);
    border-color: var(--border-glow);
  }
  .book-desc { font-size: 12px; color: var(--muted-lt); line-height: 1.65; margin-bottom: 14px; }
  .book-btn {
    width: 100%; padding: 11px; font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
    background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 100%);
    border: none; border-radius: 6px; color: #fff;
    box-shadow: 0 0 18px rgba(147,51,234,0.3); transition: all .2s;
    display: block; text-align: center; text-decoration: none;
  }
  .book-btn:hover { box-shadow: 0 0 28px rgba(147,51,234,0.5); transform: translateY(-1px); }
  @media (max-width: 900px) { .sidebar { display: grid; grid-template-columns: 1fr 1fr; } }
  @media (max-width: 600px) { .sidebar { grid-template-columns: 1fr; } }
`

export default function Sidebar({ staffPicks, onSelectGame }) {
  return (
    <>
      <style>{styles}</style>
      <aside className="sidebar">
        <div className="sidebar-panel">
          <div className="panel-title">Staff Picks</div>
          {staffPicks.length === 0 ? (
            <p className="picks-empty">No staff picks yet.</p>
          ) : (
            staffPicks.map((p) => (
              <div className="pick-item" key={p.id} onClick={() => onSelectGame(p.expand?.game)}>
                <div className="pick-name">{p.expand?.game?.name}</div>
                <div className="pick-note">"{p.note}"</div>
              </div>
            ))
          )}
        </div>
        <div className="sidebar-panel book-panel">
          <div className="panel-title">Reserve a Table</div>
          <p className="book-desc">Got a game in mind? Book a table for your group and we'll have it ready and waiting.</p>
          <a
            href="https://mysterytavern.co.uk/pages/book-a-table"
            target="_blank"
            rel="noreferrer"
            className="book-btn"
          >
            Book a Table
          </a>
        </div>
      </aside>
    </>
  )
}
