const styles = `
  .hero {
    max-width: 1280px; margin: 0 auto; padding: 52px 32px 36px;
    display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: start;
  }
  .hero-eyebrow {
    font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.25em; text-transform: uppercase; color: var(--purple-lt);
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .hero-eyebrow::after { content: ''; width: 50px; height: 1px; background: var(--purple-dim); }
  .hero h1 {
    font-family: 'Rajdhani', sans-serif; font-size: clamp(30px, 4.5vw, 50px);
    font-weight: 700; line-height: 1.05; letter-spacing: 0.02em; color: var(--cream);
  }
  .hero h1 em { font-style: normal; color: var(--purple-lt); }
  .hero-sub { margin-top: 12px; font-size: 14px; color: var(--muted-lt); line-height: 1.7; max-width: 400px; }
  .hero-actions { display: flex; gap: 10px; margin-top: 22px; }
  .cta-primary {
    font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 13px;
    letter-spacing: 0.12em; padding: 10px 24px; border-radius: 6px;
    background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 100%);
    border: none; color: #fff; box-shadow: 0 0 22px rgba(147,51,234,0.35); transition: all .2s;
  }
  .cta-primary:hover { box-shadow: 0 0 34px rgba(147,51,234,0.55); transform: translateY(-1px); }
  .cta-secondary {
    font-family: 'Rajdhani', sans-serif; font-weight: 600; font-size: 13px;
    letter-spacing: 0.1em; padding: 10px 22px; border-radius: 6px;
    background: transparent; border: 1px solid var(--border); color: var(--muted-lt); transition: all .2s;
  }
  .cta-secondary:hover { border-color: var(--purple-dim); color: var(--cream); }

  .events-box {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 20px; min-width: 215px;
  }
  .panel-title {
    font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--purple-lt);
    margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid var(--border);
  }
  .event-row {
    display: flex; justify-content: space-between; align-items: baseline;
    padding: 7px 0; border-bottom: 1px solid var(--border);
  }
  .event-row:last-child { border-bottom: none; padding-bottom: 0; }
  .event-time { font-family: 'Rajdhani', sans-serif; font-size: 11px; color: var(--teal); letter-spacing: 0.08em; }
  .event-name { font-size: 12px; color: var(--muted-lt); }
  .events-empty { font-size: 12px; color: var(--muted); font-style: italic; }
  @media (max-width: 900px) { .hero { grid-template-columns: 1fr; } .events-box { display: none; } }
  @media (max-width: 600px) { .hero { padding-left: 16px; padding-right: 16px; } }
`

export default function Hero({ events, onFinderOpen }) {
  const today = new Date().toISOString().slice(0, 10)
  const todayEvents = events.filter((e) => e.date?.slice(0, 10) === today)

  return (
    <>
      <style>{styles}</style>
      <div className="hero">
        <div>
          <div className="hero-eyebrow">Tonight's Library</div>
          <h1>What are you<br /><em>playing tonight?</em></h1>
          <p className="hero-sub">
            Browse our full game library, check out staff picks, or use the Game Finder
            to match the perfect game to your group.
          </p>
          <div className="hero-actions">
            <button className="cta-primary" onClick={onFinderOpen}>Find a Game for Your Group</button>
            <a href="https://mysterytavern.co.uk/pages/book-a-table" target="_blank" rel="noreferrer" className="cta-secondary">Book a Table</a>
          </div>
        </div>
        <div className="events-box">
          <div className="panel-title">Tonight's Events</div>
          {todayEvents.length === 0 ? (
            <p className="events-empty">No events scheduled tonight.</p>
          ) : (
            todayEvents.map((e) => (
              <div className="event-row" key={e.id}>
                <span className="event-time">{e.time}</span>
                <span className="event-name">{e.title}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
