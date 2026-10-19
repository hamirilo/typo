import type { Chunk } from './romaji'

const NOT_AFTER_SINGLE_N = /^[aiueoyn']/

/** Tracks the player's progress through one prompt, one key at a time. */
export class Matcher {
  private index = 0
  private buffer = ''
  /** Every accepted key so far. */
  typed = ''

  constructor(readonly chunks: Chunk[]) {}

  get done(): boolean {
    return this.index >= this.chunks.length
  }

  /** Number of chunks fully typed. */
  get chunkIndex(): number {
    return this.index
  }

  /** Returns true if the key was accepted, false on a miss. */
  input(key: string): boolean {
    if (this.done) return false
    const chunk = this.chunks[this.index]
    const next = this.buffer + key
    const matches = chunk.candidates.filter((c) => c.startsWith(next))
    if (matches.length > 0) {
      this.buffer = next
      this.typed += key
      if (matches.includes(next)) this.advance()
      return true
    }
    // "n" + consonant: the single n already counts as ん.
    if (chunk.singleN && this.buffer === 'n' && !NOT_AFTER_SINGLE_N.test(key)) {
      const following = this.chunks[this.index + 1]
      if (following?.candidates.some((c) => c.startsWith(key))) {
        this.advance()
        return this.input(key)
      }
    }
    return false
  }

  /** The romaji still to type, following the player's chosen spelling so far. */
  remaining(): string {
    if (this.done) return ''
    const current = this.chunks[this.index]
    const shown = this.guideFor(this.index)
    const spelling = shown.startsWith(this.buffer)
      ? shown
      : current.candidates.find((c) => c.startsWith(this.buffer))!
    let rest = spelling.slice(this.buffer.length)
    for (let i = this.index + 1; i < this.chunks.length; i++) rest += this.guideFor(i)
    return rest
  }

  /** The key the guide expects next (used for weak-key stats). */
  expectedKey(): string | undefined {
    return this.remaining()[0]
  }

  private guideFor(i: number): string {
    const chunk = this.chunks[i]
    const following = this.chunks[i + 1]
    if (chunk.singleN && following && !NOT_AFTER_SINGLE_N.test(this.guideFor(i + 1))) return 'n'
    return chunk.candidates[0]
  }

  private advance() {
    this.index++
    this.buffer = ''
  }
}
