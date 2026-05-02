'use client'
export const dynamic = 'force-dynamic'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { Upload, Loader2, Trophy, CheckCircle2, AlertCircle, ArrowRight, X, ChevronDown, ChevronUp } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScoreBreakdown { jtCombo: number; bloodline: number; improving: number; distance: number; value: number }
interface Horse {
  program: number
  name: string
  ml: string
  odds: number
  score: number
  isOverlay: boolean
  overlayValue: number
  scoreBreakdown: ScoreBreakdown
  jockey: string
  trainer: string
  sire: string
  sirePrice: number
  bloodlineGrade: string
  lifeRecord: string
  lifeEarnings: number
  cdRecord: string
  cdEarnings: number
  improving: boolean
  recentStarts: { finish: string; track: string; raceName: string; description: string }[]
}
interface Race {
  number: number
  raceName: string
  distance: string
  raceType: string
  purse: string
  postTime: string
  surface: string
  paceScenario: string
  paceNote: string
  horses: Horse[]
  topPicks: number[]
  exactaBox: number[]
  trifectaBox: number[]
}
interface AnalysisResult {
  date: string
  track: string
  races: Race[]
  overlays: { race: number; program: number; horse: string; ml: string; score: number }[]
}

interface StoredAnalysis {
  id: string
  created_at: string
  analysis: AnalysisResult
  picks_posted: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SPORT_EMOJI = { horse_racing: '🐎' }
const MEDALS = ['🥇', '🥈', '🥉', '4️⃣']

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminHorseRacing() {
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [storedAnalyses, setStoredAnalyses] = useState<StoredAnalysis[]>([])
  const [expandedRace, setExpandedRace] = useState<number | null>(null)
  const [postLoading, setPostLoading] = useState<string | null>(null) // race key
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => { fetchStoredAnalyses() }, [])

  async function fetchStoredAnalyses() {
    // Load from localStorage for now — admin can switch to Supabase later
    const stored = localStorage.getItem('horse_racing_analyses')
    if (stored) {
      try {
        setStoredAnalyses(JSON.parse(stored))
      } catch { /* ignore */ }
    }
  }

  function saveAnalysis(analysis: AnalysisResult) {
    const entry: StoredAnalysis = {
      id: `analysis-${Date.now()}`,
      created_at: new Date().toISOString(),
      analysis,
      picks_posted: 0,
    }
    const updated = [entry, ...storedAnalyses].slice(0, 30) // keep last 30
    setStoredAnalyses(updated)
    localStorage.setItem('horse_racing_analyses', JSON.stringify(updated))
  }

  async function handleFile(file: File) {
    if (!file.name.endsWith('.pdf')) {
      toast.error('Please upload a PDF file')
      return
    }
    setAnalyzing(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/horse-racing/analyze', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Analysis failed'); return }
      setResult(data)
      saveAnalysis(data)
      toast.success(`✅ ${data.races.length} races — ${data.overlays.length} overlays found!`)
    } catch {
      toast.error('Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  // ── Post single race as a pick ──────────────────────────────────────────────

  async function postRacePick(race: Race, topHorse: Horse) {
    setPostLoading(`race-${race.number}`)
    try {
      const raceTitle = `${topHorse.name} (${topHorse.ml})`
      const raceNote = `Race ${race.number} — ${race.distance} ${race.raceType}. Top play: ${topHorse.name} at ${topHorse.ml}. Exacta box: ${race.exactaBox.map(p => `#${p}`).join(', ')}. Pace: ${race.paceScenario}.`

      const { data, error } = await supabase.from('picks').insert({
        sport: 'horse_racing',
        title: raceTitle,
        description: raceNote,
        level: topHorse.score >= 80 ? 'super_sonic' : topHorse.score >= 65 ? '4' : '3',
        is_public: true,
        published_at: new Date().toISOString(),
      }).select().single()

      if (error) { toast.error('Failed to post pick'); return }

      // Notify subscribers
      const notifyRes = await fetch('/api/picks/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickId: data.id, type: 'new_pick' }),
      })
      const notifyData = await notifyRes.json()
      toast.success(`🎯 Race ${race.number} pick posted! 📧 Sent to ${notifyData.sent || 0} subscribers`)

      // Mark as posted
      setStoredAnalyses(prev => prev.map(a =>
        a.analysis === result ? { ...a, picks_posted: a.picks_posted + 1 } : a
      ))
    } catch {
      toast.error('Failed to post pick')
    } finally {
      setPostLoading(null)
    }
  }

  // ── Post all races at once ──────────────────────────────────────────────────

  async function postAllRaces() {
    if (!result) return
    setPostLoading('all')
    let posted = 0
    for (const race of result.races) {
      const topHorse = race.horses.find(h => h.program === race.topPicks[0])
      if (!topHorse) continue
      const { data, error } = await supabase.from('picks').insert({
        sport: 'horse_racing',
        title: `${topHorse.name} (${topHorse.ml})`,
        description: `Race ${race.number} — ${race.distance}. Exacta: ${race.exactaBox.map(p => `#${p}`).join(', ')}. Pace: ${race.paceScenario}. ${race.topPicks.slice(0, 3).map(p => { const h = race.horses.find(horse => horse.program === p); return h ? `${h.name} ${h.ml}` : '' }).join(' | ')}`,
        level: topHorse.score >= 80 ? 'super_sonic' : '4',
        is_public: true,
        published_at: new Date().toISOString(),
      }).select().single()
      if (!error) posted++
    }
    toast.success(`🎉 Posted ${posted} picks to dashboard!`)
    setPostLoading(null)
  }

  const isHorseRacing = result?.races?.[0]?.surface === 'turf' ? false : true

  return (
    <div className="dashboard-layout">
      <Sidebar role="admin" />

      <div className="main-content">
        {/* ── Header ── */}
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1>🐎 Horse Racing Analysis</h1>
              <p>Upload a DRF PDF to analyze races — then post picks to subscribers</p>
            </div>
            {result && (
              <button
                className="btn btn-primary"
                onClick={postAllRaces}
                disabled={postLoading !== null}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {postLoading === 'all' ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Trophy size={16} />}
                Post All Top Picks
              </button>
            )}
          </div>
        </div>

        <div className="page-body">
          {/* ── Upload Zone ── */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? '#F5A623' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: '16px',
              padding: '40px 32px',
              textAlign: 'center',
              background: dragOver ? 'rgba(245,166,35,0.05)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.2s',
              marginBottom: '28px',
              cursor: 'pointer',
            }}
          >
            <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileInput} style={{ display: 'none' }} />
            {analyzing ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <Loader2 size={40} color="#F5A623" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#F5A623', fontSize: '17px', fontWeight: 600 }}>Analyzing race card...</p>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>Scoring horses on J/T combo, bloodline, pace, distance, and value</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(245,166,35,0.1)', width: '72px', height: '72px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={32} color="#F5A623" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '18px', marginBottom: '6px' }}>Drop DRF Race Card PDF</p>
                  <p style={{ color: '#6B7280', fontSize: '14px' }}>Churchill Downs, Keeneland, or any DRF-formatted PDF</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Results ── */}
          {result && (
            <>
              {/* Summary Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
                <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', fontFamily: 'Outfit' }}>{result.races.length}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>Races Analyzed</div>
                </div>
                <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#F5A623', fontFamily: 'Outfit' }}>{result.overlays.length}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>Overlay Plays</div>
                </div>
                <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#22C55E', fontFamily: 'Outfit' }}>{result.overlays.filter(o => o.score >= 75).length}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>High Confidence</div>
                </div>
                <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#A78BFA', fontFamily: 'Outfit' }}>{result.track}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>{result.date}</div>
                </div>
              </div>

              {/* Overlays Callout */}
              {result.overlays.length > 0 && (
                <div style={{ background: 'rgba(245,166,35,0.07)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '16px', marginBottom: '14px', color: '#F5A623' }}>
                    🔥 Overlay Plays — Best Value on the Card
                  </h3>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {result.overlays.slice(0, 8).map((o, i) => (
                      <div key={i} style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '8px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#F5A623', fontSize: '16px' }}>R{o.race}</span>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>#{o.program} {o.horse}</span>
                        <span style={{ color: '#6B7280', fontSize: '13px' }}>@ {o.ml}</span>
                        <span style={{ fontWeight: 800, color: '#22C55E', fontSize: '14px' }}>{o.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Race Cards */}
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '18px', marginBottom: '16px' }}>
                📋 Race-by-Race Analysis
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {result.races.map(race => {
                  const isExpanded = expandedRace === race.number
                  const top3 = race.topPicks.slice(0, 3)
                  const topHorse = race.horses.find(h => h.program === race.topPicks[0])
                  const isPosting = postLoading === `race-${race.number}`

                  return (
                    <div key={race.number} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                      {/* Race Header */}
                      <div
                        style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', background: isExpanded ? 'rgba(245,166,35,0.03)' : 'transparent', borderBottom: isExpanded ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                        onClick={() => setExpandedRace(isExpanded ? null : race.number)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ background: 'linear-gradient(135deg, #F5A623, #D4841A)', color: '#070B14', fontWeight: 900, fontSize: '20px', minWidth: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit' }}>
                            {race.number}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '17px', fontFamily: 'Outfit' }}>Race {race.number} — {race.distance}</div>
                            <div style={{ fontSize: '13px', color: '#6B7280' }}>
                              {race.raceType} &nbsp;•&nbsp; {race.purse} &nbsp;•&nbsp;
                              <span style={{ color: race.paceScenario === 'speed' ? '#EF4444' : race.paceScenario === 'closer' ? '#22C55E' : '#F5A623', fontWeight: 600 }}>
                                {race.paceScenario === 'speed' ? '⚡ Speed' : race.paceScenario === 'closer' ? '🐢 Closer' : '⚖️ Press'}
                              </span>
                              {' — '}{race.paceNote}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {/* Top 3 quick view */}
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {top3.map((prog, idx) => {
                              const h = race.horses.find(horse => horse.program === prog)
                              if (!h) return null
                              return (
                                <div key={prog} style={{ background: idx === 0 ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${idx === 0 ? 'rgba(245,166,35,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '6px', padding: '4px 8px', textAlign: 'center' }}>
                                  <div style={{ fontSize: '10px', color: '#6B7280' }}>{MEDALS[idx]}</div>
                                  <div style={{ fontWeight: 700, fontSize: '13px' }}>#{h.program}</div>
                                  <div style={{ fontSize: '11px', color: '#F5A623' }}>{h.ml}</div>
                                </div>
                              )
                            })}
                          </div>

                          {/* Post top pick button */}
                          {topHorse && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={e => { e.stopPropagation(); postRacePick(race, topHorse) }}
                              disabled={isPosting || postLoading === 'all'}
                              style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                            >
                              {isPosting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trophy size={14} />}
                              Post Pick
                            </button>
                          )}

                          {isExpanded ? <ChevronUp size={18} color="#6B7280" /> : <ChevronDown size={18} color="#6B7280" />}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div style={{ padding: '0 24px 24px' }}>
                          {/* Exacta + Trifecta boxes */}
                          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                            <div style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '8px', padding: '10px 14px' }}>
                              <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Exacta Box</div>
                              <div style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#F5A623', fontSize: '15px' }}>
                                {race.exactaBox.map(p => `#${p}`).join(' — ')}
                                {race.exactaBox.length === 3 && <span style={{ color: '#6B7280', fontSize: '12px', marginLeft: '8px' }}>(6 combos)</span>}
                              </div>
                            </div>
                            <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: '8px', padding: '10px 14px' }}>
                              <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Trifecta Box</div>
                              <div style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#A78BFA', fontSize: '15px' }}>
                                {race.trifectaBox.map(p => `#${p}`).join(' — ')}
                                <span style={{ color: '#6B7280', fontSize: '12px', marginLeft: '8px' }}>(24 combos)</span>
                              </div>
                            </div>
                          </div>

                          {/* Full horse table */}
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                  {['#', 'Horse', 'ML', 'Score', 'J/T', 'Blood', 'Improve', 'Dist', 'Value', 'Status'].map(h => (
                                    <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: '#6B7280', fontWeight: 600, fontSize: '11px', whiteSpace: 'nowrap' }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {race.horses.sort((a, b) => b.score - a.score).map((h, idx) => {
                                  const isTop = race.topPicks.slice(0, 4).includes(h.program)
                                  return (
                                    <tr key={h.program} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isTop ? 'rgba(245,166,35,0.03)' : 'transparent' }}>
                                      <td style={{ padding: '10px 10px', whiteSpace: 'nowrap' }}>
                                        <span style={{ marginRight: '4px' }}>{MEDALS[idx] || ''}</span>
                                        <span style={{ fontWeight: 800, fontFamily: 'Outfit' }}>#{h.program}</span>
                                      </td>
                                      <td style={{ padding: '10px 10px', fontWeight: 600, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={h.name}>{h.name}</td>
                                      <td style={{ padding: '10px 10px', color: '#F5A623', fontWeight: 700 }}>{h.ml}</td>
                                      <td style={{ padding: '10px 10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          <div style={{ width: '36px', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${Math.min(h.score, 100)}%`, height: '100%', background: h.score >= 80 ? '#22C55E' : h.score >= 60 ? '#F5A623' : '#EF4444', borderRadius: '3px' }} />
                                          </div>
                                          <span style={{ fontWeight: 700, fontSize: '13px', fontFamily: 'Outfit' }}>{h.score}</span>
                                        </div>
                                      </td>
                                      <td style={{ padding: '10px 10px' }}>
                                        <div style={{ color: h.scoreBreakdown.jtCombo >= 20 ? '#22C55E' : h.scoreBreakdown.jtCombo >= 10 ? '#F5A623' : '#6B7280', fontSize: '13px' }}>{h.scoreBreakdown.jtCombo}</div>
                                      </td>
                                      <td style={{ padding: '10px 10px' }}>
                                        <div style={{ color: h.scoreBreakdown.bloodline >= 14 ? '#22C55E' : h.scoreBreakdown.bloodline >= 7 ? '#F5A623' : '#6B7280', fontSize: '13px' }}>{h.scoreBreakdown.bloodline}</div>
                                      </td>
                                      <td style={{ padding: '10px 10px' }}>
                                        <div style={{ color: h.scoreBreakdown.improving >= 10 ? '#22C55E' : '#6B7280', fontSize: '13px' }}>{h.scoreBreakdown.improving}</div>
                                      </td>
                                      <td style={{ padding: '10px 10px' }}>
                                        <div style={{ color: h.scoreBreakdown.distance >= 14 ? '#22C55E' : h.scoreBreakdown.distance >= 7 ? '#F5A623' : '#6B7280', fontSize: '13px' }}>{h.scoreBreakdown.distance}</div>
                                      </td>
                                      <td style={{ padding: '10px 10px' }}>
                                        <div style={{ color: h.scoreBreakdown.value >= 12 ? '#22C55E' : '#6B7280', fontSize: '13px' }}>{h.scoreBreakdown.value}</div>
                                      </td>
                                      <td style={{ padding: '10px 10px' }}>
                                        {h.isOverlay
                                          ? <span style={{ color: '#22C55E', fontWeight: 700, fontSize: '13px', background: 'rgba(34,197,94,0.1)', padding: '3px 8px', borderRadius: '4px' }}>🔥 Overlay</span>
                                          : isTop ? <span style={{ color: '#F5A623', fontSize: '13px' }}>⭐ Top {race.topPicks.indexOf(h.program) + 1}</span>
                                          : <span style={{ color: '#4B5563', fontSize: '13px' }}>—</span>
                                        }
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* Jockey + Trainer detail */}
                          <div style={{ marginTop: '14px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ fontSize: '12px', color: '#6B7280' }}>
                              <span style={{ fontWeight: 600, color: '#D1D5DB' }}>Top Pick J/T:</span>{' '}
                              {topHorse ? `${topHorse.jockey} / ${topHorse.trainer}` : '—'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6B7280' }}>
                              <span style={{ fontWeight: 600, color: '#D1D5DB' }}>Bloodline:</span>{' '}
                              {topHorse ? `${topHorse.sire} (${topHorse.bloodlineGrade}, $${(topHorse.sirePrice / 1000).toFixed(0)}k)` : '—'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6B7280' }}>
                              <span style={{ fontWeight: 600, color: '#D1D5DB' }}>CD Record:</span>{' '}
                              {topHorse?.cdRecord || '—'} ({topHorse?.cdEarnings ? `$${topHorse.cdEarnings.toLocaleString()}` : '—'})
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Post All CTA */}
              <div style={{ marginTop: '28px', textAlign: 'center' }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={postAllRaces}
                  disabled={postLoading !== null}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                >
                  {postLoading === 'all' ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Trophy size={18} />}
                  Post All Top Picks to Dashboard
                </button>
                <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '10px' }}>
                  Posts {result.races.length} picks — one per race, top horse each — to the admin dashboard for subscriber delivery
                </p>
              </div>
            </>
          )}

          {/* ── No Result State ── */}
          {!result && (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐎</div>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#D1D5DB', marginBottom: '8px' }}>Upload a Race Card to Begin</h3>
              <p style={{ fontSize: '15px' }}>Supports DRF-formatted PDFs from any track. Analysis includes top 4 picks, exacta boxes, overlays, and pace scenarios.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}