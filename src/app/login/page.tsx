'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Trophy, LogIn } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }

        // Get user role from profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single()

        const role = profile?.role || 'client'
        if (role === 'admin') router.push('/admin')
        else if (role === 'salesperson') router.push('/salesman')
        else router.push('/portal')
    }

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #F5A623, #D4841A)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#fff' }}>
                            <Trophy size={26} />
                        </div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Sign In</h1>
                        <p style={{ color: '#9CA3AF', fontSize: '15px' }}>Access your Official Picks account</p>
                    </div>

                    <div className="card">
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    id="login-email"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    id="login-password"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading} id="login-submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {loading ? <span className="spinner" /> : <><LogIn size={18} /> Sign In</>}
                            </button>
                        </form>

                        <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid var(--navy-border)', paddingTop: '20px' }}>
                            <p style={{ color: '#6B7280', fontSize: '14px' }}>
                                Don't have an account?{' '}
                                <Link href="/register" style={{ color: '#F5A623', fontWeight: 600 }}>Create one free</Link>
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ color: '#4B5563', fontSize: '13px' }}>
                            Questions? Call us: <a href="tel:9419145885" style={{ color: '#F5A623' }}>941-914-5885</a>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
