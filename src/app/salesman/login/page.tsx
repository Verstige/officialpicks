'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Briefcase, LogIn } from 'lucide-react'

export default function SalesmanLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) { toast.error(error.message); setLoading(false); return }

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
        if (profile?.role !== 'salesperson') {
            toast.error('Access denied. This portal is for salespeople only.')
            await supabase.auth.signOut()
            setLoading(false)
            return
        }
        router.push('/salesman')
    }

    return (
        <div style={{ minHeight: '100vh', background: '#070B14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#fff' }}>
                        <Briefcase size={24} />
                    </div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '26px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Salesman Portal</h1>
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>Team access only · harry's picks</p>
                </div>

                <div style={{ background: '#111827', border: '1px solid #1E2A3A', borderRadius: '16px', padding: '28px' }}>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input id="sal-email" type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input id="sal-password" type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading} id="sal-login-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            {loading ? <span className="spinner" /> : <><LogIn size={18} /> Sign In</>}
                        </button>
                    </form>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#4B5563' }}>
                    <Link href="/login" style={{ color: '#6B7280' }}>← Back to main login</Link>
                </div>
            </div>
        </div>
    )
}
