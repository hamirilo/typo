import './style.css'
import { Matcher } from './matcher'
import { literalChunks, toChunks } from './romaji'
import {
  bestFor,
  clearKeyStats,
  loadKeyStats,
  loadSettings,
  mergeKeyStats,
  saveResult,
  saveSettings,
  type KeyStats,
  type Result,
} from './storage'
import { nextPrompt, type Prompt } from './texts'

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T

const DURATIONS = [15, 30, 60, 120]
const KEY_ROWS = ['1234567890-', 'qwertyuiop', 'asdfghjkl;', "zxcvbnm,./"]

type Phase = 'ready' | 'running' | 'finished'

const settings = loadSettings()
let phase: Phase = 'ready'
let prompt: Prompt
let upcoming: Prompt
let matcher: Matcher
let startedAt = 0
let correct = 0
let miss = 0
let sessionKeys: KeyStats = {}
let timer: number | undefined

function makeMatcher(p: Prompt): Matcher {
  return new Matcher(settings.lang === 'ja' ? toChunks(p.reading) : literalChunks(p.reading))
}

function reset() {
  window.clearInterval(timer)
  phase = 'ready'
  correct = 0
  miss = 0
  sessionKeys = {}
  prompt = nextPrompt(settings.lang)
  upcoming = nextPrompt(settings.lang, prompt)
  matcher = makeMatcher(prompt)
  $('game').hidden = false
  $('result').hidden = true
  $('hint').hidden = false
  renderControls()
  renderPrompt()
  renderLive()
}

function start() {
  phase = 'running'
  startedAt = performance.now()
  $('hint').hidden = true
  timer = window.setInterval(() => {
    if (elapsedSeconds() >= settings.duration) finish()
    else renderLive()
  }, 100)
}

function elapsedSeconds(): number {
  return phase === 'ready' ? 0 : Math.min((performance.now() - startedAt) / 1000, settings.duration)
}

function stats() {
  const minutes = Math.max(elapsedSeconds(), 1) / 60
  const total = correct + miss
  return {
    wpm: Math.round(correct / 5 / minutes),
    kpm: Math.round(correct / minutes),
    accuracy: total === 0 ? 100 : Math.round((correct / total) * 1000) / 10,
  }
}

function finish() {
  window.clearInterval(timer)
  phase = 'finished'
  const s = stats()
  const result: Result = {
    lang: settings.lang,
    duration: settings.duration,
    ...s,
    correct,
    miss,
    date: new Date().toISOString(),
  }
  const previous = saveResult(result)
  mergeKeyStats(sessionKeys)
  renderResult(result, previous)
  renderKeyboard()
  renderRecords()
}

function record(key: string | undefined, hit: boolean) {
  if (!key) return
  const k = key.toLowerCase()
  const s = (sessionKeys[k] ??= { hit: 0, miss: 0 })
  if (hit) s.hit++
  else s.miss++
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    reset()
    return
  }
  if (e.ctrlKey || e.metaKey || e.altKey) return
  if (e.isComposing || e.key === 'Process') {
    showImeWarning()
    return
  }
  if (e.key.length !== 1 || phase === 'finished') return
  e.preventDefault()

  if (phase === 'ready') start()
  const key = settings.lang === 'ja' ? e.key.toLowerCase() : e.key
  const expected = matcher.expectedKey()
  if (matcher.input(key)) {
    correct++
    record(key, true)
  } else {
    miss++
    record(expected, false)
    flashMiss()
  }
  if (matcher.done) {
    prompt = upcoming
    upcoming = nextPrompt(settings.lang, prompt)
    matcher = makeMatcher(prompt)
  }
  renderPrompt()
  renderLive()
}

// ---- rendering ----

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
}

function renderControls() {
  for (const btn of $('lang').querySelectorAll('button')) {
    btn.setAttribute('aria-pressed', String(btn.dataset.value === settings.lang))
  }
  for (const btn of $('duration').querySelectorAll('button')) {
    btn.setAttribute('aria-pressed', String(Number(btn.dataset.value) === settings.duration))
  }
}

function renderPrompt() {
  const ja = settings.lang === 'ja'
  $('display').hidden = !ja
  $('reading').hidden = !ja
  if (ja) {
    $('display').textContent = prompt.display
    const doneKana = matcher.chunks.slice(0, matcher.chunkIndex).map((c) => c.text).join('')
    $('reading').innerHTML =
      `<span class="typed">${escapeHtml(doneKana)}</span>` + escapeHtml(prompt.reading.slice(doneKana.length))
  }
  const rest = matcher.remaining()
  $('romaji').innerHTML =
    `<span class="typed">${escapeHtml(matcher.typed)}</span>` +
    `<span class="cursor">${escapeHtml(rest[0] ?? '')}</span>` +
    escapeHtml(rest.slice(1))
  $('next').textContent = upcoming.display
}

function renderLive() {
  const left = Math.ceil(settings.duration - elapsedSeconds())
  $('time').textContent = String(left)
  const s = stats()
  $('live-wpm').textContent = String(phase === 'ready' ? 0 : s.wpm)
  $('live-acc').textContent = `${s.accuracy}%`
}

function renderResult(result: Result, previous: Result | undefined) {
  $('game').hidden = true
  $('result').hidden = false
  $('r-wpm').textContent = String(result.wpm)
  $('r-kpm').textContent = String(result.kpm)
  $('r-acc').textContent = `${result.accuracy}%`
  $('r-correct').textContent = String(result.correct)
  $('r-miss').textContent = String(result.miss)
  $('r-prev').textContent = previous ? `${previous.wpm} WPM` : '—'
  $('r-best').hidden = !(result.correct > 0 && (!previous || result.wpm > previous.wpm))

  const weak = Object.entries(sessionKeys)
    .filter(([, s]) => s.miss > 0)
    .sort((a, b) => b[1].miss - a[1].miss)
    .slice(0, 5)
  $('r-weak').innerHTML = weak.length
    ? weak.map(([k, s]) => `<li><kbd>${escapeHtml(keyLabel(k))}</kbd> ${s.miss}回</li>`).join('')
    : '<li class="none">ノーミス！</li>'
}

const keyLabel = (k: string) => (k === ' ' ? 'Space' : k.toUpperCase())

function renderKeyboard() {
  const all = loadKeyStats()
  const keyHtml = (k: string, cls = '') => {
    const s = all[k]
    const total = s ? s.hit + s.miss : 0
    const rate = total ? s.miss / total : 0
    const title = total ? `${keyLabel(k)}: ミス ${s.miss} / ${total} (${(rate * 100).toFixed(1)}%)` : `${keyLabel(k)}: 記録なし`
    // Scale so a 20% miss rate is already fully colored.
    const heat = Math.min(rate / 0.2, 1)
    return `<div class="key ${cls}" style="--heat:${heat}" title="${escapeHtml(title)}">${escapeHtml(keyLabel(k))}</div>`
  }
  $('keyboard').innerHTML =
    KEY_ROWS.map((row, i) => `<div class="row r${i}">${[...row].map((k) => keyHtml(k)).join('')}</div>`).join('') +
    `<div class="row">${keyHtml(' ', 'space')}</div>`
}

function renderRecords() {
  const head = `<tr><th></th>${DURATIONS.map((d) => `<th>${d}s</th>`).join('')}</tr>`
  const row = (lang: 'ja' | 'en', label: string) =>
    `<tr><th>${label}</th>${DURATIONS.map((d) => {
      const best = bestFor(lang, d)
      return `<td>${best ? `${best.wpm}<small> WPM</small>` : '—'}</td>`
    }).join('')}</tr>`
  $('records').innerHTML = head + row('ja', '日本語') + row('en', 'English')
}

let imeTimeout: number | undefined
function showImeWarning() {
  const hint = $('hint')
  hint.hidden = false
  hint.textContent = 'IME（日本語入力）をオフにして、半角英数で入力してください'
  window.clearTimeout(imeTimeout)
  imeTimeout = window.setTimeout(() => {
    hint.innerHTML = 'キーを押すとスタート ・ <kbd>Esc</kbd> でリスタート'
    hint.hidden = phase !== 'ready'
  }, 2500)
}

function flashMiss() {
  const el = $('prompt')
  el.classList.remove('miss')
  void el.offsetWidth // restart the animation
  el.classList.add('miss')
}

// ---- wiring ----

function bindSegment(id: string, apply: (value: string) => void) {
  $(id).addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('button')
    if (!btn) return
    btn.blur() // keep Space from re-clicking it
    apply(btn.dataset.value!)
    saveSettings(settings)
    reset()
  })
}

bindSegment('lang', (v) => (settings.lang = v as 'ja' | 'en'))
bindSegment('duration', (v) => (settings.duration = Number(v)))
$('retry').addEventListener('click', (e) => {
  ;(e.currentTarget as HTMLElement).blur()
  reset()
})
$('clear-keys').addEventListener('click', (e) => {
  ;(e.currentTarget as HTMLElement).blur()
  if (confirm('苦手キーの記録をリセットしますか？')) {
    clearKeyStats()
    renderKeyboard()
  }
})
document.addEventListener('keydown', onKey)

reset()
renderKeyboard()
renderRecords()
