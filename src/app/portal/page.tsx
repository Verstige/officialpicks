export const dynamic = 'force-dynamic'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PortalPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (profile?.role === 'admin') redirect('/admin')
    if (profile?.role === 'salesperson') redirect('/salesman')

    // Get client data
    const { data: client } = await supabase.from('clients').select('*, subscriptions(*, packages(*))').eq('user_id', user.id).single()

    // Get today's picks (public or assigned)
    const today = new Date().toISOString().split('T')[0]
    const { data: picks } = await supabase
        .from('picks')
        .select('*')
        .gte('published_at', today)
        .order('published_at', { ascending: false })
        .limit(5)

    const activeSubscriptions = client?.subscriptions?.filter((s: any) => s.status === 'active') || []
    const sportEmoji: Record<string, string> = { football: '🏈', basketball: '🏀', baseball: '⚾', horse_racing: '🐎' }

    return (
        <div className="dashboard-layout">
            <Sidebar role="client" name={profile?.full_name || user.email} />
            <div className="main-content">
                <div className="page-header">
                    <h1>Welcome back, {profile?.full_name?.split(' ')[0] || 'Member'} 👋</h1>
                    <p>Here's your picks dashboard for today — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="page-body">
                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">🎯</div>
                            <div className="stat-label">Today's Picks</div>
                            <div className="stat-value">{picks?.length || 0}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">💳</div>
                            <div className="stat-label">Active Packages</div>
                            <div className="stat-value">{activeSubscriptions.length}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📅</div>
                            <div className="stat-label">Member Since</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>
                                {client?.created_at ? new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'New'}
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📱</div>
                            <div className="stat-label">SMS Picks</div>
                            <div className="stat-value" style={{ fontSize: '14px' }}>
                                <a href="sms:51501&body=PICK" style={{ color: '#F5A623' }}>Text PICK to 51501</a>
                            </div>
                        </div>
                    </div>

                    {/* Active Subscriptions */}
                    {activeSubscriptions.length > 0 && (
                        <div className="table-container" style={{ marginBottom: '24px' }}>
                            <div className="table-header-bar">
                                <h3>🎟️ Your Active Packages</h3>
                            </div>
                            <div style={{ padding: '16px' }}>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {activeSubscriptions.map((sub: any) => (
                                        <div key={sub.id} className="pick-card">
                                            <div className="pick-sport-badge">{sportEmoji[sub.packages?.sport] || '🏆'}</div>
                                            <div className="pick-info">
                                                <div className="pick-title">{sub.packages?.name}</div>
                                                <div className="pick-meta">
                                                    Expires: {sub.end_date ? new Date(sub.end_date).toLocaleDateString() : 'Ongoing'} &nbsp;•&nbsp;
                                                    ${sub.amount_paid} paid via {sub.payment_method}
                                                </div>
                                            </div>
                                            <span className="badge badge-green">Active</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Today's Picks */}
                    <div className="table-container" style={{ marginBottom: '24px' }}>
                        <div className="table-header-bar">
                            <h3>🎯 Today's Picks</h3>
                            <Link href="/portal/picks" className="btn btn-outline btn-sm">View All →</Link>
                        </div>
                        <div style={{ padding: '16px' }}>
                            {picks && picks.length > 0 ? (
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {picks.map((pick: any) => (
                                        <div key={pick.id} className="pick-card">
                                            <div className="pick-sport-badge">{sportEmoji[pick.sport] || '🏆'}</div>
                                            <div className="pick-info">
                                                <div className="pick-title">{pick.title}</div>
                                                <div className="pick-desc">{pick.description}</div>
                                                <div className="pick-meta" style={{ marginTop: '6px' }}>
                                                    {pick.sport.toUpperCase()} &nbsp;•&nbsp; Level {pick.level || '4'} &nbsp;•&nbsp;
                                                    {new Date(pick.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            {pick.result && (
                                                <span className={`badge ${pick.result === 'win' ? 'badge-green' : pick.result === 'loss' ? 'badge-red' : 'badge-gray'}`}>
                                                    {pick.result.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
                                    <p>No picks posted yet today. Check back soon!</p>
                                    <p style={{ marginTop: '8px', fontSize: '13px' }}>Or text PICK to 51501 for free SMS picks</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Get a Package CTA */}
                    {activeSubscriptions.length === 0 && (
                        <div style={{ background: 'linear-gradient(135deg, rgba(245,166,35,0.08), transparent)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '16px', padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
                            <div>
                                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '8px' }}>Ready to get serious about your picks?</h3>
                                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Browse our packages — from $20/day Level 3 plays all the way up to full season memberships.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <Link href="/packages/football" className="btn btn-primary">🏈 Football</Link>
                                <Link href="/packages/basketball" className="btn btn-outline">🏀 Basketball</Link>
                                <Link href="/packages/baseball" className="btn btn-outline">⚾ Baseball</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
