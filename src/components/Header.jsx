const NAV_LINKS = [
  { label: 'Home', href: 'https://mysterytavern.co.uk' },
  { label: 'Store', href: 'https://mysterytavern.co.uk/collections' },
  { label: 'Events', href: 'https://mysterytavern.co.uk/pages/events' },
  { label: 'Contact', href: 'https://mysterytavern.co.uk/pages/contact' },
]

const styles = `
  header {
    position: sticky; top: 0; z-index: 40;
    background: rgba(10,10,18,0.92);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(16px);
  }
  .header-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 32px;
    display: flex; align-items: center; justify-content: space-between; height: 64px;
  }
  .logo-wrap { display: flex; align-items: center; gap: 12px; }
  .logo-wrap img { height: 34px; }
  .logo-label {
    font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 500;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted-lt);
  }
  .logo-label strong { display: block; color: var(--purple-lt); font-size: 15px; font-weight: 700; }
  .header-right { display: flex; align-items: center; gap: 6px; }
  .nav-pill {
    font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.1em; padding: 6px 14px; border-radius: 20px;
    background: transparent; border: 1px solid var(--border); color: var(--muted-lt);
    transition: all .2s; text-decoration: none; display: inline-block;
  }
  .nav-pill:hover { border-color: var(--purple-dim); color: var(--cream); }
  .finder-btn {
    font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.12em; padding: 8px 20px; border-radius: 20px;
    background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 100%);
    border: none; color: #fff; box-shadow: 0 0 20px rgba(147,51,234,0.4); transition: all .2s;
  }
  .finder-btn:hover { box-shadow: 0 0 30px rgba(147,51,234,0.65); transform: translateY(-1px); }
  @media (max-width: 600px) {
    .header-inner { padding-left: 16px; padding-right: 16px; }
    .nav-pill { display: none; }
  }
`

export default function Header({ onFinderOpen }) {
  return (
    <>
      <style>{styles}</style>
      <header>
        <div className="header-inner">
          <div className="logo-wrap">
            <img
              src="https://mysterytavern.co.uk/cdn/shop/files/tavernlogo-trans.png?v=1740138228&width=260"
              alt="Mystery Tavern"
            />
            <div className="logo-label">
              <strong>Mystery Tavern</strong>
              Board Game Menu
            </div>
          </div>
          <div className="header-right">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="nav-pill" target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
            <button className="finder-btn" onClick={onFinderOpen}>Find a Game →</button>
          </div>
        </div>
      </header>
    </>
  )
}
