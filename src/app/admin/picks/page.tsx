'use client'
export const dynamic = 'force-dynamic'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Pick = {
    id: string
    title: string
    description: string
    sport: string
    level: string
    result: string | null
    is_public: boolean
    published_at: string
}

const SPORTS = ['football', 'basketball', 'baseball', 'horse_racing']
const LEVELS = ['1', '2', '3', '4', 'super_sonic', 'mama_jama']
const sportEmoji: Record<string, string> = { football: '🏈', basketball: '🏀', baseball: '⚾', horse_racing: '🐎' }

export default function AdminPicks() {
    const [picks, setPicks] = useState<Pick[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [sending, setSending] = useState<string | null>(null)
    const [form, setForm] = useState({
        title: '', description: '', sport: 'football', level: '4', is_public: true
    })
    const supabase = createClient()

    useEffect(() => { fetchPicks() }, [])

    async function fetchPicks() {
        const { data } = await supabase.from('picks').select('*').order('published_at', { ascending: false }).limit(50)
        setPicks(data || [])
        setLoading(false)
    }

    async function handlePost(e: React.FormEvent) {
        e.preventDefault()
        const { data, error } = await supabase.from('picks').insert({
            ...form,
            published_at: new Date().toISOString(),
        }).select().single()

        if (error) { toast.error('Failed to post pick'); return }
        toast.success('Pick posted!')
        setPicks(prev => [data, ...prev])
        setForm({ title: '', description: '', sport: 'football', level: '4', is_public: true })
        setShowForm(false)

        // Notify subscribers
        if (data.is_public) {
            setSending(data.id)
            const res = await fetch('/api/picks/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pickId: data.id, type: 'new_pick' }),
            })
            const result = await res.json()
            toast.success(`📧 Sent to ${result.sent || 0} subscribers!`)
            setSending(null)
        }
    }

    async function updateResult(id: string, result: string) {
        await supabase.from('picks').update({ result }).eq('id', id)
        setPicks(prev => prev.map(p => p.id === id ? { ...p, result } : p))
        toast.success('Result updated')
    }

    async function deletePick(id: string) {
        if (!confirm('Delete this pick?')) return
        await supabase.from('picks').delete().eq('id', id)
        setPicks(prev => prev.filter(p => p.id !== id))
        toast.success('Pick deleted')
    }

    return (
        <div className="dashboard-layout">
            <Sidebar role="admin" />
            <div className="main-content">
                <div className="page-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h1>🎯 Pick Management</h1>
                            <p>Post picks — they go to all active subscribers automatically</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? '✕ Cancel' : '+ Post New Pick'}
                        </button>
                    </div>
                </div>

                <div className="page-body">
                    {/* Post Pick Form */}
                    {showForm && (
                        <div className="card" style={{ marginBottom: '24px', border: '1px solid rgba(245,166,35,0.3)' }}>
                            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '20px' }}>📝 Post New Pick</h3>
                            <form onSubmit={handlePost} style={{ display: 'grid', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Sport</label>
                                        <select className="form-input form-select" value={form.sport} onChange={e => setForm(f => ({ ...f, sport: e.target.value }))}>
                                            {SPORTS.map(s => <option key={s} value={s}>{sportEmoji[s]} {s.replace('_', ' ')}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Level</label>
                                        <select className="form-input form-select" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                                            {LEVELS.map(l => <option key={l} value={l}>Level {l.replace('_', ' ')}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Pick Title</label>
                                    <input className="form-input" placeholder="e.g. Chiefs -3.5 vs Eagles" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Pick Description / Analysis</label>
                                    <textarea className="form-input form-textarea" placeholder="Full analysis and reasoning for this pick..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <input type="checkbox" id="is_public" checked={form.is_public} onChange={e => setForm(f => ({ ...f, is_public: e.target.checked }))} style={{ width: 18, height: 18, accentColor: '#F5A623' }} />
                                    <label htmlFor="is_public" style={{ color: '#D1D5DB', fontSize: '14px', cursor: 'pointer' }}>
                                        Send email notification to all active subscribers
                                    </label>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" className="btn btn-primary">🎯 Post Pick</button>
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Picks List */}
                    <div className="table-container">
                        <div className="table-header-bar">
                            <h3>All Picks ({picks.length})</h3>
                        </div>
                        {loading ? (
                            <div style={{ padding: '40px', textAlign: 'center' }}><span className="spinner" /></div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Pick</th>
                                        <th>Sport</th>
                                        <th>Level</th>
                                        <th>Result</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {picks.map(pick => (
                                        <tr key={pick.id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: '#fff', maxWidth: '260px' }}>{pick.title}</div>
                                                {pick.description && <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pick.description}</div>}
                                            </td>
                                            <td>{sportEmoji[pick.sport]} {pick.sport}</td>
                                            <td><span className="badge badge-gold">Lv {pick.level?.replace('_', ' ')}</span></td>
                                            <td>
                                                <select
                                                    value={pick.result || ''}
                                                    onChange={e => updateResult(pick.id, e.target.value)}
                                                    className="form-input form-select"
                                                    style={{ padding: '4px 28px 4px 8px', fontSize: '12px', width: 'auto' }}
                                                >
                                                    <option value="">Pending</option>
                                                    <option value="win">✅ Win</option>
                                                    <option value="loss">❌ Loss</option>
                                                    <option value="push">🔄 Push</option>
                                                </select>
                                            </td>
                                            <td style={{ color: '#6B7280', fontSize: '13px' }}>
                                                {new Date(pick.published_at).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    {sending === pick.id ? (
                                                        <span className="spinner" />
                                                    ) : (
                                                        <button
                                                            className="btn btn-outline btn-sm"
                                                            onClick={async () => {
                                                                setSending(pick.id)
                                                                const res = await fetch('/api/picks/notify', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ pickId: pick.id }),
                                                                })
                                                                const r = await res.json()
                                                                toast.success(`Sent to ${r.sent} subscribers`)
                                                                setSending(null)
                                                            }}
                                                        >📧 Notify</button>
                                                    )}
                                                    <button className="btn btn-danger btn-sm" onClick={() => deletePick(pick.id)}>🗑</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {picks.length === 0 && (
                                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>No picks posted yet. Post your first pick above!</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
