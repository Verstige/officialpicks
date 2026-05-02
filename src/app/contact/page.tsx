'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'
import { Phone, Banknote, Smartphone, Globe, Clock, Send } from 'lucide-react'

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        // Simple lead capture + email via API
        await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: form.email, full_name: form.name, phone: form.phone, source: 'contact-form' }),
        })
        toast.success('✅ Message sent! We\'ll get back to you within 24 hours.')
        setForm({ name: '', email: '', phone: '', message: '' })
        setLoading(false)
    }

    return (
        <>
            <Navbar />
            <div style={{ borderBottom: '1px solid rgba(245,166,35,0.1)', padding: '48px 0', background: 'linear-gradient(180deg, rgba(245,166,35,0.06) 0%, transparent 100%)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: '12px' }}>
                        Contact <span className="text-gradient">Us</span>
                    </h1>
                    <p style={{ color: '#9CA3AF', maxWidth: '480px', margin: '0 auto', fontSize: '16px', lineHeight: 1.7 }}>
                        Questions about packages, payments, or picks? We're here to help.
                    </p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', alignItems: 'start' }}>
                        {/* Contact Info */}
                        <div>
                            <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>Get In Touch</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {[
                                    { icon: <Phone size={22} color="#F5A623" />, title: 'Call or Text', detail: '941-914-5885', href: 'tel:9419145885', note: 'Call or text after Venmo payment to get your picks' },
                                    { icon: <Banknote size={22} color="#F5A623" />, title: 'Venmo Payment', detail: '@UncleharrysSports', href: 'https://venmo.com/UncleharrysSports', note: 'Pay for your package, then text us!' },
                                    { icon: <Smartphone size={22} color="#F5A623" />, title: 'Free SMS Picks', detail: 'Text PICK to 51501', href: 'sms:51501&body=PICK', note: 'Get free picks instantly on your phone' },
                                    { icon: <Globe size={22} color="#F5A623" />, title: 'Website', detail: 'harryspicks.com', href: 'https://harryspicks.com', note: 'Browse all packages and picks' },
                                ].map(item => (
                                    <a key={item.title} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}
                                        rel="noopener noreferrer" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', textDecoration: 'none' }}>
                                        <div style={{ width: 48, height: 48, background: 'rgba(245,166,35,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
                                        <div>
                                            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '15px', color: '#fff', marginBottom: '2px' }}>{item.title}</div>
                                            <div style={{ color: '#F5A623', fontSize: '15px', fontWeight: 600 }}>{item.detail}</div>
                                            <div style={{ color: '#6B7280', fontSize: '13px', marginTop: '2px' }}>{item.note}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <div style={{ marginTop: '32px', padding: '18px 22px', background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '12px' }}>
                                <div style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} color="#F5A623" /> Response Time</div>
                                <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.6 }}>
                                    We typically respond within a few hours. For fastest service,
                                    <strong style={{ color: '#F5A623' }}> call or text 941-914-5885</strong> directly.
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="card" style={{ border: '1px solid rgba(245,166,35,0.15)' }}>
                            <h3 style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Send Us a Message</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div className="form-group">
                                    <label className="form-label">Your Name</label>
                                    <input className="form-input" placeholder="John Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input type="tel" className="form-input" placeholder="(555) 123-4567" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea className="form-input form-textarea" placeholder="Tell us what you need..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    {loading ? <span className="spinner" /> : <><Send size={18} /> Send Message</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}
