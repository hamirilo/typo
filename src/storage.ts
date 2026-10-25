import type { Language } from './texts'

export interface Result {
  lang: Language
  duration: number
  wpm: number
  kpm: number
  accuracy: number
  correct: number
  miss: number
  date: string
}

export type KeyStats = Record<string, { hit: number; miss: number }>

const RESULTS_KEY = 'typo:results'
const KEYS_KEY = 'typo:keys'
const SETTINGS_KEY = 'typo:settings'
const MAX_RESULTS = 200

// Storage can be unavailable (private mode, blocked site data): fail quietly.
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

export function loadResults(): Result[] {
  return read<Result[]>(RESULTS_KEY, [])
}

export function bestFor(lang: Language, duration: number): Result | undefined {
  return loadResults()
    .filter((r) => r.lang === lang && r.duration === duration)
    .sort((a, b) => b.wpm - a.wpm)[0]
}

/** Saves the result and returns the previous best for the same mode. */
export function saveResult(result: Result): Result | undefined {
  const previousBest = bestFor(result.lang, result.duration)
  write(RESULTS_KEY, [result, ...loadResults()].slice(0, MAX_RESULTS))
  return previousBest
}

export function loadKeyStats(): KeyStats {
  return read<KeyStats>(KEYS_KEY, {})
}

export function mergeKeyStats(session: KeyStats) {
  const total = loadKeyStats()
  for (const [key, s] of Object.entries(session)) {
    const t = (total[key] ??= { hit: 0, miss: 0 })
    t.hit += s.hit
    t.miss += s.miss
  }
  write(KEYS_KEY, total)
}

export function clearKeyStats() {
  write(KEYS_KEY, {})
}

export interface Settings {
  lang: Language
  duration: number
  /** Japanese mode: show the romaji guide under the kana. */
  showRomaji: boolean
  showKeyboard: boolean
}

export function loadSettings(): Settings {
  return { lang: 'ja', duration: 60, showRomaji: true, showKeyboard: true, ...read<Partial<Settings>>(SETTINGS_KEY, {}) }
}

export function saveSettings(settings: Settings) {
  write(SETTINGS_KEY, settings)
}
