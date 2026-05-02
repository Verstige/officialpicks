import Link from 'next/link'
import { LayoutDashboard, Users, Target, Briefcase, Package, Mail, Send, CreditCard, FileText, Trophy, LogOut } from 'lucide-react'

interface SidebarProps {
    role: 'client' | 'admin' | 'salesman'
    name?: string
}

const adminNav = [
    { href: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { href: '/admin/clients', icon: <Users size={18} />, label: 'Clients' },
    { href: '/admin/picks', icon: <Target size={18} />, label: 'Manage Picks' },
    { href: '/admin/salespeople', icon: <Briefcase size={18} />, label: 'Salespeople' },
    { href: '/admin/packages', icon: <Package size={18} />, label: 'Packages' },
    { href: '/admin/leads', icon: <Mail size={18} />, label: 'Leads' },
    { href: '/admin/emails', icon: <Send size={18} />, label: 'Email Broadcast' },
]

const clientNav = [
    { href: '/portal', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { href: '/portal/picks', icon: <Target size={18} />, label: 'My Picks' },
    { href: '/portal/subscription', icon: <CreditCard size={18} />, label: 'Subscription' },
]

const salesmanNav = [
    { href: '/salesman', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { href: '/salesman/clients', icon: <Users size={18} />, label: 'My Clients' },
    { href: '/salesman/templates', icon: <FileText size={18} />, label: 'SMS Templates' },
]

export default function Sidebar({ role, name }: SidebarProps) {
    const nav = role === 'admin' ? adminNav : role === 'salesman' ? salesmanNav : clientNav
    const roleLabel = role === 'admin' ? 'Admin Panel' : role === 'salesman' ? 'Salesman Portal' : 'Client Portal'
    const roleColor = role === 'admin' ? '#EF4444' : role === 'salesman' ? '#3B82F6' : '#F5A623'

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Link href="/" className="navbar-logo" style={{ fontSize: '18px' }}>
                    <div className="logo-icon" style={{ width: 32, height: 32 }}><Trophy size={16} color="#070B14" /></div>
                    <span>Harry's <span className="text-gradient">Picks</span></span>
                </Link>
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge" style={{ background: `${roleColor}20`, color: roleColor, fontSize: '10px' }}>
                        {roleLabel}
                    </span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {name && (
                    <div style={{ padding: '8px 14px 12px', borderBottom: '1px solid var(--navy-border)', marginBottom: '8px' }}>
                        <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Signed in as</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#D1D5DB' }}>{name}</div>
                    </div>
                )}
                {nav.map(item => (
                    <Link key={item.href} href={item.href}>
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--navy-border)', paddingTop: '12px' }}>
                    <Link href="/api/auth/logout" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', color: '#6B7280', transition: 'all 0.2s' }}>
                        <span className="nav-icon"><LogOut size={18} /></span> Sign Out
                    </Link>
                </div>
            </nav>
        </aside>
    )
}
