import { useState, useMemo, useEffect } from 'react'
import pb from '../lib/pb'
import Header from '../components/Header'
import Hero from '../components/Hero'
import CategoryBar from '../components/CategoryBar'
import GameCard from '../components/GameCard'
import GameModal from '../components/GameModal'
import GameFinder from '../components/GameFinder'
import Sidebar from '../components/Sidebar'

const styles = `
  .main-wrap {
    max-width: 1280px; margin: 0 auto; padding: 0 32px 60px;
    display: grid; grid-template-columns: 1fr 255px; gap: 28px;
  }
  .count-bar {
    font-family: 'Rajdhani', sans-serif; font-size: 12px; color: var(--muted);
    margin-bottom: 16px; letter-spacing: 0.06em;
  }
  .count-bar strong { color: var(--purple-lt); }
  .games-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 12px;
  }
  .loading-state {
    display: flex; align-items: center; justify-content: center;
    padding: 80px 32px; color: var(--muted-lt); font-size: 14px;
    font-family: 'Rajdhani', sans-serif; letter-spacing: 0.1em;
  }
  .error-state {
    max-width: 1280px; margin: 40px auto; padding: 0 32px;
    color: var(--muted-lt); font-size: 14px;
  }
  footer {
    border-top: 1px solid var(--border); padding: 18px 32px;
    display: flex; justify-content: space-between; align-items: center;
    max-width: 1280px; margin: 0 auto; font-size: 12px; color: var(--muted);
  }
  .footer-links { display: flex; gap: 18px; align-items: center; }
  .footer-links a { color: var(--muted); }
  .footer-links a:hover { color: var(--muted-lt); }
  .bgg-badge { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--muted); }
  .bgg-badge img { height: 20px; opacity: 0.7; }
  @media (max-width: 900px) { .main-wrap { grid-template-columns: 1fr; } }
  @media (max-width: 600px) { .main-wrap { padding-left: 16px; padding-right: 16px; } footer { padding-left: 16px; padding-right: 16px; } }
`

export default function Menu() {
  const [games, setGames] = useState([])
  const [events, setEvents] = useState([])
  const [staffPicks, setStaffPicks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedGame, setSelectedGame] = useState(null)
  const [finderOpen, setFinderOpen] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [gamesRes, eventsRes, picksRes] = await Promise.all([
          pb.collection('games').getFullList({ sort: 'name', requestKey: null }),
          pb.collection('events').getFullList({ sort: 'time', requestKey: null }),
          pb.collection('staff_picks').getFullList({ sort: 'sort_order', expand: 'game', requestKey: null }),
        ])
        setGames(gamesRes)
        setEvents(eventsRes)
        setStaffPicks(picksRes)
      } catch (err) {
        setError('Could not load the game library. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const displayedGames = useMemo(() => {
    if (activeCategory === 'All') return games
    return games.filter((g) => g.genre === activeCategory)
  }, [games, activeCategory])

  if (loading) return <div className="loading-state">Loading library…</div>
  if (error) return <div className="error-state">{error}</div>

  return (
    <>
      <style>{styles}</style>
      <Header onFinderOpen={() => setFinderOpen(true)} />

      <Hero events={events} onFinderOpen={() => setFinderOpen(true)} />

      <CategoryBar active={activeCategory} onChange={setActiveCategory} />

      <div className="main-wrap">
        <div>
          <div className="count-bar">
            <strong>{displayedGames.length}</strong> game{displayedGames.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' ? ` · ${activeCategory}` : ' in the library'}
          </div>
          <div className="games-grid">
            {displayedGames.map((g) => (
              <GameCard key={g.id} game={g} onClick={setSelectedGame} />
            ))}
          </div>
        </div>

        <Sidebar staffPicks={staffPicks} onSelectGame={setSelectedGame} />
      </div>

      <footer>
        <span>© Mystery Tavern</span>
        <div className="footer-links">
          <a href="https://mysterytavern.co.uk/pages/privacy-policy" target="_blank" rel="noreferrer">Privacy</a>
          <a href="https://mysterytavern.co.uk/pages/terms" target="_blank" rel="noreferrer">Terms</a>
          <a href="https://boardgamegeek.com" target="_blank" rel="noreferrer" className="bgg-badge">
            <img src="https://cf.geekdo-images.com/static/img/bgg_powered_by.png" alt="Powered by BoardGameGeek" />
          </a>
        </div>
      </footer>

      {selectedGame && (
        <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}

      {finderOpen && (
        <GameFinder
          games={games}
          onClose={() => setFinderOpen(false)}
          onSelectGame={setSelectedGame}
        />
      )}
    </>
  )
}
