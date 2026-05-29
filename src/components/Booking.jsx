import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']
const ALL_SLOTS = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']
const SERVICES = ['Cut & Style','Colour','Highlights','Balayage','Treatment','Blow Dry','Bridal']
// Closed: Sunday (0), Tuesday (2)
const CLOSED_DAYS = [0, 2]

export default function Booking() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selDate, setSelDate] = useState(null)
  const [bookedSlots, setBookedSlots] = useState([])
  const [selTime, setSelTime] = useState(null)
  const [selService, setSelService] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })
  const [step, setStep] = useState('cal')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!selDate) return
    setBookedSlots([])
    supabase
      .from('bookings')
      .select('time_slot')
      .eq('date', selDate)
      .eq('status', 'confirmed')
      .then(({ data }) => {
        if (data) setBookedSlots(data.map(r => r.time_slot))
      })
  }, [selDate])

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  function toDateStr(d) {
    return `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
  }

  function changeMonth(dir) {
    let m = month + dir, y = year
    if (m > 11) { m = 0; y++ }
    if (m < 0) { m = 11; y-- }
    setMonth(m); setYear(y)
    setSelDate(null); setSelTime(null); setStep('cal')
  }

  function selectDate(d) {
    const dow = new Date(year, month, d).getDay()
    const ds = toDateStr(d)
    if (CLOSED_DAYS.includes(dow) || ds < todayStr) return
    setSelDate(ds); setSelTime(null); setStep('time')
  }

  function selectTime(slot) {
    if (bookedSlots.includes(slot)) return
    setSelTime(slot); setStep('form')
  }

  async function submitBooking() {
    if (!form.name || !form.phone) { setError('Please enter your name and phone number.'); return }
    if (!selService) { setError('Please select a service.'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.from('bookings').insert({
      date: selDate,
      time_slot: selTime,
      service: selService,
      client_name: form.name,
      client_phone: form.phone,
      client_email: form.email,
      notes: form.notes,
      status: 'confirmed',
    })
    setLoading(false)
    if (err) { setError('Booking failed — please try again or contact us directly.'); return }
    setStep('done')
  }

  function reset() {
    setSelDate(null); setSelTime(null); setSelService(null)
    setForm({ name: '', phone: '', email: '', notes: '' })
    setStep('cal'); setError('')
  }

  const inputStyle = {
    width: '100%', border: '1px solid #e8e0d4', borderRadius: 'var(--radius)',
    padding: '10px 12px', fontSize: 13, color: 'var(--text)', background: 'var(--white)',
    outline: 'none',
  }

  return (
    <section id="booking" style={{ padding: '56px 24px', background: 'var(--cream)' }}>
      <span className="section-label">Reserve Your Session</span>
      <div className="section-title">Book an Appointment</div>
      <div className="section-line" />

      {step !== 'done' && (
        <div style={{ display: 'flex', gap: 0, marginBottom: 24 }}>
          {[['1','Date'],['2','Time'],['3','Details']].map(([n, label], i) => {
            const active = (i === 0 && step === 'cal') || (i === 1 && step === 'time') || (i === 2 && step === 'form')
            const done = (i === 0 && step !== 'cal') || (i === 1 && step === 'form')
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 20 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done || active ? 'var(--gold)' : '#e8e0d4',
                  color: done || active ? 'var(--dark)' : 'var(--muted)',
                  fontSize: 11, fontWeight: 500,
                }}>{n}</div>
                <span style={{ fontSize: 11, color: active ? 'var(--dark)' : 'var(--muted)', letterSpacing: 1 }}>{label}</span>
              </div>
            )
          })}
        </div>
      )}

      {step === 'cal' && (
        <div style={{ background: 'var(--white)', border: '1px solid #e8e0d4', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ background: 'var(--dark)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => changeMonth(-1)} style={{ background: 'transparent', border: '1px solid rgba(184,150,90,0.4)', color: 'var(--gold)', width: 28, height: 28, borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 16 }}>‹</button>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--white)', fontSize: 16, letterSpacing: 1 }}>{MONTHS[month]} {year}</span>
            <button onClick={() => changeMonth(1)} style={{ background: 'transparent', border: '1px solid rgba(184,150,90,0.4)', color: 'var(--gold)', width: 28, height: 28, borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 16 }}>›</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: 10 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 9, letterSpacing: 2, color: 'var(--muted)', padding: '6px 2px', textTransform: 'uppercase' }}>{d}</div>
            ))}
            {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const d = i + 1
              const ds = toDateStr(d)
              const dow = new Date(year, month, d).getDay()
              const isPast = ds < todayStr
              const isClosed = CLOSED_DAYS.includes(dow)
              const isToday = ds === todayStr
              const isSel = ds === selDate
              const unavail = isPast || isClosed
              return (
                <div key={d} onClick={() => !unavail && selectDate(d)} style={{
                  textAlign: 'center', padding: '7px 2px', fontSize: 12,
                  borderRadius: 'var(--radius)', position: 'relative',
                  cursor: unavail ? 'default' : 'pointer',
                  color: unavail ? '#ccc' : isSel ? 'var(--dark)' : isToday ? 'var(--dark)' : 'var(--text)',
                  background: isSel ? 'var(--gold)' : isToday ? 'var(--cream2)' : 'transparent',
                  fontWeight: isToday || isSel ? 500 : 400,
                }}>
                  {d}
                  {!unavail && !isSel && (
                    <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, background: 'var(--gold)', borderRadius: '50%', display: 'block' }} />
                  )}
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', padding: '0 16px 14px' }}>Closed Tuesdays & Sundays · Tap an available date</p>
        </div>
      )}

      {step === 'time' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>Available Times</p>
              <p style={{ fontSize: 15, fontFamily: "'Cormorant Garamond', serif" }}>
                {MONTHS_SHORT[month]} {parseInt(selDate.split('-')[2])}, {year}
              </p>
            </div>
            <button onClick={() => setStep('cal')} style={{ fontSize: 11, color: 'var(--gold)', background: 'none', border: '1px solid rgba(184,150,90,0.4)', padding: '6px 12px', borderRadius: 'var(--radius)', cursor: 'pointer', letterSpacing: 1 }}>← Change Date</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {ALL_SLOTS.map(slot => {
              const booked = bookedSlots.includes(slot)
              return (
                <button key={slot} onClick={() => !booked && selectTime(slot)} style={{
                  padding: '11px 6px', border: `1px solid ${booked ? '#e8e0d4' : selTime === slot ? 'var(--gold)' : '#e8e0d4'}`,
                  borderRadius: 'var(--radius)', textAlign: 'center', fontSize: 12,
                  cursor: booked ? 'default' : 'pointer',
                  background: booked ? 'var(--cream2)' : selTime === slot ? 'var(--gold)' : 'var(--white)',
                  color: booked ? '#ccc' : selTime === slot ? 'var(--dark)' : 'var(--text)',
                  textDecoration: booked ? 'line-through' : 'none',
                }}>
                  {slot}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === 'form' && (
        <div>
          <div style={{ background: 'var(--cream2)', borderRadius: 'var(--radius)', padding: 14, marginBottom: 20 }}>
            {[['Date', `${MONTHS_SHORT[month]} ${parseInt(selDate.split('-')[2])}, ${year}`], ['Time', selTime], ['Service', selService || 'Not yet selected']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0' }}>
                <span style={{ color: 'var(--muted)' }}>{k}</span>
                <span style={{ color: 'var(--dark)', fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="form-group">
            <label>Service</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SERVICES.map(s => (
                <button key={s} onClick={() => setSelService(s)} style={{
                  padding: '6px 12px', border: `1px solid ${selService === s ? 'var(--gold)' : '#e8e0d4'}`,
                  borderRadius: 20, fontSize: 11, cursor: 'pointer',
                  background: selService === s ? 'var(--gold)' : 'transparent',
                  color: selService === s ? 'var(--dark)' : 'var(--muted)',
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div className="form-group"><label>Full Name *</label><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Your name" /></div>
          <div className="form-group"><label>Mobile Number *</label><input style={inputStyle} type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+61 4XX XXX XXX" /></div>
          <div className="form-group"><label>Email</label><input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="your@email.com" /></div>
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea style={inputStyle} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Hair length, colour history, allergies..." />
          </div>
          {error && <p style={{ fontSize: 12, color: '#c0392b', marginBottom: 12 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStep('time')} className="btn-outline" style={{ flex: 1 }}>← Back</button>
            <button onClick={submitBooking} className="btn-primary" style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ width: 52, height: 52, border: '1px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: 'var(--dark)', marginBottom: 8 }}>Appointment Confirmed</div>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, maxWidth: 300, margin: '0 auto 20px' }}>
            Thank you, {form.name}. Your booking on <strong>{MONTHS_SHORT[month]} {parseInt(selDate.split('-')[2])}</strong> at <strong>{selTime}</strong> has been received.
          </p>
          <button onClick={reset} className="btn-outline">Book Another Appointment</button>
        </div>
      )}
    </section>
  )
}
