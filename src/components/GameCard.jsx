const styles = `
  .game-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-lg); cursor: pointer; position: relative;
    overflow: hidden; transition: transform .2s, border-color .2s, box-shadow .2s;
    display: flex; flex-direction: column;
  }
  .game-card:hover {
    transform: translateY(-3px); border-color: var(--border-glow);
    box-shadow: 0 8px 30px rgba(147,51,234,0.18), 0 0 0 1px rgba(147,51,234,0.1);
  }

  /* Option A: image header */
  .card-img-wrap {
    position: relative; height: 160px; overflow: hidden; flex-shrink: 0;
    background: var(--surface3);
  }
  .card-img-wrap img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform .35s ease;
  }
  .game-card:hover .card-img-wrap img { transform: scale(1.04); }
  .card-img-gradient {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 40%, var(--surface2) 100%);
    pointer-events: none;
  }
  .card-img-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    font-size: 48px; opacity: 0.15;
  }

  /* Card body */
  .card-body { padding: 14px 16px 14px; flex: 1; display: flex; flex-direction: column; }
  .card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 7px; }
  .card-genre-badge {
    font-family: 'Rajdhani', sans-serif; font-size: 9px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--purple-lt);
    background: rgba(147,51,234,0.15); padding: 3px 7px; border-radius: 4px;
    border: 1px solid rgba(147,51,234,0.25);
  }
  .card-shelf { font-family: 'Rajdhani', sans-serif; font-size: 9px; color: var(--muted); letter-spacing: 0.12em; }
  .card-name {
    font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 700;
    letter-spacing: 0.02em; color: var(--cream); margin-bottom: 3px; line-height: 1.1;
  }
  .card-meta { font-size: 11px; color: var(--muted-lt); margin-bottom: 8px; }
  .card-desc {
    font-size: 12px; color: var(--muted-lt); line-height: 1.6;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    flex: 1;
  }
  .card-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 10px; }
  .tag {
    font-size: 10px; padding: 3px 7px; border-radius: 4px;
    border: 1px solid var(--border); color: var(--muted-lt);
    background: var(--surface); letter-spacing: 0.05em;
  }
`

const GENRE_PLACEHOLDER = { Strategy: '♟', Party: '🎲', 'Co-op': '🤝', Family: '🏠', '2-Player': '⚔' }

export default function GameCard({ game, onClick }) {
  const tags = Array.isArray(game.tags) ? game.tags : []

  return (
    <>
      <style>{styles}</style>
      <div className="game-card" onClick={() => onClick(game)}>
        <div className="card-img-wrap">
          {game.image_url ? (
            <>
              <img src={game.image_url} alt={game.name} loading="lazy" />
              <div className="card-img-gradient" />
            </>
          ) : (
            <div className="card-img-placeholder">
              {GENRE_PLACEHOLDER[game.genre] || '🎲'}
            </div>
          )}
        </div>
        <div className="card-body">
          <div className="card-top">
            <span className="card-genre-badge">{game.genre}</span>
            {game.shelf && <span className="card-shelf">SHELF {game.shelf}</span>}
          </div>
          <div className="card-name">{game.name}</div>
          <div className="card-meta">
            {game.players_min}–{game.players_max} players · {game.playtime} min
          </div>
          <div className="card-desc">{game.description}</div>
          {tags.length > 0 && (
            <div className="card-tags">
              {tags.map((t) => <span className="tag" key={t}>{t}</span>)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
