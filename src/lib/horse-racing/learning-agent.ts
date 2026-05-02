/**
 * Learning Agent — Tracks picks vs results to improve scoring weights over time
 * Stores feedback in Supabase and adjusts factor weights based on what actually hits
 */

import { createClient } from '@/lib/supabase/server'

export interface Feedback {
  race_date: string
  track: string
  race_number: number
  horse_name: string
  program_number: number
  predicted_score: number
  predicted_rank: number // 1st, 2nd, 3rd, 4th
  actual_finish: number | null // null if race not run yet
  ml_odds: string
  predicted_factors: string[] // ['jt_combo', 'bloodline', 'improving', 'distance', 'value']
  result: 'win' | 'placed' | 'show' | 'lost' | 'pending'
  score_breakdown: number[] // [jt, blood, impr, dist, value]
}

export interface FactorWeight {
  factor: string
  weight: number // current weight
  wins: number
  total: number
  winRate: number
  lastUpdated: string
}

// ─── Record a prediction ───────────────────────────────────────────────────

export async function recordPrediction(feedback: Feedback) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('horse_racing_picks').upsert({
    race_date: feedback.race_date,
    track: feedback.track,
    race_number: feedback.race_number,
    horse_name: feedback.horse_name,
    program_number: feedback.program_number,
    predicted_score: feedback.predicted_score,
    predicted_rank: feedback.predicted_rank,
    ml_odds: feedback.ml_odds,
    predicted_factors: feedback.predicted_factors,
    result: feedback.result,
    score_breakdown: feedback.score_breakdown,
    recorded_by: user.id,
  }, {
    onConflict: 'race_date,track,race_number,program_number',
  })
}

// ─── Record a result ────────────────────────────────────────────────────────

export async function recordResult(
  raceDate: string,
  track: string,
  raceNumber: number,
  programNumber: number,
  actualFinish: number
) {
  const supabase = await createClient()
  const result = actualFinish === 1 ? 'win' : actualFinish === 2 ? 'placed' : actualFinish === 3 ? 'show' : 'lost'

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('horse_racing_picks')
    .update({
      actual_finish: actualFinish,
      result,
    })
    .eq('race_date', raceDate)
    .eq('track', track)
    .eq('race_number', raceNumber)
    .eq('program_number', programNumber)
}

// ─── Get factor performance ──────────────────────────────────────────────────

export async function getFactorPerformance(daysBack = 90): FactorWeight[] {
  const supabase = await createClient()

  const since = new Date()
  since.setDate(since.getDate() - daysBack)

  const { data: picks } = await supabase
    .from('horse_racing_picks')
    .select('*')
    .eq('result', 'win')
    .gte('race_date', since.toISOString().split('T')[0])

  if (!picks || picks.length === 0) {
    // Return default weights
    return DEFAULT_WEIGHTS
  }

  const total = picks.length

  // Analyze which score breakdown components correlate with wins
  const jtWins = picks.filter(p => (p.score_breakdown as number[])?.[0] >= 20).length
  const bloodWins = picks.filter(p => (p.score_breakdown as number[])?.[1] >= 14).length
  const imprWins = picks.filter(p => (p.score_breakdown as number[])?.[2] >= 10).length
  const distWins = picks.filter(p => (p.score_breakdown as number[])?.[3] >= 14).length
  const valWins = picks.filter(p => (p.score_breakdown as number[])?.[4] >= 12).length

  const factors: FactorWeight[] = [
    { factor: 'jt_combo', weight: jtWins / total * 100, wins: jtWins, total, winRate: jtWins / total, lastUpdated: new Date().toISOString() },
    { factor: 'bloodline', weight: bloodWins / total * 100, wins: bloodWins, total, winRate: bloodWins / total, lastUpdated: new Date().toISOString() },
    { factor: 'improving', weight: imprWins / total * 100, wins: imprWins, total, winRate: imprWins / total, lastUpdated: new Date().toISOString() },
    { factor: 'distance', weight: distWins / total * 100, wins: distWins, total, winRate: distWins / total, lastUpdated: new Date().toISOString() },
    { factor: 'value', weight: valWins / total * 100, wins: valWins, total, winRate: valWins / total, lastUpdated: new Date().toISOString() },
  ]

  // Normalize weights to sum to 100
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0)
  if (totalWeight > 0) {
    factors.forEach(f => { f.weight = (f.weight / totalWeight) * 100 })
  }

  return factors
}

// ─── Get adjusted score using learned weights ─────────────────────────────────

export async function getAdjustedScore(
  baseScore: number,
  scoreBreakdown: number[],
  factors: FactorWeight[]
): Promise<number> {
  if (factors.length === 0) return baseScore

  const weights = factors.map(f => f.weight / 100)
  const weightedSum = scoreBreakdown.reduce((sum, val, i) => sum + (val * weights[i] * 4), 0) // *4 because breakdown max is 25 each
  const normalized = Math.min(100, weightedSum)

  // Blend base score with learned score (70% learned, 30% base to keep some stability)
  return Math.round(baseScore * 0.3 + normalized * 0.7)
}

// ─── Get ROI tracking ────────────────────────────────────────────────────────

export async function getROIStats(daysBack = 30) {
  const supabase = await createClient()
  const since = new Date()
  since.setDate(since.getDate() - daysBack)

  const { data: picks } = await supabase
    .from('horse_racing_picks')
    .select('*')
    .gte('race_date', since.toISOString().split('T')[0])

  if (!picks) return { totalPicks: 0, wins: 0, winRate: 0, avgOdds: 0, roi: 0 }

  const completed = picks.filter(p => p.result !== 'pending')
  const wins = completed.filter(p => p.result === 'win')

  // Calculate ROI: assume $100 to win on each predicted #1
  // Win pays: odds * $100
  // Need at least 50% wins at even odds to break even
  const avgOdds = picks
    .filter(p => p.ml_odds)
    .reduce((sum, p) => sum + parseFloat(p.ml_odds.replace('-', '').replace('/', '.')), 0) / picks.length

  const winRate = completed.length > 0 ? wins.length / completed.length : 0

  // Simple ROI calc: (wins * avg_win_payout - total_stake) / total_stake
  const avgWinPayout = avgOdds > 0 ? avgOdds : 2.0
  const roi = completed.length > 0 ? (wins.length * avgWinPayout - completed.length * 100) / (completed.length * 100) : 0

  return {
    totalPicks: picks.length,
    wins: wins.length,
    winRate: Math.round(winRate * 100),
    avgOdds: Math.round(avgOdds * 10) / 10,
    roi: Math.round(roi * 100),
  }
}

// ─── Default weights (before any learning) ──────────────────────────────────

const DEFAULT_WEIGHTS: FactorWeight[] = [
  { factor: 'jt_combo', weight: 25, wins: 0, total: 0, winRate: 0, lastUpdated: new Date().toISOString() },
  { factor: 'bloodline', weight: 20, wins: 0, total: 0, winRate: 0, lastUpdated: new Date().toISOString() },
  { factor: 'improving', weight: 15, wins: 0, total: 0, winRate: 0, lastUpdated: new Date().toISOString() },
  { factor: 'distance', weight: 20, wins: 0, total: 0, winRate: 0, lastUpdated: new Date().toISOString() },
  { factor: 'value', weight: 20, wins: 0, total: 0, winRate: 0, lastUpdated: new Date().toISOString() },
]

// ─── SQL schema for horse racing picks table ─────────────────────────────────

export const HORSE_RACING_SCHEMA = `
-- Horse Racing Picks Table (for learning agent)
create table if not exists horse_racing_picks (
  id uuid primary key default gen_random_uuid(),
  race_date date not null,
  track text not null,
  race_number integer not null,
  horse_name text not null,
  program_number integer not null,
  predicted_score integer,
  predicted_rank integer,
  actual_finish integer,
  ml_odds text,
  predicted_factors text[],
  score_breakdown integer[],
  result text check (result in ('win', 'placed', 'show', 'lost', 'pending')),
  recorded_by uuid references auth.users(id),
  created_at timestamptz default now(),
  unique(race_date, track, race_number, program_number)
);

-- RLS
alter table horse_racing_picks enable row level security;

-- Admins can manage
create policy "Admins manage horse racing picks" on horse_racing_picks for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Anyone authenticated can read
create policy "Auth users read horse picks" on horse_racing_picks for select using (
  auth.role() = 'authenticated'
);
`