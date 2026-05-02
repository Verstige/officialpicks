'use client'
import { useState } from 'react'
import { Upload, Loader2, FileText, ArrowRight, Trophy, AlertCircle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface RaceResult {
  number: number
  horses: {
    program: number
    name: string
    ml: string
    score: number
    isOverlay: boolean
    scoreBreakdown: { jtCombo: number; bloodline: number; improving: number; distance: number; value: number }
  }[]
  topPicks: number[]
  exactaBox: number[]
  paceScenario: string
  paceNote: string
}

interface AnalysisResult {
  races: RaceResult[]
  overlays: { race: number; program: number; horse: string; ml: string; score: number }[]
  summary: string
}

export default function HorseRacingUpload() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [dragOver, setDragOver] = useState(false)

  async function handleUpload(file: File) {
    if (!file.name.endsWith('.pdf')) {
      toast.error('Please upload a PDF file')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/horse-racing/analyze', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Analysis failed')
        return
      }

      setResult(data)
      toast.success(`✅ Analyzed ${data.races.length} races — found ${data.overlays.length} overlays!`)
    } catch (e) {
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleFile(f: File) {
    handleUpload(f)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div style={{ padding: '40px 0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(245,166,35,0.1)', padding: '14px', borderRadius: '14px' }}>
            <Trophy size={32} color="#F5A623" />
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '36px', fontWeight: 800 }}>
            🐎 Horse Racing <span className="text-gradient">Analyzer</span>
          </h1>
        </div>
        <p style={{ color: '#9CA3AF', fontSize: '18px', maxWidth: '560px', margin: '0 auto' }}>
          Upload a DRF PDF and get instant expert analysis — top picks, overlays, exacta boxes, and pace scenarios for every race.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? '#F5A623' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: '20px',
          padding: '64px 40px',
          textAlign: 'center',
          background: dragOver ? 'rgba(245,166,35,0.05)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.2s',
          marginBottom: '40px',
          cursor: 'pointer',
        }}
        onClick={() => document.getElementById('pdf-upload')?.click()}
      >
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Loader2 size={48} color="#F5A623" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#F5A623', fontSize: '18px', fontWeight: 600 }}>Analyzing races...</p>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>Parsing PDF, scoring horses, finding overlays</p>
          </div>
        ) : (
          <>
            <div style={{ background: 'rgba(245,166,35,0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Upload size={36} color="#F5A623" />
            </div>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '22px', marginBottom: '10px' }}>
              Drop your DRF PDF here
            </h3>
            <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '24px' }}>
              or click to browse — supports Churchill Downs, Keeneland, and DRF-formatted PDFs
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245,166,35,0.1)', padding: '10px 20px', borderRadius: '9999px', color: '#F5A623', fontSize: '14px', fontWeight: 600 }}>
              <FileText size={16} /> Upload DRF Race Card PDF
            </div>
          </>
        )}
      </div>

      {/* Results */}
      {result && (
        <div>
          {/* Summary Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#22C55E', fontFamily: 'Outfit' }}>{result.races.length}</div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Races Analyzed</div>
            </div>
            <div style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#F5A623', fontFamily: 'Outfit' }}>{result.overlays.length}</div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Overlay Plays</div>
            </div>
            <div style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#A78BFA', fontFamily: 'Outfit' }}>{result.overlays.filter(o => o.score >= 75).length}</div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>High-Confidence</div>
            </div>
          </div>

          {/* Overlay Plays */}
          {result.overlays.length > 0 && (
            <div className="card" style={{ marginBottom: '28px', border: '1px solid rgba(245,166,35,0.3)' }}>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🔥 Overlay Plays — Best Value on the Card
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {result.overlays.map((o, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(245,166,35,0.05)', borderRadius: '12px', border: '1px solid rgba(245,166,35,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ background: '#F5A623', color: '#070B14', fontWeight: 800, fontSize: '18px', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit' }}>
                        R{o.race}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '16px' }}>#{o.program} {o.horse}</div>
                        <div style={{ color: '#6B7280', fontSize: '13px' }}>ML: {o.ml}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '22px', color: '#F5A623', fontFamily: 'Outfit' }}>{o.score}</div>
                      <div style={{ color: '#6B7280', fontSize: '12px' }}>Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Race by Race */}
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '22px', marginBottom: '20px' }}>📋 Race-by-Race Analysis</h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            {result.races.map(race => (
              <div key={race.number} className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #F5A623, #D4841A)', color: '#070B14', fontWeight: 900, fontSize: '20px', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit' }}>
                      {race.number}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '18px', fontFamily: 'Outfit' }}>Race {race.number}</div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>
                        <span style={{ color: race.paceScenario === 'speed' ? '#EF4444' : race.paceScenario === 'closer' ? '#22C55E' : '#F5A623', fontWeight: 600 }}>
                          {race.paceScenario === 'speed' ? '⚡ Speed' : race.paceScenario === 'closer' ? '🐢 Closer' : '⚖️ Press'}
                        </span>
                        {' — '}{race.paceNote}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="badge badge-gold">Exacta: {race.exactaBox.join('-')}</span>
                  </div>
                </div>

                {/* Top 4 Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#6B7280', fontSize: '12px', fontWeight: 600 }}>#</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#6B7280', fontSize: '12px', fontWeight: 600 }}>Horse</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#6B7280', fontSize: '12px', fontWeight: 600 }}>ML</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#6B7280', fontSize: '12px', fontWeight: 600 }}>Score</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#6B7280', fontSize: '12px', fontWeight: 600 }}>J/T</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#6B7280', fontSize: '12px', fontWeight: 600 }}>Blood</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#6B7280', fontSize: '12px', fontWeight: 600 }}>Improve</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#6B7280', fontSize: '12px', fontWeight: 600 }}>Distance</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#6B7280', fontSize: '12px', fontWeight: 600 }}>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {race.topPicks.map((prog, idx) => {
                        const horse = race.horses.find(h => h.program === prog)
                        if (!horse) return null
                        const medals = ['🥇', '🥈', '🥉', '4️⃣']
                        return (
                          <tr key={horse.program} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '10px 12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '16px' }}>{medals[idx]}</span>
                                <span style={{ fontWeight: 800, fontSize: '15px', fontFamily: 'Outfit' }}>#{horse.program}</span>
                              </div>
                            </td>
                            <td style={{ padding: '10px 12px', fontWeight: 600 }}>{horse.name}</td>
                            <td style={{ padding: '10px 12px', color: '#F5A623', fontWeight: 700 }}>{horse.ml}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '40px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ width: `${Math.min(horse.score, 100)}%`, height: '100%', background: horse.score >= 80 ? '#22C55E' : horse.score >= 60 ? '#F5A623' : '#EF4444', borderRadius: '3px' }} />
                                </div>
                                <span style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'Outfit' }}>{horse.score}</span>
                              </div>
                            </td>
                            <td style={{ padding: '10px 12px', fontSize: '14px' }}>
                              <div style={{ color: horse.scoreBreakdown.jtCombo >= 20 ? '#22C55E' : horse.scoreBreakdown.jtCombo >= 10 ? '#F5A623' : '#6B7280' }}>{horse.scoreBreakdown.jtCombo}/25</div>
                            </td>
                            <td style={{ padding: '10px 12px', fontSize: '14px' }}>
                              <div style={{ color: horse.scoreBreakdown.bloodline >= 14 ? '#22C55E' : horse.scoreBreakdown.bloodline >= 7 ? '#F5A623' : '#6B7280' }}>{horse.scoreBreakdown.bloodline}/20</div>
                            </td>
                            <td style={{ padding: '10px 12px', fontSize: '14px' }}>
                              <div style={{ color: horse.scoreBreakdown.improving >= 10 ? '#22C55E' : '#6B7280' }}>{horse.scoreBreakdown.improving}/15</div>
                            </td>
                            <td style={{ padding: '10px 12px', fontSize: '14px' }}>
                              <div style={{ color: horse.scoreBreakdown.distance >= 14 ? '#22C55E' : horse.scoreBreakdown.distance >= 7 ? '#F5A623' : '#6B7280' }}>{horse.scoreBreakdown.distance}/20</div>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              {horse.isOverlay ? (
                                <span style={{ color: '#22C55E', fontWeight: 700, fontSize: '14px' }}>🔥 YES</span>
                              ) : (
                                <span style={{ color: '#6B7280', fontSize: '14px' }}>—</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Exacta Box */}
                <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(245,166,35,0.06)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#6B7280', fontSize: '14px' }}>Exacta Box:</span>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#F5A623', fontSize: '16px' }}>
                    {race.exactaBox.map(p => `#${p}`).join(' — ')}
                  </span>
                  {race.exactaBox.length === 3 && (
                    <span style={{ color: '#6B7280', fontSize: '13px' }}>(6 combinations)</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Post to Picks Button */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <a href="/admin/picks?type=horse_racing" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, #F5A623, #D4841A)', color: '#070B14', fontWeight: 700, fontSize: '16px', padding: '16px 36px', borderRadius: '9999px', textDecoration: 'none' }}>
              Post Results to Picks Dashboard <ArrowRight size={18} />
            </a>
            <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '12px' }}>
              This will post today's top horse racing picks to the admin dashboard for subscriber delivery.
            </p>
          </div>
        </div>
      )}

      {/* How it Works */}
      {!result && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '12px' }}>
          {[
            { icon: '📄', title: 'Upload PDF', desc: 'Drag & drop a DRF race card PDF from Churchill Downs, Keeneland, or any track.' },
            { icon: '🧠', title: 'AI Analysis', desc: 'Every horse scored on J/T combo, bloodline quality, recent form, distance, and value.' },
            { icon: '🔥', title: 'Overlays Flagged', desc: 'Horses where the Morning Line odds are better than their score warrants.' },
            { icon: '📊', title: 'Exacta Boxes', desc: 'Top 3 horses boxed as exactas, with pace scenarios for every race.' },
          ].map(item => (
            <div key={item.title} style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
              <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h4>
              <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}