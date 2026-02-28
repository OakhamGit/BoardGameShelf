import { useEffect } from 'react'

const styles = `
  .overlay {
    position: fixed; inset: 0; background: rgba(5,5,12,0.82); z-index: 60;
    display: flex; align-items: center; justify-content: center; padding: 24px;
    backdrop-filter: blur(6px); animation: fadeIn .2s ease;
  }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

  .modal {
    background: var(--surface2); border: 1px solid var(--border-glow);
    border-radius: 16px; max-width: 580px; width: 100%;
    position: relative; overflow: hidden;
    animation: popIn .22s cubic-bezier(0.34,1.4,0.64,1);
    box-shadow: 0 0 60px rgba(147,51,234,0.22), 0 30px 80px rgba(0,0,0,0.7);
    max-height: 90vh; overflow-y: auto;
  }
  @keyframes popIn { from { transform: scale(0.94); opacity: 0 } to { transform: scale(1); opacity: 1 } }

  .modal-img {
    width: 100%; height: 200px; object-fit: cover;
    display: block;
  }
  .modal-img-gradient {
    position: absolute; top: 0; left: 0; right: 0; height: 200px;
    background: linear-gradient(to bottom, transparent 50%, var(--surface2) 100%);
    pointer-events: none;
  }
  .modal-glow {
    position: absolute; top: -80px; right: -80px; width: 220px; height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(147,51,234,0.14) 0%, transparent 70%);
    pointer-events: none;
  }
  .modal-body { padding: 24px 30px 30px; }
  .modal-close {
    position: absolute; top: 12px; right: 12px;
    background: rgba(10,10,18,0.8); border: 1px solid var(--border);
    color: var(--muted-lt); border-radius: 5px; padding: 4px 10px;
    font-size: 11px; font-family: 'Rajdhani', sans-serif; letter-spacing: 0.1em;
    transition: all .15s; z-index: 2;
  }
  .modal-close:hover { color: var(--cream); border-color: var(--purple-dim); }
  .modal-badge {
    font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--purple-lt);
    background: rgba(147,51,234,0.15); border: 1px solid rgba(147,51,234,0.28);
    padding: 4px 10px; border-radius: 4px; display: inline-block; margin-bottom: 12px;
  }
  .modal-title {
    font-family: 'Rajdhani', sans-serif; font-size: 28px; font-weight: 700;
    letter-spacing: 0.02em; color: var(--cream); margin-bottom: 6px;
  }
  .modal-meta { font-size: 13px; color: var(--muted-lt); margin-bottom: 18px; }
  .modal-divider { border: none; border-top: 1px solid var(--border); margin: 0 0 16px; }
  .modal-desc { font-size: 14px; color: var(--cream); line-height: 1.8; }
  .modal-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
  .modal-shelf {
    margin-top: 18px; padding: 13px 15px; background: var(--surface3);
    border: 1px solid var(--border); border-radius: 8px;
    display: flex; align-items: center; gap: 11px;
  }
  .modal-shelf .s-icon { font-size: 18px; }
  .modal-shelf .s-label strong { font-size: 13px; color: var(--cream); display: block; }
  .modal-shelf .s-label span { font-size: 11px; color: var(--muted-lt); }
  .modal-actions { display: flex; gap: 10px; margin-top: 18px; }
  .m-primary {
    flex: 1; padding: 11px; font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
    background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 100%);
    border: none; border-radius: 6px; color: #fff;
    box-shadow: 0 0 18px rgba(147,51,234,0.3); transition: all .2s;
  }
  .m-primary:hover { box-shadow: 0 0 28px rgba(147,51,234,0.5); }
  .m-secondary {
    padding: 11px 16px; border-radius: 6px; background: transparent;
    border: 1px solid var(--border); color: var(--muted-lt);
    font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 12px;
    letter-spacing: 0.1em; text-transform: uppercase; transition: all .15s;
  }
  .m-secondary:hover { border-color: var(--purple-dim); color: var(--cream); }
`

export default function GameModal({ game, onClose }) {
  const tags = Array.isArray(game.tags) ? game.tags : []

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <style>{styles}</style>
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-glow" />
          <button className="modal-close" onClick={onClose}>CLOSE</button>

          {game.image_url && (
            <div style={{ position: 'relative' }}>
              <img className="modal-img" src={game.image_url} alt={game.name} />
              <div className="modal-img-gradient" />
            </div>
          )}

          <div className="modal-body">
            <div className="modal-badge">{game.genre}</div>
            <div className="modal-title">{game.name}</div>
            <div className="modal-meta">
              {game.players_min}–{game.players_max} players · {game.playtime} min
            </div>
            <hr className="modal-divider" />
            <div className="modal-desc">{game.description}</div>
            {tags.length > 0 && (
              <div className="modal-tags">
                {tags.map((t) => <span className="tag" key={t}>{t}</span>)}
              </div>
            )}
            {game.shelf && (
              <div className="modal-shelf">
                <span className="s-icon">📚</span>
                <div className="s-label">
                  <strong>Shelf {game.shelf}</strong>
                  <span>Ask a member of staff if you need help locating it</span>
                </div>
              </div>
            )}
            <div className="modal-actions">
              <a
                href="https://mysterytavern.co.uk/pages/book-a-table"
                target="_blank"
                rel="noreferrer"
                className="m-primary"
                style={{ textAlign: 'center', textDecoration: 'none' }}
              >
                Reserve This Game
              </a>
              {game.shelf && (
                <button className="m-secondary">Shelf {game.shelf}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
