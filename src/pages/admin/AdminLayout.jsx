import { useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const styles = `
  .admin-shell { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); }
  .admin-topbar {
    height: 56px; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; position: sticky; top: 0; z-index: 30;
  }
  .admin-brand { display: flex; align-items: center; gap: 10px; }
  .admin-brand img { height: 26px; }
  .admin-brand span {
    font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; color: var(--purple-lt);
  }
  .admin-nav { display: flex; gap: 4px; }
  .admin-nav-link {
    font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 6px 14px; border-radius: 6px; color: var(--muted-lt);
    border: 1px solid transparent; transition: all .15s; text-decoration: none;
  }
  .admin-nav-link:hover { color: var(--cream); background: var(--surface2); }
  .admin-nav-link.active { color: var(--purple-lt); background: rgba(147,51,234,0.12); border-color: rgba(147,51,234,0.25); }
  .admin-logout {
    font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 600;
    letter-spacing: 0.1em; padding: 5px 12px; border-radius: 6px;
    background: transparent; border: 1px solid var(--border); color: var(--muted-lt); transition: all .15s;
  }
  .admin-logout:hover { color: var(--cream); border-color: var(--purple-dim); }
  .admin-content { flex: 1; padding: 32px 28px; max-width: 1100px; width: 100%; margin: 0 auto; }

  /* ── Shared admin styles (available to all admin pages) ── */
  .admin-section-title {
    font-family: 'Rajdhani', sans-serif; font-size: 24px; font-weight: 700; color: var(--cream); margin-bottom: 4px;
  }
  .admin-section-sub { font-size: 13px; color: var(--muted-lt); margin-bottom: 24px; }
  .admin-toolbar {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 24px; gap: 16px;
  }

  /* Buttons */
  .btn-primary {
    font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase; padding: 10px 22px;
    border-radius: 6px; background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 100%);
    border: none; color: #fff; box-shadow: 0 0 16px rgba(147,51,234,0.3);
    transition: all .2s; white-space: nowrap;
  }
  .btn-primary:hover { box-shadow: 0 0 26px rgba(147,51,234,0.5); transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
  .btn-secondary {
    font-family: 'Rajdhani', sans-serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.1em; padding: 9px 18px; border-radius: 6px;
    background: transparent; border: 1px solid var(--border); color: var(--muted-lt); transition: all .15s;
  }
  .btn-secondary:hover { border-color: var(--purple-dim); color: var(--cream); }
  .btn-secondary:disabled { opacity: 0.55; cursor: not-allowed; }
  .btn-danger {
    font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 600;
    letter-spacing: 0.08em; padding: 6px 12px; border-radius: 4px;
    background: transparent; border: 1px solid rgba(239,68,68,0.3); color: #f87171; transition: all .15s;
  }
  .btn-danger:hover { background: rgba(239,68,68,0.1); border-color: #f87171; }
  .btn-edit {
    font-family: 'Rajdhani', sans-serif; font-size: 11px; font-weight: 600;
    letter-spacing: 0.08em; padding: 6px 12px; border-radius: 4px;
    background: transparent; border: 1px solid var(--border); color: var(--muted-lt); transition: all .15s;
  }
  .btn-edit:hover { border-color: var(--purple-dim); color: var(--cream); }
  .td-actions { display: flex; gap: 6px; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(5,5,12,0.85); z-index: 60;
    display: flex; align-items: center; justify-content: center; padding: 24px;
    backdrop-filter: blur(6px);
  }
  .admin-modal {
    background: var(--surface2); border: 1px solid var(--border-glow);
    border-radius: 16px; width: 100%; max-width: 680px; max-height: 90vh;
    overflow-y: auto; box-shadow: 0 0 60px rgba(147,51,234,0.18);
  }
  .admin-modal-head {
    padding: 20px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; background: var(--surface2); z-index: 1;
  }
  .admin-modal-title {
    font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 700; color: var(--cream);
  }
  .admin-modal-body { padding: 24px; }

  /* Form */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-field { display: flex; flex-direction: column; gap: 6px; }
  .form-field.full { grid-column: 1 / -1; }
  .form-field label {
    font-family: 'Rajdhani', sans-serif; font-size: 10px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted-lt);
  }
  .form-field input, .form-field textarea, .form-field select {
    padding: 9px 12px; background: var(--surface3); border: 1px solid var(--border);
    border-radius: 6px; color: var(--cream); font-family: 'Inter', sans-serif;
    font-size: 13px; transition: border-color .2s; width: 100%;
  }
  .form-field input:focus, .form-field textarea:focus, .form-field select:focus {
    outline: none; border-color: var(--purple-dim);
  }
  .form-field textarea { resize: vertical; min-height: 80px; }
  .form-field .hint { font-size: 11px; color: var(--muted); }
  .form-error {
    margin-top: 14px; padding: 10px 14px; background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; font-size: 13px; color: #f87171;
  }
  .form-actions {
    display: flex; gap: 10px; justify-content: flex-end;
    margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border);
  }

  /* Empty / loading */
  .empty-state {
    text-align: center; padding: 60px 20px; color: var(--muted-lt);
    font-size: 14px; font-style: italic;
  }
`

export default function AdminLayout() {
  const { isAuthed, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthed) navigate('/admin/login')
  }, [isAuthed, navigate])

  if (!isAuthed) return null

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <>
      <style>{styles}</style>
      <div className="admin-shell">
        <div className="admin-topbar">
          <div className="admin-brand">
            <img
              src="https://mysterytavern.co.uk/cdn/shop/files/tavernlogo-trans.png?v=1740138228&width=260"
              alt="Mystery Tavern"
            />
            <span>Admin</span>
          </div>
          <nav className="admin-nav">
            <NavLink to="/admin/games" className="admin-nav-link">Games</NavLink>
            <NavLink to="/admin/events" className="admin-nav-link">Events</NavLink>
          </nav>
          <button className="admin-logout" onClick={handleLogout}>Sign Out</button>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </>
  )
}
