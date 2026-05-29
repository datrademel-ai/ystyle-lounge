const SERVICES = [
  {
    title: 'Cut & Style',
    desc: 'Precision cuts tailored to your face shape and lifestyle. Includes wash, cut, and blow-dry.',
    icon: '✂',
  },
  {
    title: 'Colour',
    desc: 'Full colour, roots, or creative colour transformations using premium salon products.',
    icon: '◈',
  },
  {
    title: 'Highlights',
    desc: 'Classic foil highlights to add dimension and brightness to your natural colour.',
    icon: '✦',
  },
  {
    title: 'Balayage',
    desc: 'Hand-painted colour technique for a natural, sun-kissed finish with seamless grow-out.',
    icon: '⟡',
  },
  {
    title: 'Treatment',
    desc: 'Deep conditioning and keratin treatments to restore shine, softness, and manageability.',
    icon: '◇',
  },
  {
    title: 'Bridal',
    desc: 'Complete bridal hair styling including trial run, updo, and on-the-day service.',
    icon: '❋',
  },
]

export default function Services() {
  return (
    <section id="services" style={{ padding: '80px 24px', background: 'var(--white)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <span className="section-label">What We Offer</span>
        <div className="section-title">Our Services</div>
        <div className="section-line" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 1, border: '1px solid #e8e0d4', overflow: 'hidden', borderRadius: 4 }}>
          {SERVICES.map((s, i) => (
            <div key={s.title} style={{
              padding: '28px 24px',
              borderRight: (i % 3 !== 2) ? '1px solid #e8e0d4' : 'none',
              borderBottom: '1px solid #e8e0d4',
              background: 'var(--white)',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--white)'}
            >
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: 'var(--gold)', marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: 'var(--dark)', marginBottom: 8 }}>{s.title}</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
          All services include a complimentary consultation. Prices vary — see our price guide below.
        </p>
      </div>
    </section>
  )
}
