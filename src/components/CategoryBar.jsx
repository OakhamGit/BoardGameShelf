const GENRE_ICONS = { Strategy: '♟', Party: '🎲', 'Co-op': '🤝', Family: '🏠', '2-Player': '⚔' }

const styles = `
  .cat-bar {
    max-width: 1280px; margin: 0 auto; padding: 0 32px 24px;
    display: flex; gap: 8px; overflow-x: auto;
    border-bottom: 1px solid var(--border); margin-bottom: 28px;
  }
  .cat-bar::-webkit-scrollbar { height: 0; }
  .cat-btn {
    font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.14em; text-transform: uppercase; white-space: nowrap;
    padding: 8px 18px; border-radius: 6px; background: transparent;
    border: 1px solid var(--border); color: var(--muted-lt); transition: all .2s;
    display: flex; align-items: center; gap: 6px;
  }
  .cat-btn:hover { border-color: var(--purple-dim); color: var(--cream); }
  .cat-btn.active {
    background: linear-gradient(135deg, rgba(147,51,234,0.22) 0%, rgba(219,39,119,0.12) 100%);
    border-color: var(--purple); color: var(--purple-lt);
    box-shadow: 0 0 14px rgba(147,51,234,0.2);
  }
  @media (max-width: 600px) { .cat-bar { padding-left: 16px; padding-right: 16px; } }
`

const CATEGORIES = ['All', 'Strategy', 'Party', 'Co-op', 'Family', '2-Player']

export default function CategoryBar({ active, onChange }) {
  return (
    <>
      <style>{styles}</style>
      <div className="cat-bar">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`cat-btn${active === c ? ' active' : ''}`}
            onClick={() => onChange(c)}
          >
            {c !== 'All' && <span>{GENRE_ICONS[c]}</span>}
            {c}
          </button>
        ))}
      </div>
    </>
  )
}
