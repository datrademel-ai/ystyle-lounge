import { useState, useEffect } from 'react'

const LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Prices', href: '#prices' },
  { label: 'Book', href: '#booking' },
  { label: 'Hours', href: '#hours' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(26,20,16,0.97)' : 'transparent',
      borderBottom: scrolled ? '1px solid rgba(184,150,90,0.15)' : 'none',
      transition: 'all 0.3s',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: 'var(--gold)', letterSpacing: 3, fontWeight: 400 }}>
          Y STYLE LOUNGE
        </a>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="nav-desktop">
          {LINKS.map(l => (
            <a key={l.label} href={l.href} style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
            >{l.label}</a>
          ))}
          <a href="#booking" className="btn-primary" style={{ padding: '8px 18px', fontSize: 10 }}>Book Now</a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} className="nav-hamburger">
          <div style={{ width: 22, height: 1, background: 'var(--gold)', marginBottom: 6 }} />
          <div style={{ width: 22, height: 1, background: 'var(--gold)', marginBottom: 6 }} />
          <div style={{ width: 22, height: 1, background: 'var(--gold)' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'rgba(26,20,16,0.98)', padding: '16px 24px 24px', borderTop: '1px solid rgba(184,150,90,0.15)' }}>
          {LINKS.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', padding: '12px 0', borderBottom: '1px solid rgba(184,150,90,0.08)' }}>
              {l.label}
            </a>
          ))}
          <a href="#booking" className="btn-primary" style={{ display: 'inline-block', marginTop: 16, padding: '10px 24px', fontSize: 10 }}>Book Now</a>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
