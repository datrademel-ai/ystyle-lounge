import Nav from '../components/Nav'
import Services from '../components/Services'
import Prices from '../components/Prices'
import Booking from '../components/Booking'
import Member from '../components/Member'
import { Hours, Testimonials, Contact, Footer } from '../components/Misc'

function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, var(--dark) 0%, #2a1f14 60%, #1a1410 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      padding: '80px 24px 60px',
    }}>
      {/* Decorative lines */}
      <div style={{ position: 'absolute', top: '20%', left: '8%', width: 1, height: 120, background: 'linear-gradient(to bottom, transparent, rgba(184,150,90,0.3), transparent)' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '8%', width: 1, height: 120, background: 'linear-gradient(to bottom, transparent, rgba(184,150,90,0.3), transparent)' }} />

      <div style={{ textAlign: 'center', maxWidth: 600 }}>
        <span style={{ display: 'block', fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(184,150,90,0.7)', marginBottom: 20 }}>
          Melbourne's Premier Hair Studio
        </span>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(42px, 9vw, 80px)',
          fontWeight: 300,
          color: 'var(--white)',
          lineHeight: 1.05,
          marginBottom: 24,
          letterSpacing: 2,
        }}>
          Y Style<br />
          <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Lounge</span>
        </h1>

        <div style={{ width: 40, height: 1, background: 'var(--gold)', margin: '0 auto 24px' }} />

        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 40, maxWidth: 380, margin: '0 auto 40px', fontWeight: 300 }}>
          A sanctuary of style in the heart of Melbourne. Expert cuts, colour, and care — tailored to you.
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#booking" className="btn-primary" style={{ padding: '14px 32px' }}>Book an Appointment</a>
          <a href="#services" className="btn-outline-white" style={{ padding: '14px 32px' }}>Our Services</a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Services />
      <Prices />
      <Booking />
      <Testimonials />
      <Hours />
      <Contact />
      <Member />
      <Footer />
    </>
  )
}
