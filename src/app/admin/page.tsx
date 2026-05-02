export const dynamic = 'force-dynamic'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
    if (profile?.role !== 'admin') redirect('/portal')

    // Stats
    const [
        { count: totalClients },
        { count: activeClients },
        { count: totalLeads },
        { count: totalPicks },
        { data: recentClients },
        { data: recentPicks },
    ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('picks').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*, profiles(full_name, email)').order('created_at', { ascending: false }).limit(5),
        supabase.from('picks').select('*').order('published_at', { ascending: false }).limit(5),
    ])

    const sportEmoji: Record<string, string> = { football: '🏈', basketball: '🏀', baseball: '⚾', horse_racing: '🐎' }

    return (
        <div className="dashboard-layout">
            <Sidebar role="admin" name={profile?.full_name || user.email} />
            <div className="main-content">
                <div className="page-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h1>Admin Dashboard</h1>
                            <p>Harry's Picks — Business Overview</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Link href="/admin/picks" className="btn btn-primary btn-sm">🎯 Post New Pick</Link>
                            <Link href="/admin/clients" className="btn btn-outline btn-sm">👥 Manage Clients</Link>
                        </div>
                    </div>
                </div>

                <div className="page-body">
                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-label">Total Clients</div>
                            <div className="stat-value">{totalClients || 0}</div>
                            <div className="stat-sub">{activeClients || 0} active</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📧</div>
                            <div className="stat-label">Email Leads</div>
                            <div className="stat-value">{totalLeads || 0}</div>
                            <div className="stat-sub">captured signups</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🎯</div>
                            <div className="stat-label">Picks Posted</div>
                            <div className="stat-value">{totalPicks || 0}</div>
                            <div className="stat-sub">all time</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📞</div>
                            <div className="stat-label">Contact</div>
                            <div className="stat-value" style={{ fontSize: '14px' }}>
                                <a href="tel:9419145885" style={{ color: '#F5A623' }}>941-914-5885</a>
                            </div>
                            <div className="stat-sub">Venmo: @UncleharrysSports</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flexWrap: 'wrap' }}>
                        {/* Recent Clients */}
                        <div className="table-container">
                            <div className="table-header-bar">
                                <h3>👥 Recent Clients</h3>
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
                                    {recentClients?.length ? recentClients.map((c: any) => (
                                        <tr key={c.id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: '#fff' }}>{c.full_name || c.email}</div>
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
                                    )) : (
                                        <tr><td colSpan={3} style={{ textAlign: 'center', color: '#6B7280', padding: '24px' }}>No clients yet</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Recent Picks */}
                        <div className="table-container">
                            <div className="table-header-bar">
                                <h3>🎯 Recent Picks</h3>
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
                                    {recentPicks?.length ? recentPicks.map((p: any) => (
                                        <tr key={p.id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: '#fff' }}>{p.title}</div>
                                                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                                                    {new Date(p.published_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td>{sportEmoji[p.sport] || '🏆'} {p.sport}</td>
                                            <td>
                                                {p.result ? (
                                                    <span className={`badge ${p.result === 'win' ? 'badge-green' : p.result === 'loss' ? 'badge-red' : 'badge-gray'}`}>
                                                        {p.result}
                                                    </span>
                                                ) : <span className="badge badge-gold">Pending</span>}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} style={{ textAlign: 'center', color: '#6B7280', padding: '24px' }}>No picks yet</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        {[
                            { href: '/admin/picks', icon: '🎯', label: 'Post New Pick', desc: 'Release to subscribers' },
                            { href: '/admin/clients', icon: '👥', label: 'Manage Clients', desc: 'Assign salespeople & tags' },
                            { href: '/admin/leads', icon: '📧', label: 'View Leads', desc: 'Email capture list' },
                            { href: '/admin/salespeople', icon: '💼', label: 'Salespeople', desc: 'Manage your team' },
                            { href: '/admin/emails', icon: '✉️', label: 'Email Broadcast', desc: 'Send to all clients' },
                            { href: '/admin/packages', icon: '📦', label: 'Packages', desc: 'Manage offerings' },
                        ].map(action => (
                            <Link key={action.href} href={action.href} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '6px', textDecoration: 'none' }}>
                                <div style={{ fontSize: '24px' }}>{action.icon}</div>
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
