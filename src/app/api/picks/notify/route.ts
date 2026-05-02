import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
    try {
        const { pickId, type } = await req.json()

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Get the pick details
        const { data: pick, error: pickError } = await supabase
            .from('picks')
            .select('*')
            .eq('id', pickId)
            .single()

        if (pickError || !pick) {
            return NextResponse.json({ error: 'Pick not found' }, { status: 404 })
        }

        // Get all active clients
        const { data: clients } = await supabase
            .from('clients')
            .select('profiles(email, full_name)')
            .eq('status', 'active')

        if (!clients || clients.length === 0) {
            return NextResponse.json({ sent: 0 })
        }

        const resend = new Resend(process.env.RESEND_API_KEY)
        const sportEmoji: Record<string, string> = {
            football: '🏈', basketball: '🏀', baseball: '⚾', horse_racing: '🐎'
        }
        const emoji = sportEmoji[pick.sport] || '🏆'

        // Send to all active clients
        let sent = 0
        for (const client of clients) {
            const profile = client.profiles as any
            if (!profile?.email) continue
            try {
                await resend.emails.send({
                    from: `${process.env.FROM_NAME || "Official Picks"} <${process.env.FROM_EMAIL || 'picks@harryspicks.com'}>`,
                    to: profile.email,
                    subject: `${emoji} New Pick Alert — ${pick.title}`,
                    html: `
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:0;background:#070B14;font-family:Inter,Arial,sans-serif;">
              <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
                <div style="background:#111827;border-radius:16px;padding:36px;border:1px solid #1E2A3A;">
                  <div style="display:flex;align-items:center;gap:14px;margin-bottom:24px;">
                    <div style="width:52px;height:52px;background:rgba(245,166,35,0.12);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;">${emoji}</div>
                    <div>
                      <p style="color:#F5A623;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">New ${pick.sport} Pick</p>
                      <h2 style="color:#fff;font-size:22px;font-weight:800;margin:0;">${pick.title}</h2>
                    </div>
                  </div>
                  <div style="background:rgba(245,166,35,0.06);border-left:3px solid #F5A623;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
                    <p style="color:#D1D5DB;font-size:15px;line-height:1.7;margin:0;">${pick.description || 'New pick available. Log in to view full details.'}</p>
                  </div>
                  <div style="text-align:center;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/picks" style="display:inline-block;background:linear-gradient(135deg,#F5A623,#D4841A);color:#070B14;font-weight:700;font-size:15px;padding:13px 28px;border-radius:9999px;text-decoration:none;">
                      View Full Pick →
                    </a>
                  </div>
                </div>
                <div style="text-align:center;padding:20px 0;color:#4B5563;font-size:12px;">
                  <p>Official Picks | For entertainment purposes only. 18+ only.</p>
                </div>
              </div>
            </body>
            </html>
          `,
                })
                sent++
            } catch (emailErr) {
                console.error(`Failed to email ${profile.email}:`, emailErr)
            }
        }

        return NextResponse.json({ success: true, sent })
    } catch (error) {
        console.error('Picks notification error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
