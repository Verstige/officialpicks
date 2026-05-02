import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { Search, Target, CreditCard, Calendar, Smartphone, Ticket, Activity, Dribbble, Flag } from 'lucide-react'

// ────────────────────────────────────────────────────────
//  DEMO PAGE — No Supabase required. Shows the Client
//  Portal with realistic mock data for preview purposes.
// ────────────────────────────────────────────────────────

const DEMO_PICKS = [
    {
        id: 'p1',
        title: 'Lakers -3.5 vs Celtics',
        description: 'Strong line value here. Lakers have won 7 of their last 10 at home and Celtics are on the second night of a back-to-back. This is a Super Sonic play.',
        sport: 'basketball',
        level: 'Super Sonic',
        result: null,
        published_at: new Date().toISOString(),
    },
    {
        id: 'p2',
        title: 'Duke -7 vs UNC (NCAAB)',
        description: 'Tournament must-win for Duke. Blue Devils have covered 6 of their last 8 conference matchups. Level 4 play — high confidence.',
        sport: 'basketball',
        level: '4',
        result: 'win',
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
        id: 'p3',
        title: 'Yankees Over 8.5 runs',
        description: 'Opposing starter has a 6.2 ERA in day games. Yankees offense is clicking — averaging 7.1 runs over the last 5 outings.',
        sport: 'baseball',
        level: '3',
        result: null,
        published_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
]

const DEMO_SUBSCRIPTION = {
    package_name: 'Monthly Basketball Membership',
    sport: 'basketball',
    start_date: '2026-02-01',
    end_date: '2026-04-01',
    amount_paid: 450,
    payment_method: 'Venmo',
}

const sportIcons: Record<string, React.ReactNode> = {
    football: <Activity size={20} color="#F5A623" />,
    basketball: <Dribbble size={20} color="#F5A623" />,
    baseball: <Target size={20} color="#F5A623" />,
    horse_racing: <Flag size={20} color="#F5A623" />
}
const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

export default function DemoPortalPage() {
    return (
        <div className="dashboard-layout">
            <Sidebar role="client" name="Marcus Johnson" />

            <div className="main-content">
                {/* Demo banner */}
                <div style={{
                    background: 'linear-gradient(90deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))',
                    border: '1px solid rgba(59,130,246,0.4)',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                    fontSize: '13px',
                    color: '#60A5FA',
                }}>
                    <Search size={16} />
                    <strong>DEMO MODE</strong>
                    <span style={{ color: '#9CA3AF' }}>— This is a preview of the Client Portal with sample data.</span>
                    <Link href="/register" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto', fontSize: '12px' }}>
                        Create Real Account →
                    </Link>
                </div>

                <div className="page-header">
                    <h1>Welcome back, Marcus</h1>
                    <p>Here&apos;s your picks dashboard for today — {today}</p>
                </div>

                <div className="page-body">
                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'transparent' }}><Target size={28} color="#F5A623" /></div>
                            <div className="stat-label">Today&apos;s Picks</div>
                            <div className="stat-value">{DEMO_PICKS.length}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'transparent' }}><CreditCard size={28} color="#F5A623" /></div>
                            <div className="stat-label">Active Packages</div>
                            <div className="stat-value">1</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'transparent' }}><Calendar size={28} color="#F5A623" /></div>
                            <div className="stat-label">Member Since</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>Feb 2026</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'transparent' }}><Smartphone size={28} color="#F5A623" /></div>
                            <div className="stat-label">SMS Picks</div>
                            <div className="stat-value" style={{ fontSize: '14px' }}>
                                <a href="sms:51501&body=PICK" style={{ color: '#F5A623' }}>Text PICK to 51501</a>
                            </div>
                        </div>
                    </div>

                    {/* Active Subscription */}
                    <div className="table-container" style={{ marginBottom: '24px' }}>
                        <div className="table-header-bar">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Ticket size={20} color="#F5A623" /> Your Active Packages</h3>
                        </div>
                        <div style={{ padding: '16px' }}>
                            <div className="pick-card">
                                <div className="pick-sport-badge" style={{ background: 'transparent', border: '1px solid rgba(245,166,35,0.2)' }}>{sportIcons[DEMO_SUBSCRIPTION.sport]}</div>
                                <div className="pick-info">
                                    <div className="pick-title">{DEMO_SUBSCRIPTION.package_name}</div>
                                    <div className="pick-meta">
                                        Expires: {new Date(DEMO_SUBSCRIPTION.end_date).toLocaleDateString()} &nbsp;•&nbsp;
                                        ${DEMO_SUBSCRIPTION.amount_paid} paid via {DEMO_SUBSCRIPTION.payment_method}
                                    </div>
                                </div>
                                <span className="badge badge-green">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Today's Picks */}
                    <div className="table-container" style={{ marginBottom: '24px' }}>
                        <div className="table-header-bar">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={20} color="#F5A623" /> Today&apos;s Picks</h3>
                            <Link href="/portal/picks" className="btn btn-outline btn-sm">View All →</Link>
                        </div>
                        <div style={{ padding: '16px' }}>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {DEMO_PICKS.map((pick) => (
                                    <div key={pick.id} className="pick-card">
                                        <div className="pick-sport-badge" style={{ background: 'transparent', border: '1px solid rgba(245,166,35,0.2)' }}>{sportIcons[pick.sport] || <Target size={20} color="#F5A623" />}</div>
                                        <div className="pick-info">
                                            <div className="pick-title">{pick.title}</div>
                                            <div className="pick-desc">{pick.description}</div>
                                            <div className="pick-meta" style={{ marginTop: '6px' }}>
                                                {pick.sport.toUpperCase()} &nbsp;•&nbsp; Level {pick.level} &nbsp;•&nbsp;
                                                {new Date(pick.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        {pick.result ? (
                                            <span className={`badge ${pick.result === 'win' ? 'badge-green' : 'badge-red'}`}>
                                                {pick.result.toUpperCase()}
                                            </span>
                                        ) : (
                                            <span className="badge badge-gold">Live</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Upgrade CTA */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(245,166,35,0.08), transparent)',
                        border: '1px solid rgba(245,166,35,0.2)',
                        borderRadius: '16px',
                        padding: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <div>
                            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '8px' }}>Want coverage on more sports?</h3>
                            <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Add football or baseball packages to expand your picks coverage.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <Link href="/packages/football" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={18} /> Football</Link>
                            <Link href="/packages/baseball" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Target size={18} /> Baseball</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
