'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Target } from 'lucide-react'

export default function RegisterPage() {
    const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' })
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    function update(field: string, val: string) {
        setForm(f => ({ ...f, [field]: val }))
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        const supabase = createClient()

        const { data, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: { full_name: form.full_name, phone: form.phone, role: 'client' }
            }
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
            return
        }

        // Create profile
        if (data.user) {
            await supabase.from('profiles').upsert({
                id: data.user.id,
                email: form.email,
                full_name: form.full_name,
                phone: form.phone,
                role: 'client',
            })

            // Create client record
            await supabase.from('clients').insert({
                user_id: data.user.id,
                email: form.email,
                full_name: form.full_name,
                phone: form.phone,
                status: 'lead',
            })

            // Send welcome email
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, full_name: form.full_name, source: 'registration' }),
            })
        }

        toast.success('🎉 Account created! Check your email to confirm.')
        router.push('/portal')
    }

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
                <div style={{ width: '100%', maxWidth: '460px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #F5A623, #D4841A)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#fff' }}>
                            <Target size={26} />
                        </div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>Create Your Account</h1>
                        <p style={{ color: '#9CA3AF', fontSize: '15px' }}>Join 10,000+ members getting expert picks</p>
                    </div>

                    <div className="card">
                        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input id="reg-name" type="text" className="form-input" placeholder="John Smith" value={form.full_name} onChange={e => update('full_name', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input id="reg-email" type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input id="reg-phone" type="tel" className="form-input" placeholder="(555) 123-4567" value={form.phone} onChange={e => update('phone', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input id="reg-password" type="password" className="form-input" placeholder="Create a strong password" value={form.password} onChange={e => update('password', e.target.value)} required minLength={8} />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading} id="reg-submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                {loading ? <span className="spinner" /> : <><Target size={18} /> Create Account — Free</>}
                            </button>
                            <p style={{ fontSize: '12px', color: '#4B5563', textAlign: 'center', lineHeight: 1.6 }}>
                                By creating an account, you agree to our{' '}
                                <Link href="/terms" style={{ color: '#F5A623' }}>Terms of Service</Link> and{' '}
                                <Link href="/privacy" style={{ color: '#F5A623' }}>Privacy Policy</Link>.
                                Must be 18+.
                            </p>
                        </form>

                        <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid var(--navy-border)', paddingTop: '20px' }}>
                            <p style={{ color: '#6B7280', fontSize: '14px' }}>
                                Already have an account?{' '}
                                <Link href="/login" style={{ color: '#F5A623', fontWeight: 600 }}>Sign in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
