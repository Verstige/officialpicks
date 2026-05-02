'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'
import { Trophy, Activity, Dribbble, Target, Flag, Package, CheckCircle2, Phone, Smartphone, Banknote, Microscope, Globe, BarChart, Mail } from 'lucide-react'

const SPORTS = [
  { icon: <Activity color="#F5A623" size={44} />, name: 'NFL Football', desc: '7–10 weekly plays, all levels' },
  { icon: <Dribbble color="#F5A623" size={44} />, name: 'NBA Basketball', desc: 'Daily plays, college & pro' },
  { icon: <Target color="#F5A623" size={44} />, name: 'MLB Baseball', desc: 'Daily picks all season long' },
  { icon: <Flag color="#F5A623" size={44} />, name: 'Horse Racing', desc: 'Expert race day selections' },
  { icon: <Activity color="#F5A623" size={44} />, name: 'College Football', desc: 'CFB picks & bowl specials' },
  { icon: <Dribbble color="#F5A623" size={44} />, name: 'College Basketball', desc: 'NCAAB daily & tournament' },
]

const TESTIMONIALS = [
  {
    name: 'Martin Byrd',
    text: "The site's clean design makes it a breeze to navigate, and the picks are consistently accurate. The free SMS text service is incredibly convenient. Harry's Picks has significantly improved my betting strategy and results.",
    rating: 5,
  },
  {
    name: 'James T.',
    text: "Uncle Harry's track record is unmatched. I've been using the football package for two seasons and the ROI is real. Worth every penny.",
    rating: 5,
  },
  {
    name: 'David R.',
    text: "The Level 4 plays are my go-to. Consistent daily value and the SMS delivery means I never miss a pick. Highly recommend.",
    rating: 5,
  },
]

const TICKER_ITEMS = [
  { team: 'Cubs', pick: '-1.5 RL WIN' },
  { team: 'Chiefs', pick: '-3.5 ATS WIN' },
  { team: 'Lakers', pick: 'O 225.5 WIN' },
  { team: 'Yankees', pick: 'ML WIN' },
  { team: 'Eagles', pick: 'U 47 WIN' },
  { team: 'Celtics', pick: '-5.5 ATS WIN' },
]

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, full_name: name, source: 'homepage' }),
      })
      if (res.ok) {
        toast.success('🎉 You\'re in! Check your email for your first free picks.')
        setEmail('')
        setName('')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />

      {/* RESULTS TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="ticker-item">
              <span style={{ fontWeight: 700 }}>{item.team}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#22C55E' }}>
                {item.pick} <CheckCircle2 size={14} />
              </span>
              <span className="ticker-sep">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="container">
          <div className="hero-content animate-fadeInUp">
            <h1>
              Uncle Harry's<br />
              <span className="text-gradient">Winning Picks</span>
            </h1>
            <p>
              Expert sports handicapping for NFL, MLB, NBA, College Football, and Horse Racing.
              Our picks are built on deep statistical analysis and insider connections.
              <strong style={{ color: '#F5A623' }}> Don't bet blind — bet with Harry.</strong>
            </p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={20} /> Get Started — It's Free
              </Link>
              <Link href="/packages/football" className="btn btn-outline btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} /> View All Packages
              </Link>
            </div>

            <div style={{
              marginTop: '32px',
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <a href="tel:9419145885" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F5A623', fontWeight: 700, fontSize: '18px', background: 'rgba(245,166,35,0.08)', padding: '10px 20px', borderRadius: '10px', border: '1px solid rgba(245,166,35,0.2)' }}>
                <Phone size={18} color="#F5A623" /> 941-914-5885
              </a>
              <a href="sms:51501&body=PICK" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D1D5DB', fontWeight: 600, fontSize: '16px' }}>
                <Smartphone size={18} color="#D1D5DB" /> Text PICK to 51501 for free picks
              </a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="number">10,000+</div>
                <div className="label">Active Members</div>
              </div>
              <div className="hero-stat">
                <div className="number">15+ Yrs</div>
                <div className="label">Experience</div>
              </div>
              <div className="hero-stat">
                <div className="number">6 Sports</div>
                <div className="label">Covered Daily</div>
              </div>
              <div className="hero-stat">
                <div className="number">Daily</div>
                <div className="label">Fresh Picks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — Simple 3-step for 35+ */}
      <section style={{ background: 'var(--navy-light)', borderTop: '1px solid var(--navy-border)', borderBottom: '1px solid var(--navy-border)', padding: '64px 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Simple Process</span>
            <h2>How It <span className="text-gradient">Works</span></h2>
            <p>Getting started takes less than 2 minutes. No confusing setup.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
            {[
              { step: '1', icon: <Package size={32} color="#F5A623" />, title: 'Pick Your Package', desc: 'Browse our football, basketball, or baseball packages. Options start at just $20.' },
              { step: '2', icon: <Banknote size={32} color="#F5A623" />, title: 'Pay via Venmo', desc: 'Send payment to @UncleharrysSports on Venmo, then text or call 941-914-5885 to confirm.' },
              { step: '3', icon: <Smartphone size={32} color="#F5A623" />, title: 'Receive Your Picks', desc: 'Get picks delivered directly to your phone via SMS and email — every single day.' },
            ].map(item => (
              <div key={item.step} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '36px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #F5A623, #D4841A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900, color: '#070B14', fontFamily: 'Outfit, sans-serif', flexShrink: 0 }}>
                    {item.step}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', background: 'rgba(245,166,35,0.1)', borderRadius: '12px' }}>{item.icon}</div>
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '21px', fontWeight: 700 }}>{item.title}</h3>
                <p style={{ color: '#D1D5DB', fontSize: '17px', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section style={{ padding: '72px 0', borderBottom: '1px solid var(--navy-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '48px', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '480px' }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '36px', fontWeight: 800, marginBottom: '16px' }}>
                Get <span className="text-gradient">Free Picks</span> by Email
              </h2>
              <p style={{ color: '#D1D5DB', lineHeight: 1.8, fontSize: '18px', marginBottom: '20px' }}>
                Join 10,000+ members and receive free sports picks directly in your inbox.
                No credit card. No strings. Unsubscribe any time.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9CA3AF', fontSize: '15px' }}>
                <CheckCircle2 size={16} color="#22C55E" /> We never sell your information
              </div>
            </div>
            <form onSubmit={handleEmailSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, maxWidth: '440px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: '#D1D5DB', marginBottom: '6px' }}>Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="First and Last Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ fontSize: '17px', padding: '14px 18px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: '#D1D5DB', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ fontSize: '17px', padding: '14px 18px' }}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ fontSize: '18px', marginTop: '4px', display: 'flex', gap: '8px' }}>
                {loading ? <span className="spinner" /> : <><Mail size={20} /> Send Me Free Picks</>}
              </button>
              <p style={{ fontSize: '14px', color: '#4B5563', textAlign: 'center' }}>
                No spam. Unsubscribe anytime. 100% free.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE HARRY */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Us</span>
            <h2>Why Choose <span className="text-gradient">Harry?</span></h2>
            <p>
              When you choose Harry Picks, you're not just getting picks — you're getting
              a trusted advisor with 15+ years of winning results.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              {
                icon: <Microscope size={36} color="#F5A623" />,
                title: 'Deep Statistical Analysis',
                desc: 'Every pick is backed by advanced computer modeling, key team data, market trends, and critical statistics analyzed by our expert team.'
              },
              {
                icon: <Target size={36} color="#F5A623" />,
                title: 'Selective & Disciplined',
                desc: 'We only release plays that meet strict criteria. Every game is hand-picked and must pass our rigorous qualification process before going out.'
              },
              {
                icon: <Globe size={36} color="#F5A623" />,
                title: 'Insider Network',
                desc: 'Our network of sources continuously provides the most up-to-date information available — giving you an edge no public bettor has.'
              },
              {
                icon: <Smartphone size={36} color="#F5A623" />,
                title: 'SMS Delivery — Never Miss a Pick',
                desc: 'Get plays delivered directly to your phone via SMS so you\'re always ready to act. Simple, fast, and reliable.'
              },
              {
                icon: <BarChart size={36} color="#F5A623" />,
                title: 'Packages for Every Budget',
                desc: 'From $20/day Level 3 plays all the way up to full season memberships. Something for everyone no matter your budget.'
              },
              {
                icon: <Trophy size={36} color="#F5A623" />,
                title: 'Proven 15+ Year Track Record',
                desc: 'Thousands of satisfied members across 15+ years. Join the community that trusts Uncle Harry for smarter, data-driven betting.'
              },
            ].map((item) => (
              <div key={item.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '32px' }}>
                <div>{item.icon}</div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 700 }}>{item.title}</h3>
                <p style={{ color: '#D1D5DB', fontSize: '17px', lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPORTS WE COVER */}
      <section className="section" style={{ background: 'var(--navy-light)', borderTop: '1px solid var(--navy-border)', borderBottom: '1px solid var(--navy-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Sports Coverage</span>
            <h2>6 Sports. <span className="text-gradient">Expert Picks Daily.</span></h2>
            <p>No matter which sport you follow, Harry has you covered every single day of the season.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
            {SPORTS.map(sport => (
              <div key={sport.name} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', textAlign: 'center', padding: '32px 20px', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ color: '#F5A623', marginBottom: '14px', background: 'rgba(245,166,35,0.1)', padding: '16px', borderRadius: '50%' }}>{sport.icon}</div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{sport.name}</div>
                <div style={{ fontSize: '15px', color: '#9CA3AF', lineHeight: 1.6 }}>{sport.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES CTA */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Packages & Pricing</span>
            <h2>Clear, <span className="text-gradient">Transparent Pricing</span></h2>
            <p>No hidden fees. Choose the package that fits your game. Pay via Venmo — it's that simple.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {[
              {
                icon: <Activity size={32} color="#F5A623" />, sport: 'Football', href: '/packages/football',
                highlight: 'Football Package 4 — $225',
                desc: 'All Super Sonic, Mama Jama Locks, Level 4 and Special plays through Monday.',
                plays: ['Super Sonic Play', 'Level 4 Plays', 'Level 3 Daily', 'Mama Jama Locks']
              },
              {
                icon: <Dribbble size={32} color="#F5A623" />, sport: 'Basketball', href: '/packages/basketball',
                highlight: 'NCAAB Level 4 Plays — $40/day',
                desc: 'Daily plays for College Basketball, rated to be very good plays each game.',
                plays: ['NCAAB Super Sonic', 'Level 4 Daily', 'Saturday 4 Play Special', 'Early Bird Tournament']
              },
              {
                icon: <Target size={32} color="#F5A623" />, sport: 'Baseball', href: '/packages/baseball',
                highlight: 'Monthly Membership — $450',
                desc: 'Full month of MLB picks with deep statistical analysis for the entire month.',
                plays: ['1 High Octane Play', '1 Week Membership', 'Monthly Membership', 'Season Membership']
              },
            ].map(pkg => (
              <div key={pkg.sport} className="pricing-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(245,166,35,0.1)', padding: '12px', borderRadius: '12px' }}>{pkg.icon}</div>
                  <span className="badge badge-gold" style={{ fontSize: '13px' }}>{pkg.sport}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#F5A623', marginBottom: '10px' }}>{pkg.highlight}</div>
                  <p className="pricing-desc">{pkg.desc}</p>
                </div>
                <ul className="pricing-features">
                  {pkg.plays.map(p => <li key={p}>{p}</li>)}
                </ul>
                <Link href={pkg.href} className="btn btn-primary btn-lg" style={{ marginTop: 'auto', fontSize: '17px' }}>
                  View All {pkg.sport} Packages →
                </Link>
              </div>
            ))}
          </div>

          {/* Payment instructions box */}
          <div style={{ marginTop: '40px', background: 'rgba(245,166,35,0.07)', border: '2px solid rgba(245,166,35,0.25)', borderRadius: '16px', padding: '32px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(245,166,35,0.15)', padding: '16px', borderRadius: '50%' }}><Banknote size={40} color="#F5A623" /></div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '22px', marginBottom: '10px' }}>How to Pay — It's Easy</h3>
              <p style={{ color: '#D1D5DB', fontSize: '17px', lineHeight: 1.7 }}>
                Send your payment via Venmo to <strong style={{ color: '#F5A623' }}>@UncleharrysSports</strong>, then call or text
                <strong style={{ color: '#F5A623' }}> 941-914-5885</strong> to confirm your order and get your picks started the same day.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="tel:9419145885" className="btn btn-primary" style={{ fontSize: '17px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={18} /> Call 941-914-5885</a>
              <a href="sms:51501&body=PICK" className="btn btn-outline" style={{ fontSize: '17px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}><Smartphone size={18} /> Text PICK to 51501</a>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" style={{ background: 'var(--navy-light)', borderTop: '1px solid var(--navy-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Member Testimonials</span>
            <h2>What Our <span className="text-gradient">Members Say</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card" style={{ padding: '36px' }}>
                <div style={{ color: '#F5A623', fontSize: '24px', marginBottom: '16px' }}>
                  {'★'.repeat(t.rating)}
                </div>
                <p style={{ color: '#E5E7EB', fontSize: '17px', lineHeight: 1.8, fontStyle: 'italic' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #F5A623, #D4841A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'Outfit', color: '#070B14', fontSize: '20px' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '17px' }}>{t.name}</div>
                    <div style={{ fontSize: '14px', color: '#6B7280' }}>Verified Member</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREE SMS CTA */}
      <section className="section" style={{ borderTop: '1px solid var(--navy-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(245,166,35,0.1)', padding: '20px', borderRadius: '50%' }}>
                <Smartphone size={48} color="#F5A623" />
              </div>
            </div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '40px', fontWeight: 800, marginBottom: '20px' }}>
              Get Free Picks <span className="text-gradient">By Text Message</span>
            </h2>
            <p style={{ color: '#D1D5DB', fontSize: '19px', lineHeight: 1.8, marginBottom: '36px' }}>
              It's simple — just text the word <strong style={{ color: '#F5A623' }}>PICK</strong> to <strong style={{ color: '#F5A623' }}>51501</strong> and we'll
              start sending you free expert sports picks directly to your phone. No apps, no passwords.
              Just text and picks.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="sms:51501&body=PICK" className="btn btn-primary btn-lg" style={{ fontSize: '20px', padding: '18px 44px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Smartphone size={22} /> Text PICK to 51501
              </a>
              <Link href="/free-picks" className="btn btn-outline btn-lg" style={{ fontSize: '18px' }}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
