import { describe, expect, it } from 'vitest'
import { Matcher } from './matcher'
import { literalChunks, toChunks } from './romaji'

function typeAll(reading: string, keys: string): Matcher {
  const m = new Matcher(toChunks(reading))
  for (const key of keys) {
    if (!m.input(key)) throw new Error(`rejected "${key}" after "${m.typed}"`)
  }
  return m
}

describe('romaji matcher', () => {
  it.each([
    ['し', 'shi'], ['し', 'si'], ['ち', 'ti'], ['つ', 'tu'], ['ふ', 'hu'],
    ['きょう', 'kyou'], ['きょう', 'kilyou'], ['しゃしん', 'syasinn'],
    ['じゃ', 'zya'], ['ちゃ', 'cha'], ['ちゃ', 'tilya'],
  ])('%s accepts %s', (reading, keys) => {
    expect(typeAll(reading, keys).done).toBe(true)
  })

  it('handles っ by doubling or small tsu', () => {
    expect(typeAll('がっこう', 'gakkou').done).toBe(true)
    expect(typeAll('がっこう', 'galtukou').done).toBe(true)
    expect(typeAll('まっちゃ', 'maccha').done).toBe(true)
    expect(typeAll('まっちゃ', 'matcha').done).toBe(true)
    expect(typeAll('まっちゃ', 'mattya').done).toBe(true)
  })

  it('allows a single n before a consonant', () => {
    expect(typeAll('かんじ', 'kanji').done).toBe(true)
    expect(typeAll('かんじ', 'kannji').done).toBe(true)
  })

  it('requires nn before a vowel, y, n, or at the end', () => {
    const before = new Matcher(toChunks('きんえん'))
    for (const k of 'kin') before.input(k)
    expect(before.input('e')).toBe(false)
    expect(typeAll('こんや', 'konnya').done).toBe(true)
    const end = typeAll('ほん', 'hon')
    expect(end.done).toBe(false)
    expect(end.input('n')).toBe(true)
    expect(end.done).toBe(true)
  })

  it('rejects wrong keys without advancing', () => {
    const m = new Matcher(toChunks('か'))
    expect(m.input('x')).toBe(false)
    expect(m.typed).toBe('')
    expect(m.input('k')).toBe(true)
  })

  it('guides with the spelling the player is using', () => {
    const m = new Matcher(toChunks('しんかんせん'))
    expect(m.remaining()).toBe('shinkansenn')
    m.input('s')
    m.input('i')
    expect(m.remaining()).toBe('nkansenn')
    expect(m.expectedKey()).toBe('n')
  })

  it('converts katakana and the long vowel mark', () => {
    expect(typeAll('コーヒー', 'ko-hi-').done).toBe(true)
  })

  it('matches English text exactly', () => {
    const m = new Matcher(literalChunks('Hi you'))
    expect(m.input('h')).toBe(false)
    for (const k of 'Hi you') expect(m.input(k)).toBe(true)
    expect(m.done).toBe(true)
  })
})

describe('Japanese prompts', () => {
  it('every reading converts to known romaji', async () => {
    const { JAPANESE } = await import('./texts')
    for (const p of JAPANESE) {
      for (const chunk of toChunks(p.reading)) {
        expect(chunk.candidates[0], `${p.reading}: ${chunk.text}`).toMatch(/^[a-z\-',.!? ]+$/)
        expect(chunk.text, `${p.reading}: unknown kana`).not.toBe(chunk.candidates[0])
      }
    }
  })
})
