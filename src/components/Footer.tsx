import Link from 'next/link'
import { Trophy, Phone, Banknote, Smartphone } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link href="/" className="navbar-logo" style={{ display: 'inline-flex' }}>
                            <div className="logo-icon"><Trophy size={20} color="#070B14" /></div>
                            <span>Official <span className="text-gradient">Picks</span></span>
                        </Link>
                        <p>
                            Expert sports handicapping selections for NFL, NBA, MLB, College Sports, and Horse Racing.
                            Join thousands who trust our analysis for smarter, data-driven betting.
                        </p>
                        <p style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={16} color="#F5A623" /> <a href="tel:9419145885" style={{ color: '#F5A623' }}>941-914-5885</a>
                        </p>
                        <p style={{ marginTop: '6px', color: '#6B7280', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Banknote size={14} color="#6B7280" /> Venmo: @UncleharrysSports
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/packages/football">Football Picks</Link></li>
                            <li><Link href="/packages/basketball">Basketball Picks</Link></li>
                            <li><Link href="/packages/baseball">Baseball Picks</Link></li>
                            <li><Link href="/horse-racing">Horse Racing</Link></li>
                            <li><Link href="/free-picks">Free SMS Picks</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Account</h4>
                        <ul>
                            <li><Link href="/login">Client Login</Link></li>
                            <li><Link href="/register">Get Started</Link></li>
                            <li><Link href="/portal">My Portal</Link></li>
                            <li><Link href="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Legal</h4>
                        <ul>
                            <li><Link href="/terms">Terms of Service</Link></li>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><Link href="/disclosure">Partnership Disclosure</Link></li>
                        </ul>
                        <div style={{ marginTop: '20px' }}>
                            <a
                                href="sms:51501&body=PICK"
                                className="btn btn-outline btn-sm"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Smartphone size={14} /> Text PICK to 51501
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Official Picks. All rights reserved.</p>
                    <p style={{ fontSize: '12px', color: '#4B5563', maxWidth: '560px', textAlign: 'right' }}>
                        For entertainment purposes only. Must be 18+ to purchase. All sales are final. No refunds.
                    </p>
                </div>
            </div>
        </footer>
    )
}