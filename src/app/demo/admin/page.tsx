import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { Search, Target, Users, Mail, Banknote, Briefcase, Package, Activity, Dribbble, Flag } from 'lucide-react'

// ────────────────────────────────────────────────────────
//  DEMO PAGE — No Supabase required. Shows the Admin
//  Dashboard with realistic mock data so you can preview
//  the full UI experience.
// ────────────────────────────────────────────────────────

const DEMO_CLIENTS = [
    { id: '1', full_name: 'Marcus Johnson', email: 'marcus@email.com', status: 'active', created_at: '2025-12-14' },
    { id: '2', full_name: 'Tanya Williams', email: 'tanya@email.com', status: 'active', created_at: '2025-12-20' },
    { id: '3', full_name: 'David Reyes', email: 'david@email.com', status: 'lead', created_at: '2026-01-05' },
    { id: '4', full_name: 'Sandra Lee', email: 'sandra@email.com', status: 'active', created_at: '2026-01-18' },
    { id: '5', full_name: 'James Carter', email: 'james@email.com', status: 'inactive', created_at: '2026-02-01' },
]

const DEMO_PICKS = [
    { id: 'p1', title: '🏀 Lakers -3.5 vs Celtics', sport: 'basketball', result: 'win', published_at: '2026-03-03T13:00:00Z' },
    { id: 'p2', title: '🏈 Chiefs ML vs Ravens', sport: 'football', result: 'win', published_at: '2026-03-02T18:00:00Z' },
    { id: 'p3', title: '⚾ Yankees Over 8.5 runs', sport: 'baseball', result: null, published_at: '2026-03-03T14:30:00Z' },
    { id: 'p4', title: 'Duke -7 vs UNC (NCAAB)', sport: 'basketball', result: 'loss', published_at: '2026-03-01T20:00:00Z' },
    { id: 'p5', title: 'Horse Racing: Race 5 — Exacta', sport: 'horse_racing', result: 'win', published_at: '2026-02-28T16:00:00Z' },
]

const sportIcons: Record<string, React.ReactNode> = {
    football: <Activity size={20} color="#F5A623" />,
    basketball: <Dribbble size={20} color="#F5A623" />,
    baseball: <Target size={20} color="#F5A623" />,
    horse_racing: <Flag size={20} color="#F5A623" />
}

export default function DemoAdminPage() {
    const totalClients = 142
    const activeClients = 98
    const totalLeads = 401
    const totalPicks = 334

    return (
        <div className="dashboard-layout">
            <Sidebar role="admin" name="Harry (Admin)" />

            <div className="main-content">
                {/* Demo banner */}
                <div style={{
                    background: 'linear-gradient(90deg, rgba(245,166,35,0.15), rgba(245,166,35,0.05))',
                    border: '1px solid rgba(245,166,35,0.4)',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                    fontSize: '13px',
                    color: '#F5A623',
                }}>
                    <Search size={16} />
                    <strong>DEMO MODE</strong>
                    <span style={{ color: '#9CA3AF' }}>— This is a live preview with sample data. Connect Supabase to go live.</span>
                    <Link href="/login" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto', fontSize: '12px' }}>
                        Connect &amp; Sign In →
                    </Link>
                </div>

                <div className="page-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h1>Admin Dashboard</h1>
                            <p>Harry&apos;s Picks — Business Overview</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Link href="/demo/admin/picks" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Target size={14} /> Post New Pick</Link>
                            <Link href="/demo/admin/clients" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> Manage Clients</Link>
                        </div>
                    </div>
                </div>

                <div className="page-body">
                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'transparent' }}><Users size={28} color="#F5A623" /></div>
                            <div className="stat-label">Total Clients</div>
                            <div className="stat-value">{totalClients}</div>
                            <div className="stat-sub">{activeClients} active</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'transparent' }}><Mail size={28} color="#F5A623" /></div>
                            <div className="stat-label">Email Leads</div>
                            <div className="stat-value">{totalLeads}</div>
                            <div className="stat-sub">captured signups</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'transparent' }}><Target size={28} color="#F5A623" /></div>
                            <div className="stat-label">Picks Posted</div>
                            <div className="stat-value">{totalPicks}</div>
                            <div className="stat-sub">all time</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'transparent' }}><Banknote size={28} color="#F5A623" /></div>
                            <div className="stat-label">Est. Monthly Revenue</div>
                            <div className="stat-value" style={{ fontSize: '22px' }}>$18,400</div>
                            <div className="stat-sub" style={{ color: '#22C55E' }}>↑ 12% this month</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flexWrap: 'wrap' }}>
                        {/* Recent Clients */}
                        <div className="table-container">
                            <div className="table-header-bar">
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={20} color="#F5A623" /> Recent Clients</h3>
                                <Link href="/admin/clients" className="btn btn-outline btn-sm">View All</Link>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DEMO_CLIENTS.map((c) => (
                                        <tr key={c.id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: '#fff' }}>{c.full_name}</div>
                                                <div style={{ fontSize: '12px', color: '#6B7280' }}>{c.email}</div>
                                            </td>
                                            <td>
                                                <span className={`badge ${c.status === 'active' ? 'badge-green' : c.status === 'lead' ? 'badge-gold' : 'badge-gray'}`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td style={{ color: '#6B7280', fontSize: '13px' }}>
                                                {new Date(c.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Recent Picks */}
                        <div className="table-container">
                            <div className="table-header-bar">
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={20} color="#F5A623" /> Recent Picks</h3>
                                <Link href="/admin/picks" className="btn btn-primary btn-sm">+ Post Pick</Link>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Pick</th>
                                        <th>Sport</th>
                                        <th>Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DEMO_PICKS.map((p) => (
                                        <tr key={p.id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: '#fff' }}>{p.title}</div>
                                                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                                                    {new Date(p.published_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{sportIcons[p.sport] || <Target size={20} color="#F5A623" />} <span style={{ textTransform: 'capitalize' }}>{p.sport.replace('_', ' ')}</span></td>
                                            <td>
                                                {p.result ? (
                                                    <span className={`badge ${p.result === 'win' ? 'badge-green' : p.result === 'loss' ? 'badge-red' : 'badge-gray'}`}>
                                                        {p.result}
                                                    </span>
                                                ) : <span className="badge badge-gold">Pending</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        {[
                            { href: '/admin/picks', icon: <Target size={24} color="#F5A623" />, label: 'Post New Pick', desc: 'Release to subscribers' },
                            { href: '/admin/clients', icon: <Users size={24} color="#F5A623" />, label: 'Manage Clients', desc: 'Assign salespeople & tags' },
                            { href: '/admin/leads', icon: <Mail size={24} color="#F5A623" />, label: 'View Leads', desc: 'Email capture list' },
                            { href: '/admin/salespeople', icon: <Briefcase size={24} color="#F5A623" />, label: 'Salespeople', desc: 'Manage your team' },
                            { href: '/admin/emails', icon: <Mail size={24} color="#F5A623" />, label: 'Email Broadcast', desc: 'Send to all clients' },
                            { href: '/admin/packages', icon: <Package size={24} color="#F5A623" />, label: 'Packages', desc: 'Manage offerings' },
                        ].map(action => (
                            <Link key={action.href} href={action.href} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '6px', textDecoration: 'none' }}>
                                <div style={{ marginBottom: '8px' }}>{action.icon}</div>
                                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '14px' }}>{action.label}</div>
                                <div style={{ fontSize: '12px', color: '#6B7280' }}>{action.desc}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
