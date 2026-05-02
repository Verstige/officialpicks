import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Trophy, Phone, Banknote, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function HorseRacingPage() {
  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(245,166,35,0.1)', padding: '16px', borderRadius: '14px' }}>
              <Trophy size={36} color="#F5A623" />
            </div>
            <span style={{ fontFamily: 'Outfit', fontSize: '42px', fontWeight: 900 }}>
              🐎 <span className="text-gradient">Horse Racing</span>
            </span>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '20px', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
            Expert race-day selections for Churchill Downs, Keeneland, and all major tracks.
            Deep statistical analysis delivered directly to your phone.
          </p>
        </div>

        {/* Analyzer CTA */}
        <div style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.08), rgba(245,166,35,0.02))', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '24px', padding: '48px', textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
            🐎 Race Card Analyzer
          </h2>
          <p style={{ color: '#D1D5DB', fontSize: '17px', maxWidth: '500px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Upload any DRF race card PDF and get instant analysis — every horse scored on J/T combo, bloodline, pace, distance, and value. Overlay plays are flagged automatically.
          </p>
          <Link href="/horse-racing" className="btn btn-primary btn-lg" style={{ fontSize: '20px', padding: '18px 44px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            Open Analyzer <ArrowRight size={20} />
          </Link>
        </div>

        {/* Packages */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 800, marginBottom: '10px' }}>
              Horse Racing <span className="text-gradient">Packages</span>
            </h2>
            <p style={{ color: '#6B7280', fontSize: '16px' }}>Transparent pricing. Pay via Venmo. Start the same day you call.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              {
                title: 'Daily Horse Racing',
                price: '$75',
                period: '/ day',
                desc: 'All races analyzed from one major track — top picks, exactas, and overlays delivered by SMS.',
                features: ['Full card analysis (up to 14 races)', 'Top 4 picks per race', 'Exacta box recommendations', 'Overlay alerts', 'SMS delivery same day'],
                highlight: false,
              },
              {
                title: 'Weekend Special',
                price: '$175',
                period: '/ weekend',
                desc: 'Friday through Sunday — every major track covered with daily SMS picks.',
                features: ['3 days of race analysis', 'All major tracks (CD, KEE, BAQ, etc.)', 'Parlay and straight play recommendations', 'VIP text support line'],
                highlight: true,
              },
              {
                title: 'Full Month',
                price: '$450',
                period: '/ month',
                desc: 'Unlimited racing action — every track, every day. Best value for serious bettors.',
                features: ['30 days unlimited racing', 'Churchill Downs, Keeneland, Saratoga & more', 'Weekly strategy review by text', 'Priority SMS delivery', 'Historical data access'],
                highlight: false,
              },
            ].map(pkg => (
              <div key={pkg.title} className="pricing-card" style={{ borderColor: pkg.highlight ? 'rgba(245,166,35,0.4)' : undefined }}>
                {pkg.highlight && (
                  <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                    <span className="badge badge-gold">🔥 Most Popular</span>
                  </div>
                )}
                <div style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{pkg.title}</div>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'Outfit', fontSize: '36px', fontWeight: 900, color: '#F5A623' }}>{pkg.price}</span>
                  <span style={{ color: '#6B7280', fontSize: '16px' }}>{pkg.period}</span>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>{pkg.desc}</p>
                <ul className="pricing-features">
                  {pkg.features.map(f => (
                    <li key={f}><CheckCircle2 size={14} color="#22C55E" /> {f}</li>
                  ))}
                </ul>
                <div style={{ marginTop: '24px' }}>
                  <a href="tel:9419145885" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', fontSize: '17px' }}>
                    <Phone size={18} /> Call to Order
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Info */}
        <div style={{ background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '16px', padding: '32px', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(245,166,35,0.12)', padding: '16px', borderRadius: '50%' }}><Banknote size={36} color="#F5A623" /></div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '20px', marginBottom: '8px' }}>How to Pay</h3>
            <p style={{ color: '#D1D5DB', fontSize: '16px', lineHeight: 1.7 }}>
              Venmo to <strong style={{ color: '#F5A623' }}>@UncleharrysSports</strong> — then call or text{' '}
              <strong style={{ color: '#F5A623' }}>941-914-5885</strong> to confirm and get started same day.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="tel:9419145885" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} /> Call Now
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}