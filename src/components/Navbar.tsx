'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Trophy, Phone, Banknote, Smartphone, Menu, X } from 'lucide-react'
import { LogoIcon } from './Logo'

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/packages/football', label: 'Football' },
    { href: '/packages/basketball', label: 'Basketball' },
    { href: '/packages/baseball', label: 'Baseball' },
    { href: '/horse-racing', label: 'Horse Racing' },
    { href: '/free-picks', label: 'Free Picks' },
    { href: '/todays-picks', label: "Today's Picks" },
    { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* Top contact bar */}
            <div className="top-contact-bar" style={{
                background: 'linear-gradient(90deg, #0D1424, #111827)',
                borderBottom: '1px solid rgba(245,166,35,0.15)',
                padding: '8px 0',
                fontSize: '14px',
                color: '#9CA3AF',
            }}>
                <div className="container-wide" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <a href="tel:9419145885" style={{ color: '#F5A623', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={14} color="#F5A623" /> 941-914-5885
                        </a>
                        <span>Call or text after payment</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Banknote size={14} color="#D1D5DB" /> Venmo: <strong style={{ color: '#D1D5DB' }}>@UncleharrysSports</strong></span>
                        <a href="sms:51501&body=PICK" style={{ color: '#F5A623', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Smartphone size={14} color="#F5A623" /> Text PICK to 51501</a>
                    </div>
                </div>
            </div>

            <nav className="navbar">
                <div className="container-wide navbar-inner">
                    <Link href="/" className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <LogoIcon size={36} />
                        <span style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '24px',
                            fontWeight: 800,
                            color: '#0A1128',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '2px'
                        }}>
                            Harry's <span className="text-gradient" style={{ marginLeft: '4px' }}>Picks</span>
                        </span>
                    </Link>

                    <ul className="navbar-nav">
                        {navLinks.map(link => (
                            <li key={link.href}>
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>

                    <div className="navbar-actions">
                        <Link href="/login" className="btn btn-ghost" style={{ fontSize: '15px', padding: '10px 22px' }}>Sign In</Link>
                        <Link href="/register" className="btn btn-primary" style={{ fontSize: '15px', padding: '10px 24px' }}>Get Picks</Link>
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setOpen(!open)}
                            aria-label="Menu"
                            style={{ background: 'none', border: 'none', color: '#0A1128', display: 'flex', alignItems: 'center' }}
                        >
                            {open ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {open && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(255,255,255,0.98)', zIndex: 200,
                    padding: '32px 24px',
                    display: 'flex', flexDirection: 'column', gap: '8px',
                    overflowY: 'auto',
                }}>
                    <button
                        onClick={() => setOpen(false)}
                        style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', marginBottom: '16px' }}
                    >
                        <X size={28} />
                    </button>
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            style={{
                                padding: '18px 20px',
                                fontSize: '20px',
                                fontWeight: '600',
                                color: '#111827',
                                borderRadius: '12px',
                                background: 'rgba(0,0,0,0.03)',
                                borderLeft: '3px solid rgba(245,166,35,0.8)',
                                display: 'block'
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link href="/login" className="btn btn-ghost" style={{ fontSize: '18px', padding: '16px' }} onClick={() => setOpen(false)}>Sign In to My Account</Link>
                        <Link href="/register" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px' }} onClick={() => setOpen(false)}>Get Started — It's Free</Link>
                        <a href="tel:9419145885" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '14px', color: '#F5A623', fontWeight: 700, fontSize: '18px' }}>
                            <Phone size={18} color="#F5A623" /> Call: 941-914-5885
                        </a>
                    </div>
                </div>
            )}
        </>
    )
}
