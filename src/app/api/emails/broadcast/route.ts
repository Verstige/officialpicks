import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
    try {
        const { subject, body, audience } = await req.json()
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const resend = new Resend(process.env.RESEND_API_KEY)

        let emails: string[] = []

        if (audience === 'active_clients' || audience === 'all_clients' || audience === 'everyone') {
            const statusFilter = audience === 'active_clients' ? ['active'] : ['active', 'inactive', 'lead']
            const { data } = await supabase.from('clients').select('email').in('status', statusFilter)
            emails.push(...(data?.map((c: any) => c.email).filter(Boolean) || []))
        }

        if (audience === 'leads' || audience === 'everyone') {
            const { data } = await supabase.from('leads').select('email')
            emails.push(...(data?.map((l: any) => l.email).filter(Boolean) || []))
        }

        // Deduplicate
        emails = [...new Set(emails)]

        const htmlBody = body.includes('<') ? body : `
      <div style="font-family:Inter,Arial,sans-serif;color:#1a1a1a;line-height:1.7;max-width:600px;margin:0 auto;">
        ${body.split('\n').map((line: string) => `<p>${line}</p>`).join('')}
        <hr style="margin:24px 0;border-color:#eee;" />
        <p style="color:#999;font-size:12px;">
          Official Picks | 941-914-5885 | <a href="https://harryspicks.com">harryspicks.com</a><br/>
          For entertainment purposes only. 18+ only. All sales final.
        </p>
      </div>
    `

        let sent = 0
        // Send in batches of 10
        for (let i = 0; i < emails.length; i += 10) {
            const batch = emails.slice(i, i + 10)
            await Promise.all(batch.map(email =>
                resend.emails.send({
                    from: `${process.env.FROM_NAME || "Official Picks"} <${process.env.FROM_EMAIL || 'picks@harryspicks.com'}>`,
                    to: email,
                    subject,
                    html: htmlBody,
                }).then(() => { sent++ }).catch(err => console.error(`Failed to email ${email}:`, err))
            ))
        }

        return NextResponse.json({ success: true, sent, total: emails.length })
    } catch (error) {
        console.error('Broadcast error:', error)
        return NextResponse.json({ error: 'Broadcast failed' }, { status: 500 })
    }
}
