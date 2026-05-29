import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!form.email || !form.password) { setError('Please enter email and password.'); return }
    setLoading(true); setError('')
    const { data, error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    setLoading(false)
    if (err) { setError(err.message); return }
    const isAdmin = data.user?.user_metadata?.role === 'admin'
    if (!isAdmin) { setError('Access denied - admin account required.'); await supabase.auth.signOut(); return }
    navigate('/admin')
  }

  const inputStyle = {
    width: '100%', border: '1px solid rgba(184,150,90,0.3)', borderRadius: 4,
    padding: '11px 14px', fontSize: 13, color: 'var(--white)',
    background: 'rgba(255,255,255,0.05)', outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--gold)', fontSize: 22, letterSpacing: 3, marginBottom: 6 }}>Y STYLE LOUNGE</div>
          <p style={{ fontSize: 10, color: '#5a4a38', letterSpacing: 2, textTransform: 'uppercase' }}>Admin Access</p>
        </div>

        <div className="form-group">
          <label style={{ color: '#7a6a58' }}>Email</label>
          <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="admin@email.com"
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div className="form-group">
          <label style={{ color: '#7a6a58' }}>Password</label>
          <input style={inputStyle} type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>

        {error && <p style={{ fontSize: 12, color: '#e74c3c', marginBottom: 12 }}>{error}</p>}

        <button onClick={handleLogin} className="btn-primary" style={{ width: '100%', marginBottom: 20 }} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <a href="/" style={{ fontSize: 11, color: '#5a4a38', letterSpacing: 1 }}>Back to Site</a>
        </div>
      </div>
    </div>
  )
}
