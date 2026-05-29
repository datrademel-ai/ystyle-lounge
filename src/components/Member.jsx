import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(ds) {
  const d = new Date(ds + 'T00:00:00')
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

const STATUS_COLORS = {
  confirmed: { color: 'var(--gold)' },
  completed: { color: '#27ae60' },
  cancelled: { color: '#e74c3c' },
}

export default function Member() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setUser(session.user); setMode('account'); loadBookings(session.user) }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) { setUser(session.user); setMode('account'); loadBookings(session.user) }
      else { setUser(null); setMode('login') }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadBookings(u) {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .or(`user_id.eq.${u.id},client_email.eq.${u.email}`)
      .order('date', { ascending: false })
    if (data) setBookings(data)
  }

  async function handleLogin() {
    if (!form.email || !form.password) { setError('Please enter email and password.'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    setLoading(false)
    if (err) setError(err.message)
  }

  async function handleRegister() {
    if (!form.email || !form.password || !form.name) { setError('All fields are required.'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } }
    })
    setLoading(false)
    if (err) setError(err.message)
    else setMsg('Check your email to confirm your account.')
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setBookings([])
  }

  const inputStyle = {
    width: '100%', border: '1px solid #e8e0d4', borderRadius: 'var(--radius)',
    padding: '10px 12px', fontSize: 13, color: 'var(--text)', background: 'var(--white)',
    outline: 'none',
  }

  return (
    <section id="account" style={{ padding: '56px 24px', background: 'var(--white)' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <span className="section-label">Member Area</span>
        <div className="section-title">{mode === 'account' ? 'My Account' : mode === 'register' ? 'Create Account' : 'Sign In'}</div>
        <div className="section-line" />

        {mode === 'account' && user && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 14, color: 'var(--dark)', fontWeight: 500 }}>{user.user_metadata?.full_name || 'Welcome back'}</p>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>{user.email}</p>
              </div>
              <button onClick={handleSignOut} className="btn-outline" style={{ padding: '8px 16px', fontSize: 10 }}>Sign Out</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>My Bookings</p>
              {bookings.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>No bookings yet. <a href="#booking" style={{ color: 'var(--gold)' }}>Book an appointment</a></p>
              ) : (
                bookings.map(b => (
                  <div key={b.id} style={{ border: '1px solid #e8e0d4', borderRadius: 4, padding: '14px 16px', marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: 14, color: 'var(--dark)', fontWeight: 500, marginBottom: 2 }}>{b.service}</p>
                        <p style={{ fontSize: 12, color: 'var(--muted)' }}>{formatDate(b.date)} · {b.time_slot}</p>
                      </div>
                      <span style={{ fontSize: 10, letterSpacing: 1, color: STATUS_COLORS[b.status]?.color || 'var(--muted)' }}>{b.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {mode !== 'account' && (
          <div>
            {mode === 'register' && (
              <div className="form-group">
                <label>Full Name</label>
                <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Your name" />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input style={inputStyle} type="password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder="••••••••" />
            </div>
            {error && <p style={{ fontSize: 12, color: '#c0392b', marginBottom: 12 }}>{error}</p>}
            {msg && <p style={{ fontSize: 12, color: '#27ae60', marginBottom: 12 }}>{msg}</p>}
            <button onClick={mode === 'login' ? handleLogin : handleRegister} className="btn-primary" style={{ width: '100%', marginBottom: 12 }} disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
            <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
              {mode === 'login' ? (
                <span>No account? <button onClick={() => { setMode('register'); setError('') }} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: 12 }}>Register</button></span>
              ) : (
                <span>Have an account? <button onClick={() => { setMode('login'); setError('') }} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: 12 }}>Sign In</button></span>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
