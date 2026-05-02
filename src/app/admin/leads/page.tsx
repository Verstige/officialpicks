'use client'
export const dynamic = 'force-dynamic'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminLeads() {
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        supabase.from('leads').select('*').order('created_at', { ascending: false }).then(({ data }) => {
            setLeads(data || [])
            setLoading(false)
        })
    }, [])

    async function convertToClient(lead: any) {
        const { error } = await supabase.from('clients').insert({
            email: lead.email,
            full_name: lead.full_name,
            phone: lead.phone,
            status: 'lead',
        })
        if (error) { toast.error('Failed to convert'); return }
        toast.success(`${lead.email} added as client!`)
    }

    function exportCSV() {
        const header = ['Name', 'Email', 'Phone', 'Source', 'Date']
        const rows = leads.map(l => [l.full_name || '', l.email, l.phone || '', l.source || '', new Date(l.created_at).toLocaleDateString()])
        const csv = [header, ...rows].map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `harrys-picks-leads-${Date.now()}.csv`
        a.click()
    }

    return (
        <div className="dashboard-layout">
            <Sidebar role="admin" />
            <div className="main-content">
                <div className="page-header">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h1>📧 Email Leads</h1>
                            <p>Everyone who signed up for free picks from the website</p>
                        </div>
                        <button className="btn btn-outline" onClick={exportCSV}>📥 Export CSV</button>
                    </div>
                </div>
                <div className="page-body">
                    <div className="table-container">
                        <div className="table-header-bar">
                            <h3>All Leads ({leads.length})</h3>
                            <span className="badge badge-gold">{leads.length} captured</span>
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
                                        <th>Source</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map(lead => (
                                        <tr key={lead.id}>
                                            <td style={{ fontWeight: 600, color: '#fff' }}>{lead.full_name || '—'}</td>
                                            <td style={{ color: '#9CA3AF' }}>{lead.email}</td>
                                            <td style={{ color: '#6B7280' }}>{lead.phone || '—'}</td>
                                            <td><span className="badge badge-blue" style={{ fontSize: '11px' }}>{lead.source || 'website'}</span></td>
                                            <td style={{ color: '#6B7280', fontSize: '13px' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <button className="btn btn-success btn-sm" onClick={() => convertToClient(lead)}>→ Client</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && (
                                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#6B7280' }}>No leads yet. Email signups from the homepage will appear here.</td></tr>
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
