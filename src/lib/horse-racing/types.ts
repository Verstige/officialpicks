export interface Horse {
  program: number
  name: string
  ml: string
  odds: number

  // Trainer/Jockey
  jockey: string
  jockeyWins: number
  jockeyROI: number
  jockeyCD: number // Churchill Downs win %
  trainer: string
  trainerWins: number
  trainerROI: number
  trainerCD: number // CD win %
  jtComboWinPct: number
  jtComboROI: number

  // Bloodline
  sire: string
  sirePrice: number
  damSire: string
  bloodlineGrade: 'elite' | 'good' | 'avg' | 'poor' // derived

  // Performance
  beyer: number
  timeformPace: number
  timeformLate: number
  lifeRecord: string // "X-X-X-X"
  lifeWins: number
  lifeEarnings: number

  // Form
  recentStarts: RaceResult[]
  improving: boolean // 2nd start off layup, improving figs
  cdRecord: string
  cdEarnings: number
  distanceRecord: string // at THIS distance
  surfaceRecord: string // on this surface
  winsAtCD: number
  lastOut: number // last race beyer/fig
  twoBack: number

  // Works
  works: Work[]
  trainerStats: TrainerStats

  // Calculated scores
  score: number
  scoreBreakdown: ScoreBreakdown
  isOverlay: boolean
  overlayValue: number // odds vs score diff
}

export interface RaceResult {
  date: string
  track: string
  distance: string
  raceType: string
  finish: string // "1st", "2nd", etc or "5th" etc
  finishPos: number
  beyer?: number
  timeform?: number
  raceName?: string
  description: string
}

export interface Work {
  date: string
  track: string
  distance: string
  time: string
  rating: string // "B", "Bg", "H", etc
  rank: string // "1/12"
}

export interface TrainerStats {
  dirt: { winPct: number; roi: number }
  routes: { winPct: number; roi: number }
  sprint: { winPct: number; roi: number }
  mud: { winPct: number; roi: number }
  cd: { winPct: number; roi: number }
  firstOffLayup: { winPct: number; roi: number }
  blinkerOn: { winPct: number; roi: number }
  blinkerOff: { winPct: number; roi: number }
}

export interface ScoreBreakdown {
  jtCombo: number     // max 25
  bloodline: number   // max 20
  improving: number   // max 15
  distance: number    // max 20
  value: number       // max 20
}

export interface Race {
  number: number
  track: string
  distance: string
  raceType: string
  raceName: string
  purse: string
  postTime: string
  beyerPar: number
  horses: Horse[]
  topPicks: Horse[]
  exactaBox: number[]
  trifectaBox: number[]
  paceScenario: 'speed' | 'press' | 'closer' | 'unknown'
  paceNote: string
  surface: 'dirt' | 'turf' | 'synthetic'
}

export interface AnalysisResult {
  date: string
  track: string
  races: Race[]
  summary: {
    totalRaces: number
    topPlays: TopPlay[]
    overlays: Overlay[]
  }
}

export interface TopPlay {
  race: number
  program: number
  horse: string
  ml: string
  score: number
  reason: string
}

export interface Overlay {
  race: number
  program: number
  horse: string
  ml: string
  score: number
  value: 'high' | 'medium' | 'low'
}

export interface LearningFeedback {
  horseId: string
  race: number
  result: 'win' | 'placed' | 'show' | 'lost'
  predictedScore: number
  actualFinish: number
  odds: string
  factors: string[] // which factors predicted correctly
}