'use client'
export const dynamic = 'force-dynamic'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Client = {
    id: string
    full_name: string
    email: string
    phone: string
    status: string
    salesperson_id: string | null
    tags: string[]
    created_at: string
    notes: string
}

type Salesperson = {
    id: string
    name: string
}

export default function AdminClients() {
    const [clients, setClients] = useState<Client[]>([])
    const [salespeople, setSalespeople] = useState<Salesperson[]>([])
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => { fetchData() }, [])

    async function fetchData() {
        const [{ data: clientsData }, { data: spData }] = await Promise.all([
            supabase.from('clients').select('*').order('created_at', { ascending: false }),
            supabase.from('salespeople').select('id, name'),
        ])
        setClients(clientsData || [])
        setSalespeople(spData || [])
        setLoading(false)
    }

    async function updateClient(id: string, updates: Partial<Client>) {
        const { error } = await supabase.from('clients').update(updates).eq('id', id)
        if (error) { toast.error('Update failed'); return }
        toast.success('Client updated')
        setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    }

    const filtered = clients.filter(c => {
        const matchSearch = !search || c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'all' || c.status === filter
        return matchSearch && matchFilter
    })

    return (
        <div className="dashboard-layout">
            <Sidebar role="admin" />
            <div className="main-content">
                <div className="page-header">
                    <h1>👥 Client Management</h1>
                    <p>Manage all clients, assign salespeople, and update status</p>
                </div>
                <div className="page-body">
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <div className="search-bar" style={{ flex: 1, minWidth: '200px' }}>
                            <span className="search-icon">🔍</span>
                            <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="tabs" style={{ marginBottom: 0 }}>
                            {['all', 'active', 'lead', 'inactive'].map(s => (
                                <button key={s} className={`tab-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="table-container">
                        <div className="table-header-bar">
                            <h3>All Clients ({filtered.length})</h3>
                            <span className="badge badge-gray">{clients.filter(c => c.status === 'active').length} active</span>
                        </div>
                        {loading ? (
                            <div style={{ padding: '40px', textAlign: 'center' }}><span className="spinner" /></div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Status</th>
                                        <th>Salesperson</th>
                                        <th>Phone</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(client => (
                                        <tr key={client.id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: '#fff' }}>{client.full_name || '—'}</div>
                                                <div style={{ fontSize: '12px', color: '#6B7280' }}>{client.email}</div>
                                            </td>
                                            <td>
                                                <select
                                                    value={client.status}
                                                    onChange={e => updateClient(client.id, { status: e.target.value })}
                                                    className="form-input form-select"
                                                    style={{ padding: '4px 28px 4px 8px', fontSize: '12px', width: 'auto' }}
                                                >
                                                    <option value="lead">Lead</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    value={client.salesperson_id || ''}
                                                    onChange={e => updateClient(client.id, { salesperson_id: e.target.value || null })}
                                                    className="form-input form-select"
                                                    style={{ padding: '4px 28px 4px 8px', fontSize: '12px', width: 'auto' }}
                                                >
                                                    <option value="">Unassigned</option>
                                                    {salespeople.map(sp => (
                                                        <option key={sp.id} value={sp.id}>{sp.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td style={{ color: '#9CA3AF', fontSize: '13px' }}>
                                                {client.phone ? <a href={`tel:${client.phone}`} style={{ color: '#F5A623' }}>{client.phone}</a> : '—'}
                                            </td>
                                            <td style={{ color: '#6B7280', fontSize: '13px' }}>
                                                {new Date(client.created_at).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <button className="btn btn-ghost btn-sm" onClick={() => {
                                                    const note = prompt('Add note for ' + (client.full_name || client.email) + ':', client.notes || '')
                                                    if (note !== null) updateClient(client.id, { notes: note })
                                                }}>
                                                    📝 Note
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filtered.length === 0 && (
                                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>No clients found</td></tr>
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
