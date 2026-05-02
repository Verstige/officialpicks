export const dynamic = 'force-dynamic'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function PortalPicksPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: picks } = await supabase
        .from('picks')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(50)

    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
    const sportEmoji: Record<string, string> = { football: '🏈', basketball: '🏀', baseball: '⚾', horse_racing: '🐎' }

    return (
        <div className="dashboard-layout">
            <Sidebar role="client" name={profile?.full_name || user.email} />
            <div className="main-content">
                <div className="page-header">
                    <h1>🎯 My Picks</h1>
                    <p>All picks released to your account — most recent first</p>
                </div>
                <div className="page-body">
                    {picks && picks.length > 0 ? (
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {picks.map((pick: any) => (
                                <div key={pick.id} className="pick-card">
                                    <div className="pick-sport-badge">{sportEmoji[pick.sport] || '🏆'}</div>
                                    <div className="pick-info">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                            <div className="pick-title">{pick.title}</div>
                                            <span className="badge badge-gold" style={{ fontSize: '11px' }}>Level {pick.level || '4'}</span>
                                        </div>
                                        <div className="pick-desc">{pick.description}</div>
                                        <div className="pick-meta" style={{ marginTop: '6px' }}>
                                            {pick.sport?.toUpperCase()} &nbsp;•&nbsp;
                                            {new Date(pick.published_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                                        {pick.result && (
                                            <span className={`badge ${pick.result === 'win' ? 'badge-green' : pick.result === 'loss' ? 'badge-red' : 'badge-gray'}`}>
                                                {pick.result.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B7280' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '8px', color: '#D1D5DB' }}>No picks yet</h3>
                            <p>Picks will appear here when Uncle Harry releases them.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
