import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { parsePDFText, analyzeRaces } from '@/lib/horse-racing/parser'
import type { Horse } from '@/lib/horse-racing/types'

export async function POST(req: NextRequest) {
  try {
    // Check auth
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check profile role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    // Parse multipart form
    let pdfBuffer: Buffer | null = null
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file || !file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Invalid PDF file' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    pdfBuffer = Buffer.from(bytes)

    // Save PDF temporarily
    const uploadDir = join(process.cwd(), 'tmp')
    await mkdir(uploadDir, { recursive: true })
    const pdfPath = join(uploadDir, `race-${Date.now()}.pdf`)
    await writeFile(pdfPath, pdfBuffer)

    // Extract text using PyMuPDF (fitz)
    let pdfText: string
    try {
      const { execSync } = require('child_process')
      // Use python3 with fitz
      const pythonScript = `
import sys
sys.path.insert(0, '/usr/local/lib/node_modules/openclaw/skills/web-scraper/')
import fitz
doc = fitz.open('${pdfPath}')
for i in range(len(doc)):
    print(f'=== PAGE {i+1} ===')
    print(doc[i].get_text())
doc.close()
`
      const result = require('child_process').execSync(`python3 -c "${pythonScript.replace(/"/g, '\\"').replace(/\n/g, '; ')}"`, { maxBuffer: 50 * 1024 * 1024 })
      pdfText = result.toString()
    } catch (fitzErr) {
      // Fallback: try system python
      try {
        const fs = require('fs')
        const f = require('child_process').execSync(`python3 -c "import fitz; doc=fitz.open('${pdfPath}'); print('\\n'.join([f'=== PAGE {i+1} ===\\n' + p.get_text() for i,p in enumerate(doc)]))"`, { maxBuffer: 50 * 1024 * 1024 })
        pdfText = f.toString()
      } catch {
        return NextResponse.json({ error: 'PDF parsing failed. Please ensure PyMuPDF is installed: pip install pymupdf' }, { status: 500 })
      }
    }

    if (!pdfText || pdfText.trim().length < 500) {
      return NextResponse.json({ error: 'Could not extract text from PDF. Try a different file or ensure it is a valid DRF race card.' }, { status: 400 })
    }

    // Parse races
    const races = parsePDFText(pdfText)

    if (races.length === 0) {
      return NextResponse.json({ error: 'No races found in PDF. Ensure this is a valid DRF race card with readable text.' }, { status: 400 })
    }

    // Run analysis
    const { overlays, topPlays } = analyzeRaces(races)

    // Build clean response
    const response = {
      date: new Date().toISOString().split('T')[0],
      track: 'Churchill Downs',
      races: races.map(r => ({
        number: r.number,
        raceName: r.raceName,
        distance: r.distance,
        raceType: r.raceType,
        purse: r.purse,
        postTime: r.postTime,
        surface: r.surface,
        paceScenario: r.paceScenario,
        paceNote: r.paceNote,
        horses: r.horses.map(h => ({
          program: h.program,
          name: h.name,
          ml: h.ml,
          odds: h.odds,
          score: h.score,
          isOverlay: h.isOverlay,
          overlayValue: Math.round(h.overlayValue),
          scoreBreakdown: h.scoreBreakdown,
          jockey: h.jockey,
          trainer: h.trainer,
          sire: h.sire,
          sirePrice: h.sirePrice,
          bloodlineGrade: h.bloodlineGrade,
          lifeRecord: h.lifeRecord,
          lifeEarnings: h.lifeEarnings,
          cdRecord: h.cdRecord,
          cdEarnings: h.cdEarnings,
          recentStarts: h.recentStarts.slice(0, 3),
          improving: h.improving,
        })),
        topPicks: r.topPicks.map(h => h.program),
        exactaBox: r.exactaBox,
        trifectaBox: r.trifectaBox,
      })),
      overlays: overlays.slice(0, 10).map((h: Horse) => ({
        race: h.program > 0 ? Math.ceil(h.program / 2) : 1,
        program: h.program,
        horse: h.name,
        ml: h.ml,
        score: h.score,
        value: h.score >= 80 ? 'high' : h.score >= 65 ? 'medium' : 'low',
      })),
      summary: {
        totalRaces: races.length,
        topPlaysCount: topPlays.length,
        overlaysCount: overlays.length,
        message: `Found ${races.length} races with ${overlays.length} overlay plays. Top play: ${topPlays[0]?.name || 'N/A'} in Race ${topPlays[0]?.program || 'N/A'}.`,
      },
    }

    // Store in Supabase for history
    await supabase.from('picks').insert({
      sport: 'horse_racing',
      title: `Horse Racing Analysis — ${new Date().toLocaleDateString()}`,
      description: `${races.length} races analyzed. ${overlays.length} overlays found. Top picks: ${topPlays.slice(0, 3).map((h: Horse) => `#${h.program} ${h.name}`).join(', ')}.`,
      level: 'analysis',
      is_public: false,
    })

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Horse racing analysis error:', error)
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'