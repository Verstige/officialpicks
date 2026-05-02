'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'
import { Smartphone, Target, BarChart, Zap, Gift } from 'lucide-react'

export default function FreePicsPage() {
    const [form, setForm] = useState({ name: '', phone: '', email: '' })
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: form.email, full_name: form.name, phone: form.phone, source: 'sms-page' }),
        })
        toast.success('🎉 You\'re signed up! Check your email for picks.')
        setForm({ name: '', phone: '', email: '' })
        setLoading(false)
    }

    return (
        <>
            <Navbar />
            <div style={{ borderBottom: '1px solid rgba(245,166,35,0.1)', padding: '56px 0', background: 'linear-gradient(180deg, rgba(245,166,35,0.07) 0%, transparent 100%)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                        <Smartphone size={48} color="#F5A623" />
                    </div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, marginBottom: '12px' }}>
                        Free Picks — <span className="text-gradient">VIP Member Alerts</span>
                    </h1>
                    <p style={{ color: '#9CA3AF', maxWidth: '560px', margin: '0 auto', fontSize: '17px', lineHeight: 1.7 }}>
                        Get free, expert sports picks delivered straight to your phone via SMS —
                        keeping you in the loop and ready to make winning bets anytime, anywhere.
                    </p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start', flexWrap: 'wrap' }}>
                        {/* Benefits */}
                        <div>
                            <h2 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 800, marginBottom: '24px' }}>
                                What You Get as a <span className="text-gradient">VIP Member</span>
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[
                                    { icon: <BarChart size={22} color="#F5A623" />, title: 'Live Stats & Matchup Context', desc: 'Fresh team/player stats, trends, and key matchup notes delivered before game time.' },
                                    { icon: <Zap size={22} color="#F5A623" />, title: 'Early Heads-Ups on Line Movement', desc: 'Instant alerts on line moves and favorable numbers — before the market adjusts.' },
                                    { icon: <Gift size={22} color="#F5A623" />, title: 'Subscriber-Only Specials', desc: 'Member-only promos, early access to packages, and bonus insights you won\'t find anywhere else.' },
                                    { icon: <Smartphone size={22} color="#F5A623" />, title: 'Text PICK to 51501', desc: 'The quickest way to get started — text PICK to 51501 for instant free picks on your phone.' },
                                ].map(item => (
                                    <div key={item.title} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                        <div style={{ width: 44, height: 44, background: 'rgba(245,166,35,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
                                        <div>
                                            <div style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '4px', fontSize: '15px' }}>{item.title}</div>
                                            <div style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '32px', padding: '20px 24px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Smartphone size={22} color="#F5A623" /> Quickest Way to Sign Up
                                </div>
                                <a href="sms:51501&body=PICK" className="btn btn-primary btn-lg" style={{ display: 'inline-flex' }}>
                                    Text PICK to 51501
                                </a>
                                <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '10px' }}>You can opt out anytime with a single reply</p>
                            </div>
                        </div>

                        {/* Sign Up Form */}
                        <div className="card" style={{ border: '1px solid rgba(245,166,35,0.2)' }}>
                            <h3 style={{ fontFamily: 'Outfit', fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
                                Sign Up for Free Email Picks
                            </h3>
                            <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                                Enter your name and email to get smart spread alerts, stats, and quick takes delivered to your inbox.
                            </p>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input className="form-input" placeholder="John Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone (for SMS picks)</label>
                                    <input type="tel" className="form-input" placeholder="(555) 123-4567" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    {loading ? <span className="spinner" /> : <><Target size={18} /> Send Me Free Picks</>}
                                </button>
                                <p style={{ fontSize: '12px', color: '#4B5563', textAlign: 'center' }}>
                                    No spam ever. Unsubscribe anytime. 100% free.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}
