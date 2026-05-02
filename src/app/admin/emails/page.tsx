'use client'
export const dynamic = 'force-dynamic'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Resend } from 'resend'

export default function AdminEmailBroadcast() {
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [audience, setAudience] = useState('active_clients')
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState(false)

    async function sendBroadcast(e: React.FormEvent) {
        e.preventDefault()
        if (!confirm(`Send this email to all ${audience.replace('_', ' ')}?`)) return
        setLoading(true)
        const res = await fetch('/api/emails/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject, body, audience }),
        })
        const result = await res.json()
        if (result.success) {
            toast.success(`📧 Sent to ${result.sent} recipients!`)
            setSubject('')
            setBody('')
        } else {
            toast.error('Broadcast failed: ' + (result.error || 'unknown error'))
        }
        setLoading(false)
    }

    return (
        <div className="dashboard-layout">
            <Sidebar role="admin" />
            <div className="main-content">
                <div className="page-header">
                    <h1>✉️ Email Broadcast</h1>
                    <p>Send emails to all active clients, all leads, or everyone</p>
                </div>
                <div className="page-body">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flexWrap: 'wrap' }}>
                        <div>
                            <form onSubmit={sendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <div className="form-group">
                                    <label className="form-label">Audience</label>
                                    <select className="form-input form-select" value={audience} onChange={e => setAudience(e.target.value)}>
                                        <option value="active_clients">Active Clients Only</option>
                                        <option value="all_clients">All Clients</option>
                                        <option value="leads">Email Leads</option>
                                        <option value="everyone">Everyone (clients + leads)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Subject Line</label>
                                    <input className="form-input" placeholder="🏆 Big picks dropping this weekend..." value={subject} onChange={e => setSubject(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Body (HTML or plain text)</label>
                                    <textarea
                                        className="form-input form-textarea"
                                        style={{ minHeight: '240px', fontFamily: 'monospace', fontSize: '13px' }}
                                        placeholder="Write your email here. You can use HTML or plain text."
                                        value={body}
                                        onChange={e => setBody(e.target.value)}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? <span className="spinner" /> : '📧 Send Broadcast'}
                                    </button>
                                    <button type="button" className="btn btn-ghost" onClick={() => setPreview(!preview)}>
                                        {preview ? 'Hide Preview' : '👁️ Preview'}
                                    </button>
                                </div>
                            </form>

                            <div className="alert alert-info" style={{ marginTop: '16px' }}>
                                <div>
                                    <strong>Powered by Resend.</strong> Emails sent from picks@harryspicks.com.
                                    All emails include Harry's Picks branding header and unsubscribe footer.
                                </div>
                            </div>
                        </div>

                        {/* Quick Templates */}
                        <div>
                            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '16px' }}>📋 Quick Templates</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    {
                                        label: '🔥 Hot Picks Alert',
                                        subject: "🔥 Uncle Harry's picks are on FIRE this week",
                                        body: "Big plays going out to all members this weekend. Don't miss out — text PICK to 51501 or log in to your account to see today's selections. Call 941-914-5885 to upgrade your package.\n\n— Uncle Harry's Team"
                                    },
                                    {
                                        label: '📦 New Package Available',
                                        subject: "🏈 New package just dropped — limited time pricing",
                                        body: "We've just released a new package for the upcoming week. Log in to your account or visit harryspicks.com to see what's available. Questions? Call us at 941-914-5885.\n\nVenmo @UncleharrysSports to secure your spot."
                                    },
                                    {
                                        label: '🎉 Season Kickoff',
                                        subject: "🏆 Season is here — Harry's Picks is ready!",
                                        body: "The season is officially underway and Uncle Harry's team is LOCKED IN. Get your package now before the best plays go out this week. Call 941-914-5885 or Venmo @UncleharrysSports.\n\nLet's get winning! 🏆"
                                    },
                                ].map((t, i) => (
                                    <button key={i} className="card" style={{ textAlign: 'left', cursor: 'pointer', background: 'var(--navy-card)' }}
                                        onClick={() => { setSubject(t.subject); setBody(t.body) }}>
                                        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{t.label}</div>
                                        <div style={{ fontSize: '12px', color: '#6B7280' }}>{t.subject}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {preview && body && (
                        <div style={{ marginTop: '24px' }}>
                            <h3 style={{ fontFamily: 'Outfit', marginBottom: '12px' }}>📧 Email Preview</h3>
                            <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', color: '#000' }} dangerouslySetInnerHTML={{ __html: body.includes('<') ? body : `<p style="line-height:1.7;font-family:Arial;">${body.replace(/\n/g, '<br/>')}</p>` }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
