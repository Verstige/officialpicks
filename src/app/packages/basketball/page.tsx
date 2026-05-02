import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Dribbble, Banknote, Phone } from 'lucide-react'

const BASKETBALL_PACKAGES = [
    {
        name: 'NCAAB Super Sonic Play',
        price: 55,
        period: 'day',
        featured: true,
        desc: 'The highest-confidence College Basketball play of the day. Our top-rated NCAAB selection.',
        features: ['NCAAB Super Sonic top pick', 'Highest confidence rating', 'Daily release'],
    },
    {
        name: 'NCAAB Level 4 Plays Daily',
        price: 40,
        period: 'day',
        featured: false,
        desc: 'Daily Level 4 rated NCAAB selections — consistently high-value plays all season.',
        features: ['Level 4 NCAAB plays', 'Daily selections', 'Data-driven picks'],
    },
    {
        name: 'Saturday 4 Play NCAAB Special',
        price: 20,
        period: 'Saturday',
        featured: false,
        desc: 'Four expertly selected NCAAB plays for every Saturday — perfect for the weekend bettor.',
        features: ['4 NCAAB plays every Saturday', 'Expert selections', 'Weekly package'],
    },
    {
        name: 'Early Bird College Basketball Tournaments',
        price: 295,
        period: 'tournament',
        featured: false,
        desc: 'Full tournament package for College Basketball — March Madness and conference tournaments.',
        features: ['Full tournament coverage', 'All rounds included', 'Early bird pricing', 'Conference + March Madness'],
    },
]

export default function BasketballPackagesPage() {
    return (
        <>
            <Navbar />
            <div style={{ background: 'linear-gradient(180deg, rgba(245,166,35,0.07) 0%, transparent 40%)', borderBottom: '1px solid rgba(245,166,35,0.1)', padding: '56px 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <span className="badge badge-gold" style={{ marginBottom: '16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Dribbble size={14} /> NBA & College Basketball</span>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: '16px' }}>
                        Basketball <span className="text-gradient">Packages</span>
                    </h1>
                    <p style={{ color: '#9CA3AF', fontSize: '17px', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
                        Stay ahead of the game with our NBA and NCAAB handicapping packages. Daily picks,
                        tournament specials, and more — all powered by deep analysis.
                    </p>
                    <div style={{ marginTop: '24px', padding: '14px 20px', background: 'rgba(245,166,35,0.08)', borderRadius: '12px', border: '1px solid rgba(245,166,35,0.2)', display: 'inline-block' }}>
                        <p style={{ color: '#F5A623', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Banknote size={16} /> Pay via Venmo: <strong>@UncleharrysSports</strong></span> &nbsp;|&nbsp;
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> Call/text after payment: <a href="tel:9419145885" style={{ color: '#F5A623' }}>941-914-5885</a></span>
                        </p>
                    </div>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div className="pricing-grid">
                        {BASKETBALL_PACKAGES.map((pkg) => (
                            <div key={pkg.name} className={`pricing-card ${pkg.featured ? 'featured' : ''}`}>
                                {pkg.featured && <span className="badge badge-gold pricing-badge">Top Pick</span>}
                                <div>
                                    <h3 className="pricing-name" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Dribbble size={24} color="#F5A623" /> {pkg.name}</h3>
                                    <p className="pricing-desc" style={{ marginTop: '8px' }}>{pkg.desc}</p>
                                </div>
                                <div className="pricing-price">
                                    <span className="currency">$</span>
                                    <span className="amount">{pkg.price}</span>
                                    <span className="period">/ {pkg.period}</span>
                                </div>
                                <ul className="pricing-features">
                                    {pkg.features.map(f => <li key={f}>{f}</li>)}
                                </ul>
                                <div className="pricing-cta" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <a
                                        href={`https://venmo.com/UncleharrysSports?txn=pay&amount=${pkg.price}&note=${encodeURIComponent(pkg.name)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`btn ${pkg.featured ? 'btn-primary' : 'btn-outline'}`}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <Banknote size={18} /> Pay via Venmo — ${pkg.price}
                                    </a>
                                    <a href="tel:9419145885" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Phone size={16} /> Call to Order
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}
