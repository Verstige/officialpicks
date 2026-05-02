import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px' }}>
                <h1 style={{ fontFamily: 'Outfit', fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>Privacy Policy</h1>
                <p style={{ color: '#6B7280', marginBottom: '40px' }}>Last updated: {new Date().getFullYear()}</p>
                {[
                    { title: '1. Information We Collect', body: 'We collect your name, email address, and phone number when you sign up for picks or create an account. We also collect payment references (Venmo confirmation) when you purchase a package.' },
                    { title: '2. How We Use Your Information', body: 'Your information is used solely to deliver picks, send service-related communications, and process your package subscriptions. We do not use your data for any purpose other than providing our sports picks service.' },
                    { title: '3. SMS and Email Communications', body: 'By providing your phone number or email, you consent to receiving picks, alerts, and important account notifications from Harry\'s Picks. You can opt out at any time by replying STOP to any SMS or clicking unsubscribe in any email.' },
                    { title: '4. Data Security', body: 'We use industry-standard encryption and secure infrastructure (Supabase) to protect your personal data. We do not store payment information — all payments are handled through Venmo.' },
                    { title: '5. Third-Party Services', body: 'We use Supabase for database management and Resend for email delivery. These services are bound by their own privacy policies and do not have access to your financial information.' },
                    { title: '6. No Sale of Data', body: 'We will never sell, lease, or trade your personal information to third parties. Your data stays with Harry\'s Picks, period.' },
                    { title: '7. Contact Us', body: 'For any privacy concerns or data deletion requests, contact us at 941-914-5885 or through our Contact page.' },
                ].map(section => (
                    <div key={section.title} style={{ marginBottom: '28px' }}>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 700, color: '#F5A623', marginBottom: '10px' }}>{section.title}</h2>
                        <p style={{ color: '#9CA3AF', lineHeight: 1.8, fontSize: '15px' }}>{section.body}</p>
                    </div>
                ))}
            </div>
            <Footer />
        </>
    )
}
