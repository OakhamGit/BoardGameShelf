import { useState, useEffect } from 'react'
import pb from '../../lib/pb'

const GENRES = ['Strategy', 'Party', 'Co-op', 'Family', '2-Player']

const EMPTY_FORM = {
  name: '', players_min: 2, players_max: 4, playtime: 60,
  genre: 'Strategy', shelf: '', description: '', tags: '', image_url: '', bgg_id: '',
}

const styles = `
  /* Games table */
  .games-table { width: 100%; border-collapse: collapse; }
  .games-table th {
    font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted-lt);
    padding: 8px 12px; text-align: left; border-bottom: 1px solid var(--border);
  }
  .games-table td {
    padding: 12px; border-bottom: 1px solid var(--border);
    font-size: 13px; color: var(--cream); vertical-align: middle;
  }
  .games-table tr:hover td { background: rgba(255,255,255,0.02); }
  .game-thumb { width: 44px; height: 44px; border-radius: 4px; object-fit: cover; border: 1px solid var(--border); }
  .game-thumb-placeholder {
    width: 44px; height: 44px; border-radius: 4px; background: var(--surface3);
    border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
    font-size: 20px; opacity: 0.4;
  }
  .tag-pill {
    display: inline-block; font-size: 10px; padding: 2px 6px; border-radius: 3px;
    border: 1px solid var(--border); color: var(--muted-lt); margin-right: 3px;
  }

  /* BGG search */
  .bgg-section {
    margin-bottom: 24px; padding: 16px; background: var(--surface3);
    border: 1px solid var(--border); border-radius: 8px;
  }
  .bgg-section-title {
    font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--purple-lt); margin-bottom: 10px;
  }
  .bgg-search-row { display: flex; gap: 8px; }
  .bgg-search-row input {
    flex: 1; padding: 9px 12px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 6px;
    color: var(--cream); font-family: 'Inter', sans-serif; font-size: 13px;
  }
  .bgg-search-row input:focus { outline: none; border-color: var(--purple-dim); }
  .bgg-results { margin-top: 10px; max-height: 200px; overflow-y: auto; }
  .bgg-result-item {
    padding: 8px 10px; border-radius: 5px; cursor: pointer;
    display: flex; align-items: center; justify-content: space-between; transition: background .15s;
  }
  .bgg-result-item:hover { background: var(--surface2); }
  .bgg-result-name { font-size: 13px; color: var(--cream); }
  .bgg-result-year { font-size: 11px; color: var(--muted-lt); }
  .bgg-status { font-size: 12px; color: var(--muted-lt); margin-top: 8px; font-style: italic; }
  .bgg-imported {
    display: flex; gap: 10px; align-items: center; margin-top: 10px;
    padding: 8px 10px; background: rgba(147,51,234,0.1); border-radius: 5px;
  }
  .bgg-imported img { width: 36px; height: 36px; object-fit: cover; border-radius: 3px; }
  .bgg-imported span { font-size: 12px; color: var(--purple-lt); }
`

export default function AdminGames() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // BGG search state
  const [bggQuery, setBggQuery] = useState('')
  const [bggResults, setBggResults] = useState([])
  const [bggSearching, setBggSearching] = useState(false)
  const [bggStatus, setBggStatus] = useState('')

  useEffect(() => {
    loadGames()
  }, [])

  async function loadGames() {
    setLoading(true)
    try {
      const res = await pb.collection('games').getFullList({ sort: 'name', requestKey: null })
      setGames(res)
    } finally {
      setLoading(false)
    }
  }

  function openAdd() {
    setEditingGame(null)
    setForm(EMPTY_FORM)
    setBggQuery('')
    setBggResults([])
    setBggStatus('')
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(game) {
    setEditingGame(game)
    setForm({
      name: game.name,
      players_min: game.players_min,
      players_max: game.players_max,
      playtime: game.playtime,
      genre: game.genre,
      shelf: game.shelf || '',
      description: game.description || '',
      tags: Array.isArray(game.tags) ? game.tags.join(', ') : '',
      image_url: game.image_url || '',
      bgg_id: game.bgg_id || '',
    })
    setBggQuery('')
    setBggResults([])
    setBggStatus('')
    setFormError('')
    setModalOpen(true)
  }

  async function handleBggSearch(e) {
    e.preventDefault()
    if (!bggQuery.trim()) return
    setBggSearching(true)
    setBggResults([])
    setBggStatus('Searching BGG…')
    try {
      const res = await fetch(
        `${import.meta.env.VITE_PB_URL}/api/custom/bgg/search/${encodeURIComponent(bggQuery)}`,
        { headers: { Authorization: `Bearer ${pb.authStore.token}` } }
      )
      const data = await res.json()
      setBggResults(data.results || [])
      setBggStatus(data.results?.length ? '' : 'No results found.')
    } catch {
      setBggStatus('Search failed.')
    } finally {
      setBggSearching(false)
    }
  }

  async function handleBggImport(bggId) {
    setBggStatus('Importing game data…')
    setBggResults([])
    try {
      const res = await fetch(
        `${import.meta.env.VITE_PB_URL}/api/custom/bgg/thing/${bggId}`,
        { headers: { Authorization: `Bearer ${pb.authStore.token}` } }
      )
      const data = await res.json()
      setForm((prev) => ({
        ...prev,
        name: data.name || prev.name,
        description: data.description || prev.description,
        players_min: data.minplayers || prev.players_min,
        players_max: data.maxplayers || prev.players_max,
        playtime: data.maxplaytime || data.minplaytime || prev.playtime,
        image_url: data.image || data.thumbnail || prev.image_url,
        bgg_id: bggId,
      }))
      setBggStatus(`Imported: ${data.name}`)
    } catch {
      setBggStatus('Import failed.')
    }
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const payload = {
        ...form,
        players_min: Number(form.players_min),
        players_max: Number(form.players_max),
        playtime: Number(form.playtime),
        bgg_id: form.bgg_id ? Number(form.bgg_id) : null,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      }
      if (editingGame) {
        await pb.collection('games').update(editingGame.id, payload)
      } else {
        await pb.collection('games').create(payload)
      }
      setModalOpen(false)
      loadGames()
    } catch (err) {
      setFormError(err?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(game) {
    if (!confirm(`Delete "${game.name}"? This cannot be undone.`)) return
    await pb.collection('games').delete(game.id)
    loadGames()
  }

  return (
    <>
      <style>{styles}</style>

      <div className="admin-toolbar">
        <div>
          <div className="admin-section-title">Games</div>
          <div className="admin-section-sub">{games.length} game{games.length !== 1 ? 's' : ''} in library</div>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Game</button>
      </div>

      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : games.length === 0 ? (
        <div className="empty-state">No games yet. Add your first game.</div>
      ) : (
        <table className="games-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Genre</th>
              <th>Players</th>
              <th>Time</th>
              <th>Shelf</th>
              <th>Tags</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {games.map((g) => (
              <tr key={g.id}>
                <td>
                  {g.image_url
                    ? <img className="game-thumb" src={g.image_url} alt={g.name} />
                    : <div className="game-thumb-placeholder">🎲</div>
                  }
                </td>
                <td style={{ fontWeight: 500 }}>{g.name}</td>
                <td style={{ color: 'var(--muted-lt)' }}>{g.genre}</td>
                <td style={{ color: 'var(--muted-lt)' }}>{g.players_min}–{g.players_max}</td>
                <td style={{ color: 'var(--muted-lt)' }}>{g.playtime}m</td>
                <td style={{ color: 'var(--muted-lt)', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.08em' }}>{g.shelf || '—'}</td>
                <td>
                  {Array.isArray(g.tags) && g.tags.slice(0, 2).map((t) => (
                    <span className="tag-pill" key={t}>{t}</span>
                  ))}
                </td>
                <td>
                  <div className="td-actions">
                    <button className="btn-edit" onClick={() => openEdit(g)}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(g)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <div className="admin-modal-title">{editingGame ? 'Edit Game' : 'Add Game'}</div>
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
            <div className="admin-modal-body">

              {/* BGG Search */}
              {!editingGame && (
                <div className="bgg-section">
                  <div className="bgg-section-title">Import from BoardGameGeek</div>
                  <form className="bgg-search-row" onSubmit={handleBggSearch}>
                    <input
                      type="text"
                      placeholder="Search BGG (e.g. Catan)"
                      value={bggQuery}
                      onChange={(e) => setBggQuery(e.target.value)}
                    />
                    <button className="btn-secondary" type="submit" disabled={bggSearching}>
                      {bggSearching ? '…' : 'Search'}
                    </button>
                  </form>
                  {bggResults.length > 0 && (
                    <div className="bgg-results">
                      {bggResults.map((r) => (
                        <div className="bgg-result-item" key={r.id} onClick={() => handleBggImport(r.id)}>
                          <span className="bgg-result-name">{r.name}</span>
                          <span className="bgg-result-year">{r.year}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {bggStatus && (
                    <div className="bgg-status">
                      {bggStatus}
                      {form.image_url && bggStatus.startsWith('Imported') && (
                        <div className="bgg-imported">
                          <img src={form.image_url} alt="" />
                          <span>Image ready</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Game form */}
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="form-field full">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Min Players *</label>
                    <input
                      type="number" min={1} max={20}
                      value={form.players_min}
                      onChange={(e) => handleFormChange('players_min', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Max Players *</label>
                    <input
                      type="number" min={1} max={20}
                      value={form.players_max}
                      onChange={(e) => handleFormChange('players_max', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Playtime (min) *</label>
                    <input
                      type="number" min={5}
                      value={form.playtime}
                      onChange={(e) => handleFormChange('playtime', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Genre *</label>
                    <select
                      value={form.genre}
                      onChange={(e) => handleFormChange('genre', e.target.value)}
                    >
                      {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Shelf Location</label>
                    <input
                      type="text" placeholder="e.g. A3"
                      value={form.shelf}
                      onChange={(e) => handleFormChange('shelf', e.target.value)}
                    />
                  </div>
                  <div className="form-field full">
                    <label>Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                    />
                  </div>
                  <div className="form-field full">
                    <label>Tags</label>
                    <input
                      type="text"
                      placeholder="e.g. Quick, Bluffing, Team play"
                      value={form.tags}
                      onChange={(e) => handleFormChange('tags', e.target.value)}
                    />
                    <span className="hint">Comma-separated</span>
                  </div>
                  <div className="form-field full">
                    <label>Image URL</label>
                    <input
                      type="url"
                      placeholder="Auto-filled from BGG import"
                      value={form.image_url}
                      onChange={(e) => handleFormChange('image_url', e.target.value)}
                    />
                  </div>
                </div>

                {formError && (
                  <div className="form-error">{formError}</div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editingGame ? 'Save Changes' : 'Add Game'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
