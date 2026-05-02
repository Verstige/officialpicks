import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Activity, Banknote, Phone } from 'lucide-react'

const FOOTBALL_PACKAGES = [
    {
        name: 'Football Package 4',
        price: 225,
        period: 'week',
        featured: true,
        desc: 'The complete package — includes Code 5, Super Sonic, Mama Jama Locks, Level 4, and all Special plays through Monday.',
        features: [
            'Code 5 plays (highest rated)',
            'Super Sonic Play of the Day',
            'Mama Jama Locks',
            'Level 4 Plays of the Day',
            'All Special Plays through Monday',
            'Call/text 941-914-5885 after payment',
        ],
    },
    {
        name: 'Daily Full Package',
        price: 125,
        period: 'day',
        featured: false,
        desc: 'Includes Super Sonic, Mama Jama Locks, Level 4, and all Special plays for the day.',
        features: [
            'Super Sonic Play of the Day',
            'Mama Jama Locks',
            'Level 4 Plays of the Day',
            'All Special daily plays',
        ],
    },
    {
        name: 'Super Sonic Play of the Day',
        price: 55,
        period: 'day',
        featured: false,
        desc: 'Our highest-confidence single play. Includes all lower-rated plays for the day.',
        features: ['Super Sonic highest-confidence play', 'Includes all other levels', 'Daily release'],
    },
    {
        name: 'Level 4 Plays of the Day',
        price: 40,
        period: 'day',
        featured: false,
        desc: 'Level 4 rated selections — our top daily plays that go through rigorous qualification.',
        features: ['Level 4 quality plays', 'Hand-picked daily', 'Data-driven selection'],
    },
    {
        name: 'Level 3 Play Daily',
        price: 20,
        period: 'day',
        featured: false,
        desc: 'Daily Level 3 play — great entry-level pick for those getting started with Harry\'s system.',
        features: ['Level 3 daily selection', 'Perfect entry-level pick', 'Budget-friendly'],
    },
    {
        name: 'Super Bowl Special',
        price: 25,
        period: 'game',
        featured: false,
        desc: 'Special Super Bowl pick package for the biggest game of the year.',
        features: ['Super Bowl game pick', 'Special analysis', 'One-time purchase'],
    },
]

export default function FootballPackagesPage() {
    return (
        <>
            <Navbar />
            <div style={{ background: 'linear-gradient(180deg, rgba(245,166,35,0.07) 0%, transparent 40%)', borderBottom: '1px solid rgba(245,166,35,0.1)', padding: '56px 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <span className="badge badge-gold" style={{ marginBottom: '16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Activity size={14} /> NFL & College Football</span>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: '16px' }}>
                        Football <span className="text-gradient">Packages</span>
                    </h1>
                    <p style={{ color: '#9CA3AF', fontSize: '17px', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
                        Prepare for the NFL season with comprehensive handicapping packages. Every play is hand-picked
                        and must pass through strict criteria before being released to members.
                    </p>
                    <div style={{ padding: '14px 20px', background: 'rgba(245,166,35,0.08)', borderRadius: '12px', border: '1px solid rgba(245,166,35,0.2)', display: 'inline-block', marginTop: '24px' }}>
                        <p style={{ color: '#F5A623', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Banknote size={16} /> Pay via Venmo: <strong>@UncleharrysSports</strong></span> &nbsp;|&nbsp;
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> Call/text after payment: <a href="tel:9419145885" style={{ color: '#F5A623' }}>941-914-5885</a></span>
                        </p>
                    </div>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '32px', lineHeight: 1.7, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--navy-border)', borderRadius: '10px', padding: '16px 20px' }}>
                        ⭐ <strong style={{ color: '#F5A623' }}>Note:</strong> All Level 1 through 4 games are rated to be very good plays. Each game we select is hand-picked and must go through certain criteria to qualify as a member's play. There will be approximately 7–10 football plays per week on average.
                    </p>
                    <div className="pricing-grid">
                        {FOOTBALL_PACKAGES.map((pkg) => (
                            <div key={pkg.name} className={`pricing-card ${pkg.featured ? 'featured' : ''}`}>
                                {pkg.featured && <span className="badge badge-gold pricing-badge">Most Popular</span>}
                                <div>
                                    <h3 className="pricing-name" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Activity size={24} color="#F5A623" /> {pkg.name}</h3>
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
