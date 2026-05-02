export const dynamic = 'force-dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Target, CheckCircle2, XCircle, RefreshCw, Clock, Smartphone, AlertTriangle, Activity, Dribbble, Flag } from 'lucide-react'

export default async function TodaysPicksPage() {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]
    const { data: picks } = await supabase
        .from('picks')
        .select('*')
        .eq('is_public', true)
        .gte('published_at', today + 'T00:00:00')
        .order('published_at', { ascending: false })

    const sportIcons: Record<string, React.ReactNode> = {
        football: <Activity size={28} color="#F5A623" />,
        basketball: <Dribbble size={28} color="#F5A623" />,
        baseball: <Target size={28} color="#F5A623" />,
        horse_racing: <Flag size={28} color="#F5A623" />
    }

    return (
        <>
            <Navbar />
            <div style={{ borderBottom: '1px solid rgba(245,166,35,0.1)', padding: '48px 0', background: 'linear-gradient(180deg, rgba(245,166,35,0.06) 0%, transparent 100%)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                        <Target size={40} color="#F5A623" /> Today's <span className="text-gradient">Picks</span>
                    </h1>
                    <p style={{ color: '#9CA3AF', fontSize: '16px' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <section className="section">
                <div className="container" style={{ maxWidth: '800px' }}>
                    {picks && picks.length > 0 ? (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {picks.map((pick: any) => (
                                <div key={pick.id} className="pick-card" style={{ padding: '24px' }}>
                                    <div className="pick-sport-badge" style={{ width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {sportIcons[pick.sport] || <Target size={28} color="#F5A623" />}
                                    </div>
                                    <div className="pick-info">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                            <div className="pick-title" style={{ fontSize: '18px' }}>{pick.title}</div>
                                            <span className="badge badge-gold">Level {pick.level?.replace('_', ' ') || '4'}</span>
                                        </div>
                                        {pick.description && <div className="pick-desc" style={{ fontSize: '15px' }}>{pick.description}</div>}
                                        <div className="pick-meta" style={{ marginTop: '8px' }}>
                                            {pick.sport?.toUpperCase()} &nbsp;•&nbsp;
                                            Posted {new Date(pick.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    {pick.result && (
                                        <span className={`badge ${pick.result === 'win' ? 'badge-green' : pick.result === 'loss' ? 'badge-red' : 'badge-gray'}`} style={{ fontSize: '13px', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                            {pick.result === 'win' ? <><CheckCircle2 size={14} /> WIN</> :
                                                pick.result === 'loss' ? <><XCircle size={14} /> LOSS</> :
                                                    <><RefreshCw size={14} /> PUSH</>}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B7280' }}>
                            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                                <Clock size={48} color="#9CA3AF" />
                            </div>
                            <h3 style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 700, color: '#D1D5DB', marginBottom: '12px' }}>No public picks yet today</h3>
                            <p style={{ marginBottom: '24px' }}>Check back soon — or get member-only picks by signing up!</p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <Link href="/register" className="btn btn-primary">Get Member Picks</Link>
                                <a href="sms:51501&body=PICK" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    <Smartphone size={18} /> Text PICK to 51501
                                </a>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '40px', background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '12px', padding: '20px 24px' }}>
                        <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: 1.7 }}>
                            <AlertTriangle size={14} color="#F5A623" style={{ display: 'inline', marginBottom: '-2px' }} /> <strong style={{ color: '#F5A623' }}>Disclaimer:</strong> All information provided is for entertainment purposes only. Nothing here constitutes a guarantee of winning. Use of this information in violation of State, Federal, or Local laws is strictly prohibited. Must be 18+ to participate.
                        </p>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}
