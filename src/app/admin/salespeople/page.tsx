'use client'
export const dynamic = 'force-dynamic'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminSalespeople() {
    const [salespeople, setSalespeople] = useState<any[]>([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', phone: '' })
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => { fetchData() }, [])

    async function fetchData() {
        const { data } = await supabase.from('salespeople').select('*, profiles(full_name, email, role)').order('created_at', { ascending: false })
        setSalespeople(data || [])
        setLoading(false)
    }

    async function createSalesperson(e: React.FormEvent) {
        e.preventDefault()
        // Create auth user
        const res = await fetch('/api/admin/create-salesperson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
        const result = await res.json()
        if (result.error) { toast.error(result.error); return }
        toast.success(`Salesperson ${form.name} created! Temp password: ${result.temp_password}`)
        setShowForm(false)
        setForm({ name: '', email: '', phone: '' })
        fetchData()
    }

    return (
        <div className="dashboard-layout">
            <Sidebar role="admin" />
            <div className="main-content">
                <div className="page-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h1>💼 Salespeople</h1>
                            <p>Manage your sales team — each salesperson has their own hidden portal at /salesman</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? '✕ Cancel' : '+ Add Salesperson'}
                        </button>
                    </div>
                </div>
                <div className="page-body">
                    {showForm && (
                        <div className="card" style={{ marginBottom: '24px', border: '1px solid rgba(245,166,35,0.3)' }}>
                            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '16px' }}>Add New Salesperson</h3>
                            <form onSubmit={createSalesperson} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', alignItems: 'end' }}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input className="form-input" placeholder="Jane Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email (login)</label>
                                    <input type="email" className="form-input" placeholder="jane@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input type="tel" className="form-input" placeholder="(555) 123-4567" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                                </div>
                                <div style={{ gridColumn: '1/-1', display: 'flex', gap: '10px' }}>
                                    <button type="submit" className="btn btn-primary">Create Salesperson Account</button>
                                    <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                                </div>
                            </form>
                            <p style={{ marginTop: '12px', color: '#6B7280', fontSize: '13px' }}>
                                A temporary password will be generated and shown to you. The salesperson logs in at <strong style={{ color: '#F5A623' }}>/salesman</strong>.
                            </p>
                        </div>
                    )}

                    <div className="table-container">
                        <div className="table-header-bar">
                            <h3>Sales Team ({salespeople.length})</h3>
                        </div>
                        {loading ? (
                            <div style={{ padding: '40px', textAlign: 'center' }}><span className="spinner" /></div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Portal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salespeople.map(sp => (
                                        <tr key={sp.id}>
                                            <td style={{ fontWeight: 600, color: '#fff' }}>{sp.name}</td>
                                            <td style={{ color: '#9CA3AF' }}>{sp.email}</td>
                                            <td style={{ color: '#9CA3AF' }}>{sp.phone || '—'}</td>
                                            <td>
                                                <a href="/salesman" className="btn btn-ghost btn-sm" target="_blank">🔗 /salesman</a>
                                            </td>
                                        </tr>
                                    ))}
                                    {salespeople.length === 0 && (
                                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>No salespeople added yet.</td></tr>
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
