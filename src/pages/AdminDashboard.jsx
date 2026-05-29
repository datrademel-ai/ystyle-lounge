import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(ds) {
  const d = new Date(ds + 'T00:00:00')
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

const STATUS_COLORS = {
  confirmed: { bg: 'rgba(184,150,90,0.15)', color: 'var(--gold)' },
  cancelled: { bg: 'rgba(200,50,50,0.1)', color: '#e74c3c' },
  completed: { bg: 'rgba(40,160,90,0.1)', color: '#27ae60' },
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [filter, setFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, today: 0, upcoming: 0 })

  useEffect(() => {
    checkAdmin()
    loadBookings()
  }, [])

  async function checkAdmin() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { navigate('/admin/login'); return }
    const isAdmin = session.user.user_metadata?.role === 'admin'
    if (!isAdmin) { navigate('/'); return }
  }

  async function loadBookings() {
    setLoading(true)
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: true })
      .order('time_slot', { ascending: true })
    if (data) {
      setBookings(data)
      const todayStr = new Date().toISOString().split('T')[0]
      setStats({
        total: data.length,
        today: data.filter(b => b.date === todayStr).length,
        upcoming: data.filter(b => b.date >= todayStr && b.status === 'confirmed').length,
      })
    }
    setLoading(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('bookings').update({ status }).eq('id', id)
    loadBookings()
  }

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const filtered = bookings.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false
    if (dateFilter && b.date !== dateFilter) return false
    return true
  })

  const s = { background: 'var(--dark)', minHeight: '100vh', color: 'var(--white)' }

  return (
    <div style={s}>
      <div style={{ borderBottom: '1px solid rgba(184,150,90,0.2)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--gold)', fontSize: 18, letterSpacing: 2 }}>Y Style Lounge — Admin</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 11, color: '#7a6a58', letterSpacing: 1 }}>← View Site</a>
          <button onClick={signOut} style={{ fontSize: 11, color: 'var(--gold)', background: 'none', border: '1px solid rgba(184,150,90,0.4)', padding: '7px 14px', borderRadius: 4, cursor: 'pointer', letterSpacing: 1 }}>Sign Out</button>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
          {[['Total Bookings', stats.total], ["Today's Appointments", stats.today], ['Upcoming (Confirmed)', stats.upcoming]].map(([label, val]) => (
            <div key={label} style={{ background: 'var(--dark2)', border: '1px solid rgba(184,150,90,0.15)', borderRadius: 6, padding: '16px 14px' }}>
              <div style={{ fontSize: 10, color: '#7a6a58', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: 'var(--gold)' }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {['all','confirmed','completed','cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', border: '1px solid rgba(184,150,90,0.3)', background: filter === f ? 'var(--gold)' : 'transparent', color: filter === f ? 'var(--dark)' : '#9a8a78', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', borderRadius: 4, cursor: 'pointer' }}>
              {f}
            </button>
          ))}
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(184,150,90,0.3)', color: 'var(--white)', padding: '6px 10px', borderRadius: 4, fontSize: 12, outline: 'none' }} />
          {dateFilter && <button onClick={() => setDateFilter('')} style={{ fontSize: 11, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>}
        </div>

        {loading ? (
          <p style={{ color: '#7a6a58', fontSize: 13 }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#7a6a58', fontSize: 13 }}>No bookings found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(b => (
              <div key={b.id} style={{ background: 'var(--dark2)', border: '1px solid rgba(184,150,90,0.12)', borderRadius: 6, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, color: 'var(--white)', fontWeight: 500, marginBottom: 3 }}>{b.client_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 3 }}>{b.service}</div>
                    <div style={{ fontSize: 11, color: '#9a8a78' }}>{formatDate(b.date)} · {b.time_slot}</div>
                    <div style={{ fontSize: 11, color: '#7a6a58', marginTop: 2 }}>{b.client_phone} {b.client_email ? `· ${b.client_email}` : ''}</div>
                    {b.notes && <div style={{ fontSize: 11, color: '#5a4a38', marginTop: 4, fontStyle: 'italic' }}>Note: {b.notes}</div>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                    <span style={{ fontSize: 10, letterSpacing: 1, padding: '4px 10px', borderRadius: 20, ...STATUS_COLORS[b.status] }}>{b.status}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {b.status !== 'completed' && <button onClick={() => updateStatus(b.id, 'completed')} style={{ fontSize: 10, color: '#27ae60', background: 'rgba(40,160,90,0.08)', border: '1px solid rgba(40,160,90,0.3)', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}>Done</button>}
                      {b.status !== 'cancelled' && <button onClick={() => updateStatus(b.id, 'cancelled')} style={{ fontSize: 10, color: '#e74c3c', background: 'rgba(200,50,50,0.08)', border: '1px solid rgba(200,50,50,0.3)', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}>Cancel</button>}
                      {b.status === 'cancelled' && <button onClick={() => updateStatus(b.id, 'confirmed')} style={{ fontSize: 10, color: 'var(--gold)', background: 'rgba(184,150,90,0.08)', border: '1px solid rgba(184,150,90,0.3)', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}>Restore</button>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
