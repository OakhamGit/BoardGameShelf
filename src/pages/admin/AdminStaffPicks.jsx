import { useState, useEffect } from 'react'
import pb from '../../lib/pb'

const EMPTY_FORM = { game: '', note: '', sort_order: 0 }

const styles = `
  .picks-grid { display: grid; gap: 10px; }
  .pick-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 16px 18px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .pick-thumb { width: 44px; height: 44px; border-radius: 4px; object-fit: cover; border: 1px solid var(--border); flex-shrink: 0; }
  .pick-thumb-placeholder {
    width: 44px; height: 44px; border-radius: 4px; background: var(--surface3);
    border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
    font-size: 20px; opacity: 0.4; flex-shrink: 0;
  }
  .pick-info { flex: 1; }
  .pick-name { font-size: 15px; font-weight: 500; color: var(--cream); margin-bottom: 4px; }
  .pick-note { font-size: 12px; color: var(--muted-lt); font-style: italic; }
  .pick-order {
    font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.12em; color: var(--teal); margin-right: 8px;
  }
`

export default function AdminStaffPicks() {
  const [picks, setPicks] = useState([])
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPick, setEditingPick] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [picksRes, gamesRes] = await Promise.all([
        pb.collection('staff_picks').getFullList({ sort: 'sort_order', expand: 'game', requestKey: null }),
        pb.collection('games').getFullList({ sort: 'name', requestKey: null }),
      ])
      setPicks(picksRes)
      setGames(gamesRes)
    } finally {
      setLoading(false)
    }
  }

  function openAdd() {
    setEditingPick(null)
    setForm({ game: '', note: '', sort_order: picks.length + 1 })
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(pick) {
    setEditingPick(pick)
    setForm({ game: pick.game, note: pick.note || '', sort_order: pick.sort_order || 0 })
    setFormError('')
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const payload = { ...form, sort_order: Number(form.sort_order) }
      if (editingPick) {
        await pb.collection('staff_picks').update(editingPick.id, payload)
      } else {
        await pb.collection('staff_picks').create(payload)
      }
      setModalOpen(false)
      loadAll()
    } catch (err) {
      setFormError(err?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(pick) {
    const name = pick.expand?.game?.name || 'this pick'
    if (!confirm(`Remove "${name}" from staff picks?`)) return
    await pb.collection('staff_picks').delete(pick.id)
    loadAll()
  }

  return (
    <>
      <style>{styles}</style>

      <div className="admin-toolbar">
        <div>
          <div className="admin-section-title">Staff Picks</div>
          <div className="admin-section-sub">{picks.length} pick{picks.length !== 1 ? 's' : ''} · shown in sidebar</div>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Pick</button>
      </div>

      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : picks.length === 0 ? (
        <div className="empty-state">No staff picks yet.</div>
      ) : (
        <div className="picks-grid">
          {picks.map((pick) => {
            const game = pick.expand?.game
            return (
              <div className="pick-card" key={pick.id}>
                {game?.image_url
                  ? <img className="pick-thumb" src={game.image_url} alt={game.name} />
                  : <div className="pick-thumb-placeholder">🎲</div>
                }
                <div className="pick-info">
                  <div className="pick-name">{game?.name || '—'}</div>
                  {pick.note && <div className="pick-note">"{pick.note}"</div>}
                </div>
                <span className="pick-order">#{pick.sort_order}</span>
                <div className="td-actions">
                  <button className="btn-edit" onClick={() => openEdit(pick)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(pick)}>Remove</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <div className="admin-modal-title">{editingPick ? 'Edit Staff Pick' : 'Add Staff Pick'}</div>
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="form-field full">
                    <label>Game *</label>
                    <select
                      value={form.game}
                      onChange={(e) => setForm((p) => ({ ...p, game: e.target.value }))}
                      required
                    >
                      <option value="">— Select a game —</option>
                      {games.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field full">
                    <label>Staff Note</label>
                    <input
                      type="text"
                      placeholder="e.g. A must-play for strategy fans"
                      value={form.note}
                      onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                    />
                  </div>
                  <div className="form-field">
                    <label>Display Order</label>
                    <input
                      type="number" min={1}
                      value={form.sort_order}
                      onChange={(e) => setForm((p) => ({ ...p, sort_order: e.target.value }))}
                    />
                    <span className="hint">Lower numbers appear first</span>
                  </div>
                </div>

                {formError && <div className="form-error">{formError}</div>}

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editingPick ? 'Save Changes' : 'Add Pick'}
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
