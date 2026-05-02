'use client'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const SMS_TEMPLATES = [
    {
        title: '💼 Follow-Up After Purchase',
        body: "Hey [Name]! It's [Salesperson] from Harry's Picks. Thanks for joining! Uncle Harry has some 🔥 picks going out today. Call/text me at [Phone] if you need anything. Venmo @UncleharrysSports for any upgrades!"
    },
    {
        title: '🎯 New Pick Alert',
        body: "[Name], Harry just dropped a 🏆 pick for today! Don't miss it — text PICK to 51501 or check your email. Ready to upgrade your package? Hit me up! - [Salesperson]"
    },
    {
        title: '⏰ Subscription Renewal Reminder',
        body: "Hey [Name]! Your Harry's Picks package is ending soon. We've been on a 🔥 run and don't want you to miss a beat. Let's get you renewed — Venmo @UncleharrysSports or call me at [Phone]. - [Salesperson]"
    },
    {
        title: '👋 Initial Contact',
        body: "Hey [Name]! This is [Salesperson] from Harry's Picks. I saw you signed up for free picks — Uncle Harry has been absolutely 🔥 this season. Let's chat about getting you set up with a full package. Call/text me: [Phone]"
    },
    {
        title: '✅ Win Celebration',
        body: "Big WIN today for Harry's Picks members, [Name]! 🏆💸 That's why we do this! Ready to maximize your next package? Hit me up — [Salesperson] at [Phone]"
    },
]

export default function SalesmanPortal() {
    const [clients, setClients] = useState<any[]>([])
    const [user, setUser] = useState<any>(null)
    const [salesperson, setSalesperson] = useState<any>(null)
    const [activeTab, setActiveTab] = useState('clients')
    const [loading, setLoading] = useState(true)
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function load() {
            const { data: { user: u } } = await supabase.auth.getUser()
            if (!u) { router.push('/salesman/login'); return }
            setUser(u)

            const { data: profile } = await supabase.from('profiles').select('*').eq('id', u.id).single()
            if (profile?.role !== 'salesperson') { router.push('/login'); return }
            setSalesperson(profile)

            // Get this salesperson's clients
            const { data: sp } = await supabase.from('salespeople').select('id').eq('user_id', u.id).single()
            if (sp) {
                const { data: myClients } = await supabase.from('clients').select('*').eq('salesperson_id', sp.id).order('created_at', { ascending: false })
                setClients(myClients || [])
            }
            setLoading(false)
        }
        load()
    }, [])

    async function updateClientStatus(id: string, status: string) {
        await supabase.from('clients').update({ status }).eq('id', id)
        setClients(prev => prev.map(c => c.id === id ? { ...c, status } : c))
        toast.success('Status updated')
    }

    function copyTemplate(idx: number, template: string) {
        navigator.clipboard.writeText(template)
        setCopiedIdx(idx)
        toast.success('Template copied!')
        setTimeout(() => setCopiedIdx(null), 2000)
    }

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070B14' }}>
            <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
        </div>
    )

    return (
        <div className="dashboard-layout">
            <Sidebar role="salesman" name={salesperson?.full_name || user?.email} />
            <div className="main-content">
                <div className="page-header">
                    <h1>💼 Salesman Portal</h1>
                    <p>Manage your clients and use pre-built message templates</p>
                </div>
                <div className="page-body">
                    <div className="stats-grid" style={{ marginBottom: '24px' }}>
                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-label">My Clients</div>
                            <div className="stat-value">{clients.length}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">✅</div>
                            <div className="stat-label">Active</div>
                            <div className="stat-value">{clients.filter(c => c.status === 'active').length}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🔥</div>
                            <div className="stat-label">Leads</div>
                            <div className="stat-value">{clients.filter(c => c.status === 'lead').length}</div>
                        </div>
                    </div>

                    <div className="tabs">
                        <button className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}>👥 My Clients</button>
                        <button className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`} onClick={() => setActiveTab('templates')}>📝 SMS Templates</button>
                    </div>

                    {activeTab === 'clients' && (
                        <div className="table-container">
                            <div className="table-header-bar">
                                <h3>My Assigned Clients</h3>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Joined</th>
                                        <th>Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map(client => (
                                        <tr key={client.id}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: '#fff' }}>{client.full_name || '—'}</div>
                                                <div style={{ fontSize: '12px', color: '#6B7280' }}>{client.email}</div>
                                            </td>
                                            <td>
                                                {client.phone ? (
                                                    <a href={`tel:${client.phone}`} style={{ color: '#F5A623', fontSize: '14px' }}>{client.phone}</a>
                                                ) : <span style={{ color: '#4B5563' }}>—</span>}
                                            </td>
                                            <td>
                                                <span className={`badge ${client.status === 'active' ? 'badge-green' : client.status === 'lead' ? 'badge-gold' : 'badge-gray'}`}>
                                                    {client.status}
                                                </span>
                                            </td>
                                            <td style={{ color: '#6B7280', fontSize: '13px' }}>
                                                {new Date(client.created_at).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <select
                                                    value={client.status}
                                                    onChange={e => updateClientStatus(client.id, e.target.value)}
                                                    className="form-input form-select"
                                                    style={{ padding: '4px 28px 4px 8px', fontSize: '12px', width: 'auto' }}
                                                >
                                                    <option value="lead">Lead</option>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                    {clients.length === 0 && (
                                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>No clients assigned to you yet. Contact the admin.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'templates' && (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div className="alert alert-info">
                                💡 Replace <strong>[Name]</strong>, <strong>[Salesperson]</strong>, and <strong>[Phone]</strong> with your info before sending.
                            </div>
                            {SMS_TEMPLATES.map((t, i) => (
                                <div key={i} className="card">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <h3 style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 700 }}>{t.title}</h3>
                                        <button
                                            className={`btn btn-sm ${copiedIdx === i ? 'btn-success' : 'btn-primary'}`}
                                            onClick={() => copyTemplate(i, t.body)}
                                        >
                                            {copiedIdx === i ? '✅ Copied!' : '📋 Copy'}
                                        </button>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '14px', fontSize: '14px', color: '#D1D5DB', lineHeight: 1.7, fontFamily: 'monospace', whiteSpace: 'pre-wrap', border: '1px solid var(--navy-border)' }}>
                                        {t.body}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
