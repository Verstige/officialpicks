import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, full_name, phone, source } = body

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Save to Supabase leads table
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { error: dbError } = await supabase
            .from('leads')
            .upsert({ email, full_name: full_name || null, phone: phone || null, source: source || 'website' }, { onConflict: 'email' })

        if (dbError) {
            console.error('DB error:', dbError)
        }

        // Send welcome email via Resend
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
            from: `${process.env.FROM_NAME || "Official Picks"} <${process.env.FROM_EMAIL || 'picks@harryspicks.com'}>`,
            to: email,
            subject: "🏆 Welcome to Official Picks — Your Free Picks Are Ready!",
            html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#070B14;font-family:Inter,Arial,sans-serif;">
          <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
            <div style="background:linear-gradient(135deg,#111827,#0D1424);border-radius:16px;padding:40px;border:1px solid #1E2A3A;">
              <div style="text-align:center;margin-bottom:32px;">
                <div style="width:60px;height:60px;background:linear-gradient(135deg,#F5A623,#D4841A);border-radius:14px;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:16px;">🏆</div>
                <h1 style="color:#fff;font-size:28px;font-weight:800;margin:0 0 8px;">Welcome to Official Picks!</h1>
                <p style="color:#9CA3AF;font-size:16px;margin:0;">${full_name ? `Hey ${full_name}! You're` : "You're"} now part of 10,000+ winning members.</p>
              </div>

              <div style="background:rgba(245,166,35,0.08);border:1px solid rgba(245,166,35,0.2);border-radius:12px;padding:20px;margin-bottom:28px;">
                <h2 style="color:#F5A623;font-size:18px;font-weight:700;margin:0 0 12px;">🎯 Your Next Steps:</h2>
                <ol style="color:#D1D5DB;font-size:15px;line-height:1.8;margin:0;padding-left:20px;">
                  <li>Text <strong style="color:#F5A623;">PICK</strong> to <strong style="color:#F5A623;">51501</strong> for free SMS picks</li>
                  <li>Browse our <a href="${process.env.NEXT_PUBLIC_APP_URL}/packages/football" style="color:#F5A623;">packages</a> and choose your level</li>
                  <li>Pay via Venmo <strong style="color:#F5A623;">@UncleharrysSports</strong></li>
                  <li>Call/text <a href="tel:9419145885" style="color:#F5A623;">941-914-5885</a> after payment to get your picks!</li>
                </ol>
              </div>

              <div style="margin-bottom:28px;">
                <h3 style="color:#fff;font-size:16px;font-weight:700;margin:0 0 16px;">🏈 What We Cover:</h3>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                  ${['🏈 NFL Football', '⚾ MLB Baseball', '🏀 NBA Basketball', '🐎 Horse Racing', '🏈 College Football', '🏀 College Basketball'].map(s => `<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:10px 14px;color:#D1D5DB;font-size:14px;">${s}</div>`).join('')}
                </div>
              </div>

              <div style="text-align:center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/register" style="display:inline-block;background:linear-gradient(135deg,#F5A623,#D4841A);color:#070B14;font-weight:700;font-size:16px;padding:14px 32px;border-radius:9999px;text-decoration:none;margin-bottom:16px;">
                  Create Your Account →
                </a>
                <p style="color:#4B5563;font-size:13px;margin:0;">
                  Questions? Call us at <a href="tel:9419145885" style="color:#F5A623;">941-914-5885</a>
                </p>
              </div>
            </div>
            <div style="text-align:center;padding:24px 0;color:#4B5563;font-size:12px;">
              <p>Official Picks | For entertainment purposes only. 18+ only.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color:#6B7280;text-decoration:none;">Terms</a> &middot;
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color:#6B7280;text-decoration:none;">Privacy</a>
            </div>
          </div>
        </body>
        </html>
      `,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Lead API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
