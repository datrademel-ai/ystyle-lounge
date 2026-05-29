const PRICE_GROUPS = [
  {
    category: 'Cuts',
    items: [
      { service: 'Cut & Style — Short', price: '$75+' },
      { service: 'Cut & Style — Medium', price: '$85+' },
      { service: 'Cut & Style — Long', price: '$95+' },
      { service: 'Blow Dry Only', price: '$55+' },
      { service: 'Fringe Trim', price: '$20' },
    ],
  },
  {
    category: 'Colour',
    items: [
      { service: 'Full Colour', price: '$120+' },
      { service: 'Roots Only', price: '$90+' },
      { service: 'Foil Highlights (Half)', price: '$150+' },
      { service: 'Foil Highlights (Full)', price: '$200+' },
      { service: 'Balayage', price: '$220+' },
      { service: 'Toner / Gloss', price: '$60+' },
    ],
  },
  {
    category: 'Treatments & Bridal',
    items: [
      { service: 'Deep Conditioning', price: '$50+' },
      { service: 'Keratin Smoothing', price: '$250+' },
      { service: 'Olaplex Treatment', price: '$80+' },
      { service: 'Bridal Trial', price: '$150' },
      { service: 'Bridal Day-of Style', price: '$200+' },
    ],
  },
]

export default function Prices() {
  return (
    <section id="prices" style={{ padding: '80px 24px', background: 'var(--cream)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <span className="section-label">Investment</span>
        <div className="section-title">Price Guide</div>
        <div className="section-line" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {PRICE_GROUPS.map(group => (
            <div key={group.category} style={{ background: 'var(--white)', border: '1px solid #e8e0d4', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ background: 'var(--dark)', padding: '14px 20px' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'var(--gold)', letterSpacing: 1 }}>{group.category}</div>
              </div>
              <div style={{ padding: '8px 0' }}>
                {group.items.map(item => (
                  <div key={item.service} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid #f0ebe2' }}>
                    <span style={{ fontSize: 13, color: 'var(--text)' }}>{item.service}</span>
                    <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: 12 }}>{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 24, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
          Prices are a guide only. Final pricing confirmed at consultation. All prices in AUD.
        </p>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <a href="#booking" className="btn-primary">Book an Appointment</a>
        </div>
      </div>
    </section>
  )
}
