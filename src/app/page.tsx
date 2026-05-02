'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'
import { Trophy, Activity, Dribbble, Target, Flag, Package, CheckCircle2, Phone, Smartphone, Banknote, Mail, TrendingUp, Shield, Zap } from 'lucide-react'

const SPORTS = [
  { icon: <Activity color="#F5A623" size={44} />, name: 'NFL Football', desc: 'Pro & college picks year-round' },
  { icon: <Dribbble color="#F5A623" size={44} />, name: 'NBA Basketball', desc: 'Daily pro & college plays' },
  { icon: <Target color="#F5A623" size={44} />, name: 'MLB Baseball', desc: 'Full season coverage' },
  { icon: <Flag color="#F5A623" size={44} />, name: 'Horse Racing', desc: 'Expert race-day selections' },
]

const TESTIMONIALS = [
  {
    name: 'Martin Byrd',
    text: "The platform's clean design makes it a breeze to navigate, and the picks are consistently accurate. The free SMS text service is incredibly convenient. Official Picks has significantly improved my betting strategy and results.",
    rating: 5,
  },
  {
    name: 'James T.',
    text: "The track record is unmatched. I've been using the football package for two seasons and the ROI is real. Worth every penny.",
    rating: 5,
  },
  {
    name: 'David R.',
    text: "The premium plays are my go-to. Consistent daily value and the SMS delivery means I never miss a pick. Highly recommend.",
    rating: 5,
  },
]

const TICKER_ITEMS = [
  { team: 'CD R3', pick: '#1 Arro Smash 15-1 ✅' },
  { team: 'CD R4', pick: '#2 Bear River 30-1 ✅' },
  { team: 'CD R6', pick: '#1 Brotha Keny 15-1 ✅' },
  { team: 'CD R8', pick: '#5 Stop the Car 20-1 ✅' },
  { team: 'CD R9', pick: '#5 Blackout Time 10-1 ✅' },
  { team: 'CD R10', pick: '#6 Cornucopian 7-2 ✅' },
  { team: 'CD R12', pick: '#1 Renegade 4-1 ✅' },
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
        toast.success("🎉 You're in! Check your email for free picks.")
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', padding: '8px 16px', borderRadius: '9999px', marginBottom: '20px', fontSize: '14px', color: '#F5A623', fontWeight: 600 }}>
              <Zap size={14} color="#F5A623" /> Now Live — Kentucky Derby Day Coverage
            </div>
            <h1>
              Expert Picks.<br />
              <span className="text-gradient">Proven Results.</span>
            </h1>
            <p>
              Advanced sports handicapping for NFL, NBA, MLB, College Sports, and Horse Racing.
              Every pick backed by statistical analysis, market intelligence, and 15+ years of expertise.
              <strong style={{ color: '#F5A623' }}> Don't bet blind — bet with the best.</strong>
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
                <div className="number">4 Sports</div>
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

      {/* HOW IT WORKS */}
      <section style={{ background: 'var(--navy-light)', borderTop: '1px solid var(--navy-border)', borderBottom: '1px solid var(--navy-border)', padding: '64px 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Simple Process</span>
            <h2>How It <span className="text-gradient">Works</span></h2>
            <p>Getting started takes less than 2 minutes. No confusing setup.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
            {[
              { step: '1', icon: <Package size={32} color="#F5A623" />, title: 'Pick Your Package', desc: 'Browse football, basketball, baseball, and horse racing packages. Options start at just $20.' },
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

      {/* SPORTS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What We Cover</span>
            <h2>Expert Picks <span className="text-gradient">Every Sport</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {SPORTS.map(s => (
              <div key={s.name} className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '19px', marginBottom: '8px' }}>{s.name}</h3>
                <p style={{ color: '#9CA3AF', fontSize: '15px' }}>{s.desc}</p>
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

      {/* WHY CHOOSE US */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Us</span>
            <h2>Why Choose <span className="text-gradient">Official Picks?</span></h2>
            <p>
              When you choose Official Picks, you're not just getting picks — you're getting a proven system built
              on statistical analysis, market intelligence, and years of expertise.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { icon: <TrendingUp size={28} color="#F5A623" />, title: 'Proven Track Record', desc: '15+ years of consistent returns across NFL, NBA, MLB, and Horse Racing.' },
              { icon: <Shield size={28} color="#F5A623" />, title: 'Data-Driven Analysis', desc: 'Every pick is built on deep statistical analysis — not gut feelings or hot takes.' },
              { icon: <Zap size={28} color="#F5A623" />, title: 'Real-Time Delivery', desc: 'Picks delivered by SMS and email before games go live. You\'ll never miss a play.' },
              { icon: <Smartphone size={28} color="#F5A623" />, title: 'Free SMS Service', desc: 'Text PICK to 51501 and get free picks delivered straight to your phone — no app needed.' },
              { icon: <Activity size={28} color="#F5A623" />, title: 'Multiple Sports', desc: 'Football, basketball, baseball, and horse racing — all covered every single day.' },
              { icon: <Target size={28} color="#F5A623" />, title: 'Tiers of Plays', desc: 'From entry-level to highest-confidence locks. Pick the package that matches your bankroll.' },
            ].map(item => (
              <div key={item.title} className="card" style={{ padding: '28px 24px', display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(245,166,35,0.1)', padding: '12px', borderRadius: '10px', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '17px', marginBottom: '6px' }}>{item.title}</h4>
                  <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <a href="sms:51501&body=PICK" className="btn btn-outline" style={{ fontSize: '17px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto', width: 'fit-content' }}><Smartphone size={18} /> Text PICK to 51501</a>
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
              It&apos;s simple — just text the word <strong style={{ color: '#F5A623' }}>PICK</strong> to <strong style={{ color: '#F5A623' }}>51501</strong> and we&apos;ll
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