import { useState, useEffect } from 'react'
import pb from '../../lib/pb'

const EMPTY_FORM = { title: '', time: '', date: '', description: '' }

const styles = `
  .events-grid { display: grid; gap: 10px; }
  .event-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 16px 18px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .event-card-info { flex: 1; }
  .event-card-title { font-size: 15px; font-weight: 500; color: var(--cream); margin-bottom: 4px; }
  .event-card-meta { font-size: 12px; color: var(--muted-lt); }
  .event-card-date {
    font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 700;
    letter-spacing: 0.12em; color: var(--teal);
  }
`

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => { loadEvents() }, [])

  async function loadEvents() {
    setLoading(true)
    try {
      const res = await pb.collection('events').getFullList({ sort: '-date,time', requestKey: null })
      setEvents(res)
    } finally {
      setLoading(false)
    }
  }

  function openAdd() {
    setEditingEvent(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(ev) {
    setEditingEvent(ev)
    setForm({ title: ev.title, time: ev.time, date: ev.date?.slice(0, 10) || '', description: ev.description || '' })
    setFormError('')
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      if (editingEvent) {
        await pb.collection('events').update(editingEvent.id, form)
      } else {
        await pb.collection('events').create(form)
      }
      setModalOpen(false)
      loadEvents()
    } catch (err) {
      setFormError(err?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(ev) {
    if (!confirm(`Delete "${ev.title}"?`)) return
    await pb.collection('events').delete(ev.id)
    loadEvents()
  }

  function fmt(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <>
      <style>{styles}</style>

      <div className="admin-toolbar">
        <div>
          <div className="admin-section-title">Events</div>
          <div className="admin-section-sub">{events.length} event{events.length !== 1 ? 's' : ''}</div>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Event</button>
      </div>

      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : events.length === 0 ? (
        <div className="empty-state">No events yet.</div>
      ) : (
        <div className="events-grid">
          {events.map((ev) => (
            <div className="event-card" key={ev.id}>
              <div className="event-card-info">
                <div className="event-card-title">{ev.title}</div>
                <div className="event-card-meta">
                  <span className="event-card-date">{ev.time && `${ev.time} · `}</span>
                  {fmt(ev.date)}
                  {ev.description && ` — ${ev.description}`}
                </div>
              </div>
              <div className="td-actions">
                <button className="btn-edit" onClick={() => openEdit(ev)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(ev)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <div className="admin-modal-title">{editingEvent ? 'Edit Event' : 'Add Event'}</div>
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="form-field full">
                    <label>Event Name *</label>
                    <input
                      type="text" placeholder="e.g. Catan Night"
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Time *</label>
                    <input
                      type="text" placeholder="e.g. 7:00 PM"
                      value={form.time}
                      onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-field full">
                    <label>Description</label>
                    <input
                      type="text" placeholder="Optional short description"
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                </div>

                {formError && (
                  <div className="form-error">{formError}</div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editingEvent ? 'Save Changes' : 'Add Event'}
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
