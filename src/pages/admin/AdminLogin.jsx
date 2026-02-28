import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const styles = `
  .login-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg); padding: 24px;
  }
  .login-card {
    background: var(--surface2); border: 1px solid var(--border-glow);
    border-radius: 16px; padding: 40px; width: 100%; max-width: 380px;
    box-shadow: 0 0 60px rgba(147,51,234,0.12);
  }
  .login-logo {
    display: flex; align-items: center; gap: 10px; margin-bottom: 28px;
  }
  .login-logo img { height: 30px; }
  .login-logo span {
    font-family: 'Rajdhani', sans-serif; font-size: 13px; font-weight: 700;
    letter-spacing: 0.12em; color: var(--purple-lt);
  }
  .login-title {
    font-family: 'Rajdhani', sans-serif; font-size: 22px; font-weight: 700;
    color: var(--cream); margin-bottom: 6px;
  }
  .login-sub { font-size: 13px; color: var(--muted-lt); margin-bottom: 28px; }
  .field { margin-bottom: 16px; }
  .field label {
    display: block; font-family: 'Rajdhani', sans-serif; font-size: 10px;
    font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--muted-lt); margin-bottom: 6px;
  }
  .field input {
    width: 100%; padding: 10px 14px; background: var(--surface3);
    border: 1px solid var(--border); border-radius: 6px;
    color: var(--cream); font-family: 'Inter', sans-serif; font-size: 14px;
    transition: border-color .2s;
  }
  .field input:focus { outline: none; border-color: var(--purple-dim); }
  .login-btn {
    width: 100%; padding: 12px; font-family: 'Rajdhani', sans-serif; font-weight: 700;
    font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase;
    background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 100%);
    border: none; border-radius: 6px; color: #fff;
    box-shadow: 0 0 20px rgba(147,51,234,0.3); transition: all .2s; margin-top: 8px;
  }
  .login-btn:hover:not(:disabled) { box-shadow: 0 0 32px rgba(147,51,234,0.5); transform: translateY(-1px); }
  .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .login-error {
    margin-top: 14px; padding: 10px 14px; background: rgba(219,39,119,0.12);
    border: 1px solid rgba(219,39,119,0.3); border-radius: 6px;
    font-size: 13px; color: #f9a8d4;
  }
`

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/admin/games')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <img
              src="https://mysterytavern.co.uk/cdn/shop/files/tavernlogo-trans.png?v=1740138228&width=260"
              alt="Mystery Tavern"
            />
            <span>Admin</span>
          </div>
          <div className="login-title">Sign in</div>
          <p className="login-sub">Mystery Tavern staff only.</p>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          {error && <div className="login-error">{error}</div>}
        </div>
      </div>
    </>
  )
}
