import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Target, Banknote, Phone } from 'lucide-react'

const BASEBALL_PACKAGES = [
    {
        name: 'Baseball Season Membership',
        price: 2500,
        period: 'season',
        featured: true,
        desc: 'The full season package — every single MLB pick from Opening Day through the World Series. Ultimate value.',
        features: ['Every MLB pick all season', 'Deep statistical analysis', 'Insider info & trends', 'SMS + email delivery', 'Priority support'],
    },
    {
        name: 'Monthly Baseball Membership',
        price: 450,
        period: 'month',
        featured: false,
        desc: 'A full month of MLB picks. Perfect for bettors who want consistent action all month long.',
        features: ['Full month of picks', 'Daily MLB selections', 'All levels included'],
    },
    {
        name: 'Baseball Special',
        price: 175,
        period: 'week',
        featured: false,
        desc: 'Weekly MLB special package — expert picks curated for the week\'s best value games.',
        features: ['Weekly pick package', 'Best value games', 'Expert curation'],
    },
    {
        name: '1 Week Baseball Membership',
        price: 125,
        period: 'week',
        featured: false,
        desc: 'One full week of baseball picks — ideal for a quick run or testing the waters.',
        features: ['7 days of picks', 'Daily MLB selections', 'No long-term commitment'],
    },
    {
        name: '1 High Octane Play',
        price: 100,
        period: 'play',
        featured: false,
        desc: 'Our single highest-confidence MLB play. When Harry loves a game — this is it.',
        features: ['Single premium pick', 'Highest confidence rating', 'Full analysis included'],
    },
]

export default function BaseballPackagesPage() {
    return (
        <>
            <Navbar />
            <div style={{ background: 'linear-gradient(180deg, rgba(245,166,35,0.07) 0%, transparent 40%)', borderBottom: '1px solid rgba(245,166,35,0.1)', padding: '56px 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <span className="badge badge-gold" style={{ marginBottom: '16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Target size={14} /> MLB Baseball</span>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: '16px' }}>
                        Baseball <span className="text-gradient">Packages</span>
                    </h1>
                    <p style={{ color: '#9CA3AF', fontSize: '17px', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
                        Unlock the potential of your baseball betting strategy with expertly crafted handicapping
                        packages. Built on deep statistical analysis, insider knowledge, and passion for the game.
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
                        {BASEBALL_PACKAGES.map((pkg) => (
                            <div key={pkg.name} className={`pricing-card ${pkg.featured ? 'featured' : ''}`}>
                                {pkg.featured && <span className="badge badge-gold pricing-badge">Best Value</span>}
                                <div>
                                    <h3 className="pricing-name" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Target size={24} color="#F5A623" /> {pkg.name}</h3>
                                    <p className="pricing-desc" style={{ marginTop: '8px' }}>{pkg.desc}</p>
                                </div>
                                <div className="pricing-price">
                                    <span className="currency">$</span>
                                    <span className="amount">{pkg.price.toLocaleString()}</span>
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
                                        <Banknote size={18} /> Pay via Venmo — ${pkg.price.toLocaleString()}
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
