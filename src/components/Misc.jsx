// Hours, Testimonials, Contact, Footer

export function Hours() {
  const HOURS = [
    { day: 'Monday', time: '9:00 AM – 6:00 PM' },
    { day: 'Tuesday', time: 'Closed' },
    { day: 'Wednesday', time: '9:00 AM – 6:00 PM' },
    { day: 'Thursday', time: '9:00 AM – 7:00 PM' },
    { day: 'Friday', time: '9:00 AM – 7:00 PM' },
    { day: 'Saturday', time: '9:00 AM – 5:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ]

  const today = new Date().getDay() // 0=Sun
  const dayMap = [6, 0, 1, 2, 3, 4, 5] // JS day → HOURS index

  return (
    <section id="hours" style={{ padding: '80px 24px', background: 'var(--dark)' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <span className="section-label" style={{ color: 'rgba(184,150,90,0.7)' }}>Opening Hours</span>
        <div className="section-title" style={{ color: 'var(--white)' }}>When We're Open</div>
        <div className="section-line" />

        {HOURS.map((h, i) => {
          const isToday = dayMap[today] === i
          return (
            <div key={h.day} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0', borderBottom: '1px solid rgba(184,150,90,0.1)',
            }}>
              <span style={{ fontSize: 13, color: isToday ? 'var(--gold)' : 'rgba(255,255,255,0.6)', fontWeight: isToday ? 500 : 300 }}>
                {h.day} {isToday && <span style={{ fontSize: 10, letterSpacing: 1, marginLeft: 6 }}>← today</span>}
              </span>
              <span style={{ fontSize: 13, color: h.time === 'Closed' ? '#5a4a38' : isToday ? 'var(--gold)' : 'rgba(255,255,255,0.5)' }}>
                {h.time}
              </span>
            </div>
          )
        })}

        <p style={{ marginTop: 20, fontSize: 12, color: '#5a4a38' }}>
          Public holidays may vary. Call ahead to confirm.
        </p>
      </div>
    </section>
  )
}

export function Testimonials() {
  const REVIEWS = [
    { name: 'Sarah M.', text: 'Absolutely love my balayage! The team really listened to what I wanted and delivered beyond my expectations.', stars: 5 },
    { name: 'Jessica L.', text: 'Best haircut I had in years. The salon is beautiful and the whole experience felt so luxurious.', stars: 5 },
    { name: 'Emma T.', text: 'Came in for a colour correction and left with the most gorgeous result. Highly recommend Y Style.', stars: 5 },
    { name: 'Rachel K.', text: 'My go-to salon. Always leave feeling amazing. The online booking is so convenient too!', stars: 5 },
  ]

  return (
    <section id="testimonials" style={{ padding: '80px 24px', background: 'var(--cream)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <span className="section-label">Client Love</span>
        <div className="section-title">What Our Clients Say</div>
        <div className="section-line" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {REVIEWS.map(r => (
            <div key={r.name} style={{ background: 'var(--white)', border: '1px solid #e8e0d4', borderRadius: 4, padding: '24px 20px' }}>
              <div style={{ color: 'var(--gold)', fontSize: 14, marginBottom: 12, letterSpacing: 2 }}>
                {'★'.repeat(r.stars)}
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{ r.text}"</p>
              <p style={{ fontSize: 11, color: 'var(--dark)', letterSpacing: 1, fontWeight: 500 }}>— {r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section id="contact" style={{ padding: '80px 24px', background: 'var(--white)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <span className="section-label">Find Us</span>
        <div className="section-title">Get In Touch</div>
        <div className="section-line" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 32 }}>
          {[
            { icon: '📍', label: 'Address', lines: ['123 Collins Street', 'Melbourne VIC 3000'] },
            { icon: '📞', label: 'Phone', lines: ['+61 3 9XXX XXXX'] },
            { icon: '✉', label: 'Email', lines: ['hello@ystylelounge.com.au'] },
            { icon: '📸', label: 'Instagram', lines: ['@ystylelounge'] },
          ].map(c => (
            <div key={c.label}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{c.icon}</div>
              <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>{c.label}</p>
              {c.lines.map(l => (
                <p key={l} style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{l}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer style={{ background: 'var(--dark)', padding: '32px 24px', borderTop: '1px solid rgba(184,150,90,0.15)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", color: 'var(--gold)', fontSize: 18, letterSpacing: 3 }}>Y STYLE LOUNGE</div>
        <p style={{ fontSize: 11, color: '#4a3a2a', letterSpacing: 1 }}>© {new Date().getFullYear()} Y Style Lounge · Melbourne, Australia</p>
        <a href="/admin/login" style={{ fontSize: 10, color: '#3a2a1a', letterSpacing: 1 }}>Admin</a>
      </div>
    </footer>
  )
}
