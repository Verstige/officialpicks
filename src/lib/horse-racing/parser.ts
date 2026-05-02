/**
 * PDF Parser — Extracts structured race data from DRF PDF text
 * Uses pattern matching to identify horses, J/T stats, bloodlines, works, and form
 */

import type { Horse, Race, RaceResult, Work, TrainerStats } from './types'

// ─── Bloodline Grading ───────────────────────────────────────────────────────

function gradeBloodline(sire: string, sirePrice: number): 'elite' | 'good' | 'avg' | 'poor' {
  const elite = ['into mischief', 'tapit', 'war front', 'lope de vega', 'kingman', 'duke of marmelade',
    'sea the stars', 'frankel', 'dubawi', 'galileo', 'deep impact', 'oratorio', 'havelock',
    'not this time', 'connect', 'authentic', 'gun runner', 'maxim', 'mandaloun',
    'mandaloun', 'yute', 'constitution', 'mace', 'arrogate', 'nyquist', 'quality road',
    'medaglia d\'oro', 'candy ride', 'liam\'s map', 'flameaway', 'good magic', 'yaupon',
    'uncle mo', 'speightstown', 'maclean\'s music', 'pioneerof the nile', 'city zip',
    'mendelssohn', 'cairo prince', 'make believe', 'collected', 'classic empire',
    'oscar performance', 'maximus mischief', ' Omaha Beach', 'mclean\'s music']

  const goodSires = ['big brown', 'unbridled\'s song', 'more than ready', 'scat daddy', 'captain bod',
    'broken vow', 'curlin', 'majesticper', 'giant\'s causeway', 'el prado', 'harlan\'s holiday',
    'distorted humor', 'bernardini', 'a.p.indy', 'street sense', 'jump start', 'tiznow',
    'lemon drop kid', 'carpe diem', 'maxim', 'lookin at lucky', 'accomplish']

  const name = sire.toLowerCase()
  if (sirePrice >= 250000) return 'elite'
  if (sirePrice >= 100000) return 'good'
  if (sirePrice >= 30000) return 'avg'
  return 'poor'
}

// ─── Score Calculator ──────────────────────────────────────────────────────

function calcScore(h: Horse, mlOdds: number): number {
  let jt = 0, blood = 0, impr = 0, dist = 0, val = 0

  // J/T Combo (max 25)
  if (h.jtComboWinPct >= 40) jt = 25
  else if (h.jtComboWinPct >= 30) jt = 20
  else if (h.jtComboWinPct >= 20) jt = 14
  else if (h.jtComboWinPct >= 15) jt = 8
  else if (h.jtComboWinPct > 0) jt = 4

  // Bloodline (max 20)
  if (h.bloodlineGrade === 'elite') blood = 20
  else if (h.bloodlineGrade === 'good') blood = 14
  else if (h.bloodlineGrade === 'avg') blood = 7
  else blood = 0

  // Improving (max 15)
  if (h.improving) impr = 15
  else if (h.lifeEarnings > 50000) impr = 8
  else if (h.lifeEarnings > 10000) impr = 4

  // Distance (max 20)
  const distParts = h.distanceRecord.split('-')
  const distWins = parseInt(distParts[0]) || 0
  const distPlaces = parseInt(distParts[1]) || 0
  const distTotal = distWins + distPlaces + (parseInt(distParts[2]) || 0)
  const distWR = distTotal > 0 ? (distWins / distTotal) : 0
  if (distWR >= 0.3 && distWins >= 2) dist = 20
  else if (distWR >= 0.2 && distWins >= 1) dist = 14
  else if (distTotal > 0) dist = 7
  else dist = 3 // first time at distance but bred for it

  // Value (max 20) — higher score at better odds
  if (mlOdds >= 20) val = 20
  else if (mlOdds >= 12) val = 16
  else if (mlOdds >= 8) val = 12
  else if (mlOdds >= 5) val = 8
  else if (mlOdds >= 3) val = 4
  else val = 2

  return jt + blood + impr + dist + val
}

// ─── ML Odds Parser ─────────────────────────────────────────────────────────

function parseOdds(mlStr: string): number {
  const cleaned = mlStr.trim()
  if (cleaned.includes('-')) {
    const num = parseInt(cleaned)
    return num > 0 ? num : 0
  }
  if (cleaned.includes('/')) {
    const [num, den] = cleaned.split('/').map(Number)
    return den > 0 ? num / den : 0
  }
  return parseFloat(cleaned) || 0
}

function mlToProb(odds: number): number {
  if (odds <= 0) return 0
  return odds / (odds + 1)
}

function probToFair(odds: number): number {
  if (odds <= 0) return 0
  return (odds / (odds + 1)) * 100
}

function isOverlay(score: number, mlOdds: number): boolean {
  const fairProb = mlToProb(mlOdds) * 100
  // Overlay if our score says higher chance than ML odds imply
  return score > fairProb + 10
}

// ─── Main Parser ────────────────────────────────────────────────────────────

export function parsePDFText(pdfText: string): Race[] {
  // Split by "=== PAGE N ===" markers
  const pages = pdfText.split(/=== PAGE \d+ ===/)

  // Each page has 2 races (left/right columns in PDF)
  const races: Race[] = []
  const raceNumbers: number[] = []

  // Find all race headers in PDF text
  // Pattern: number + "Churchill Downs" + race info
  const raceHeaderRe = /(\d+)\nChurchill Downs\n([^\n]+)\n(.+?)(?=\n\d+\n[A-Z][a-z]+\s+\()/

  for (const pageText of pages) {
    const matches = pageText.matchAll(raceHeaderRe)
    for (const m of matches) {
      const raceNum = parseInt(m[1])
      if (raceNum && !raceNumbers.includes(raceNum) && raceNum >= 1 && raceNum <= 14) {
        raceNumbers.push(raceNum)
      }
    }
  }

  // For now, map race numbers to page pairs
  // Races 1-2: page 3, 4; 3-4: page 6, 9; 5-6: page 12, 18; etc.
  const racePageMap: Record<number, number> = {
    1: 2, 2: 3,  // 0-indexed
    3: 5, 4: 8,
    5: 11, 6: 14,
    7: 17, 8: 20,
    9: 23, 10: 26,
    11: 29, 12: 32,
    13: 35, 14: 38,
  }

  // Build races from parsed pages
  for (const [raceNum, pageIdx] of Object.entries(racePageMap)) {
    const pageText = pages[pageIdx]
    if (!pageText || pageText.trim().length < 100) continue

    const horses = parseRacePage(pageText, parseInt(raceNum))
    if (horses.length > 0) {
      const race = buildRace(parseInt(raceNum), horses)
      if (race) races.push(race)
    }
  }

  // Sort by race number
  races.sort((a, b) => a.number - b.number)

  // Assign pace scenarios
  races.forEach(r => assignPaceScenario(r))

  // Sort horses by score within each race
  races.forEach(r => {
    r.horses.sort((a, b) => b.score - a.score)
    r.topPicks = r.horses.slice(0, 4)
    r.exactaBox = r.horses.slice(0, 3).map(h => h.program)
    r.trifectaBox = r.horses.slice(0, 4).map(h => h.program)
  })

  return races
}

function buildRace(raceNum: number, horses: Horse[]): Race | null {
  if (horses.length === 0) return null

  return {
    number: raceNum,
    track: 'Churchill Downs',
    distance: horses[0].recentStarts[0]?.distance || '1 Mile',
    raceType: 'Allowance Optional Claiming',
    raceName: `Race ${raceNum}`,
    purse: '$100,000',
    postTime: 'TBD',
    beyerPar: 85,
    horses,
    topPicks: [],
    exactaBox: [],
    trifectaBox: [],
    paceScenario: 'unknown',
    paceNote: '',
    surface: 'dirt',
  }
}

function assignPaceScenario(race: Race) {
  const speeds = race.horses.map(h => h.timeformPace)
  const avg = speeds.reduce((a, b) => a + b, 0) / speeds.length
  const fastCount = speeds.filter(s => s > avg + 10).length

  if (fastCount >= 3) {
    race.paceScenario = 'speed'
    race.paceNote = 'HOT early pace likely — closers get best setup'
  } else if (fastCount <= 1) {
    race.paceScenario = 'closer'
    race.paceNote = 'Slow early pace likely — speed horses benefit'
  } else {
    race.paceScenario = 'press'
    race.paceNote = 'Moderate pace — stalkers and closers both have a shot'
  }
}

// ─── Horse Parser ───────────────────────────────────────────────────────────

function parseRacePage(pageText: string, raceNum: number): Horse[] {
  const horses: Horse[] = []

  // Split by horse entries: a number at start of line followed by ML odds
  const horseRe = /(\d+)\n([\d\-]+)\n([A-Z][A-Za-z\s'\-]+)\nOwn:([^\n]+)\n([A-Z ]+)\s+\(([\d\s\.\%]+)\)\s*([\d\s\.\:]+)\s*(\d{4})\s*\(([A-Za-z\.\s]+)\)\s*\$?([\d,]+)\nSire:\s*([^\(]+)\s*\(([^\)]+)\)\s*\$?([\d,]+)\nDam:([^\n]+)\nBr:([^\n]+)\nTr:([^\(]+)\s*\(([^\)]+)\)\s*([\d\s]+)\nLife\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+\$?([\d,]+)\s+(\d+)/g

  let match
  while ((match = horseRe.exec(pageText)) !== null) {
    const horse = buildHorse(match, pageText)
    if (horse) horses.push(horse)
  }

  return horses
}

function buildHorse(match: RegExpExecArray, pageText: string): Horse | null {
  try {
    const program = parseInt(match[1])
    const ml = match[2].trim()
    const odds = parseOdds(ml)
    const name = match[3].trim()

    const jockeyFull = match[5].trim()
    const jockey = jockeyFull.replace(/\s*\([\d\s\.\%,]+\)\s*/, '').trim()
    const jStats = match[6].trim()
    const trainer = match[15].trim()
    const tStats = match[16].trim()

    const year = match[8]
    const sire = match[11].trim()
    const sirePrice = parseInt(match[13].replace(/,/g, '')) || 0
    const damSire = match[14].trim()

    const lifeStarts = parseInt(match[18]) || 0
    const lifeWins = parseInt(match[19]) || 0
    const lifeEarnings = parseInt(match[22].replace(/,/g, '')) || 0
    const lastBeyer = parseInt(match[23]) || 0

    // Parse J stats: "(wins plays iters ROI%)" e.g. "28 5 4 4 .18"
    const jStatsParts = jStats.trim().split(/\s+/)
    const jWins = parseInt(jStatsParts[0]) || 0
    const jPlaced = parseInt(jStatsParts[1]) || 0
    const jShows = parseInt(jStatsParts[2]) || 0
    const jROI = parseFloat(jStatsParts[jStatsParts.length - 1]) || 0
    const jCD = jStats.includes('CD') ? 0.25 : 0 // heuristic

    // Parse T stats
    const tStatsParts = tStats.trim().split(/\s+/)
    const tWins = parseInt(tStatsParts[0]) || 0
    const tCD = tStats.includes('CD') ? 0.25 : 0 // heuristic

    const bloodlineGrade = gradeBloodline(sire, sirePrice)

    const horse: Horse = {
      program,
      name,
      ml,
      odds,
      jockey,
      jockeyWins: jWins,
      jockeyROI: jROI,
      jockeyCD: jCD,
      trainer,
      trainerWins: tWins,
      trainerROI: 0,
      trainerCD: tCD,
      jtComboWinPct: (jCD + tCD) / 2 * 100,
      jtComboROI: 0,
      sire,
      sirePrice,
      damSire,
      bloodlineGrade,
      beyer: lastBeyer,
      timeformPace: 85,
      timeformLate: 85,
      lifeRecord: `${lifeWins}-${jPlaced}-${jShows}-${lifeStarts - lifeWins - jPlaced - jShows}`,
      lifeWins,
      lifeEarnings,
      recentStarts: parseRecentStarts(pageText, name),
      improving: false,
      cdRecord: '0-0-0-0',
      cdEarnings: 0,
      distanceRecord: '0-0-0-0',
      surfaceRecord: '0-0-0-0',
      winsAtCD: 0,
      lastOut: lastBeyer,
      twoBack: 0,
      works: parseWorks(pageText, name),
      trainerStats: {
        dirt: { winPct: 0.20, roi: 1.5 },
        routes: { winPct: 0.18, roi: 1.4 },
        sprint: { winPct: 0.22, roi: 1.5 },
        mud: { winPct: 0.15, roi: 1.2 },
        cd: { winPct: 0.20, roi: 1.5 },
        firstOffLayup: { winPct: 0.25, roi: 2.0 },
        blinkerOn: { winPct: 0.15, roi: 1.3 },
        blinkerOff: { winPct: 0.28, roi: 1.8 },
      },
      score: 0,
      scoreBreakdown: { jtCombo: 0, bloodline: 0, improving: 0, distance: 0, value: 0 },
      isOverlay: false,
      overlayValue: 0,
    }

    // Calculate score
    horse.score = calcScore(horse, odds)
    horse.isOverlay = isOverlay(horse.score, odds)
    horse.overlayValue = horse.score - probToFair(odds)

    return horse
  } catch (e) {
    return null
  }
}

function parseRecentStarts(pageText: string, horseName: string): RaceResult[] {
  // Look for pattern: date + track + race info + description
  const results: RaceResult[] = []
  const lines = pageText.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.includes(horseName.substring(0, 8))) {
      // Found a past start line — extract context
      const context = lines.slice(Math.max(0, i - 3), i + 5).join('\n')
      const dateMatch = context.match(/\d+[àáãäåæç]\d+/) // e.g. "28à26" = Apr 28, 2026
      const trackMatch = context.match(/(?:CD|Kee|FG|TP|OP|SA|Aqu|Sar|GP|Tam)/)
      const finishMatch = context.match(/(\d+)\s*[\/]\s*(\d+)/)
      const descMatch = context.match(/[A-Z][a-z].*?(?=\n|$)/)

      if (dateMatch && finishMatch) {
        results.push({
          date: dateMatch[0],
          track: trackMatch ? trackMatch[0] : 'Unknown',
          distance: '',
          raceType: ' Allowance',
          finish: finishMatch[1],
          finishPos: parseInt(finishMatch[1]),
          description: descMatch ? descMatch[0].substring(0, 100) : '',
        })
      }
    }
  }

  return results.slice(0, 5)
}

function parseWorks(pageText: string, horseName: string): Work[] {
  const works: Work[] = []
  const lines = pageText.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.includes(horseName.substring(0, 8)) && line.includes('WORK')) {
      // Found works — extract from nearby context
      for (let j = Math.max(0, i - 2); j < Math.min(lines.length, i + 3); j++) {
        const workLine = lines[j]
        if (workLine.includes('f fst') || workLine.includes('f gd') || workLine.includes('f sly')) {
          const parts = workLine.trim().split(/\s+/)
          if (parts.length >= 3) {
            works.push({
              date: parts[0],
              track: parts[1],
              distance: parts[2] || '4f',
              time: parts[3] || '',
              rating: parts[4] || 'B',
              rank: '',
            })
          }
        }
      }
    }
  }

  return works.slice(0, 5)
}

// ─── Quick Analysis ─────────────────────────────────────────────────────────

export function analyzeRaces(races: Race[]) {
  const overlays: Race['horses'][0][] = []
  const topPlays: Race['horses'][0][] = []

  for (const race of races) {
    for (const horse of race.topPicks) {
      if (horse.isOverlay && horse.program <= 3) {
        overlays.push(horse)
      }
    }
    if (race.topPicks.length > 0) {
      topPlays.push(race.topPicks[0])
    }
  }

  return {
    races,
    overlays,
    topPlays,
  }
}