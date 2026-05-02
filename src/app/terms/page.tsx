import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px' }}>
                <h1 style={{ fontFamily: 'Outfit', fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>Terms of Service</h1>
                <p style={{ color: '#6B7280', marginBottom: '40px' }}>Last updated: {new Date().getFullYear()}</p>

                {[
                    { title: '1. Entertainment Purposes Only', body: 'There is nothing that can be won or lost here. All the information provided herein is for news and entertainment purposes only. Use of this information in violation of State, Federal, or Local laws is strictly prohibited.' },
                    { title: '2. Age Requirement', body: 'The information contained on this website is for viewing by all audiences. However, you must be 18 years of age or older to purchase any products and services sold here.' },
                    { title: '3. No Refund Policy', body: 'All sales are final. Official Picks maintains a strict no-refund policy. Please review all package details carefully before making a purchase. By completing a purchase, you agree to these terms.' },
                    { title: '4. Privacy Policy', body: 'We respect your privacy. Your personal information (name, email, phone) is collected only to deliver your picks and communicate with you about our services. We do not sell your information to third parties.' },
                    { title: '5. Payment', body: 'Payments are processed via Venmo (@UncleharrysSports). After payment, contact us at 941-914-5885 to confirm your package and receive your picks.' },
                    { title: '6. SMS Communications', body: 'By texting PICK to 51501, you consent to receive automated text messages from Official Picks. Message & data rates may apply. Reply STOP at any time to unsubscribe.' },
                    { title: '7. Disclaimer', body: 'Sports betting involves risk. Past performance of picks does not guarantee future results. Official Picks makes no warranty that any picks will result in financial gain. Bet responsibly.' },,
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
