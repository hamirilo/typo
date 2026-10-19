// Converts a kana reading into chunks, each listing every romaji spelling
// the player may use for it (e.g. し → shi / si / ci).

export interface Chunk {
  /** The kana (or literal character) this chunk represents. */
  text: string
  /** Accepted spellings. The first one is shown as the guide. */
  candidates: string[]
  /** ん: a single "n" is also accepted when the next key is not a vowel, y, or n. */
  singleN?: boolean
}

const SINGLE: Record<string, string[]> = {
  あ: ['a'], い: ['i', 'yi'], う: ['u', 'wu', 'whu'], え: ['e'], お: ['o'],
  か: ['ka', 'ca'], き: ['ki'], く: ['ku', 'cu', 'qu'], け: ['ke'], こ: ['ko', 'co'],
  さ: ['sa'], し: ['shi', 'si', 'ci'], す: ['su'], せ: ['se', 'ce'], そ: ['so'],
  た: ['ta'], ち: ['chi', 'ti'], つ: ['tsu', 'tu'], て: ['te'], と: ['to'],
  な: ['na'], に: ['ni'], ぬ: ['nu'], ね: ['ne'], の: ['no'],
  は: ['ha'], ひ: ['hi'], ふ: ['fu', 'hu'], へ: ['he'], ほ: ['ho'],
  ま: ['ma'], み: ['mi'], む: ['mu'], め: ['me'], も: ['mo'],
  や: ['ya'], ゆ: ['yu'], よ: ['yo'],
  ら: ['ra'], り: ['ri'], る: ['ru'], れ: ['re'], ろ: ['ro'],
  わ: ['wa'], を: ['wo'],
  が: ['ga'], ぎ: ['gi'], ぐ: ['gu'], げ: ['ge'], ご: ['go'],
  ざ: ['za'], じ: ['ji', 'zi'], ず: ['zu'], ぜ: ['ze'], ぞ: ['zo'],
  だ: ['da'], ぢ: ['di'], づ: ['du'], で: ['de'], ど: ['do'],
  ば: ['ba'], び: ['bi'], ぶ: ['bu'], べ: ['be'], ぼ: ['bo'],
  ぱ: ['pa'], ぴ: ['pi'], ぷ: ['pu'], ぺ: ['pe'], ぽ: ['po'],
  ゔ: ['vu'],
  ぁ: ['la', 'xa'], ぃ: ['li', 'xi'], ぅ: ['lu', 'xu'], ぇ: ['le', 'xe'], ぉ: ['lo', 'xo'],
  ゃ: ['lya', 'xya'], ゅ: ['lyu', 'xyu'], ょ: ['lyo', 'xyo'], ゎ: ['lwa', 'xwa'],
  ー: ['-'], '、': [','], '。': ['.'], '！': ['!'], '？': ['?'], '　': [' '],
}

const SMALL_TSU = ['ltu', 'xtu', 'ltsu', 'xtsu']

const COMBO: Record<string, string[]> = {
  しゃ: ['sha', 'sya'], しゅ: ['shu', 'syu'], しょ: ['sho', 'syo'], しぇ: ['she', 'sye'],
  ちゃ: ['cha', 'tya', 'cya'], ちゅ: ['chu', 'tyu', 'cyu'], ちょ: ['cho', 'tyo', 'cyo'], ちぇ: ['che', 'tye', 'cye'],
  じゃ: ['ja', 'jya', 'zya'], じゅ: ['ju', 'jyu', 'zyu'], じょ: ['jo', 'jyo', 'zyo'], じぇ: ['je', 'jye', 'zye'],
  ぢゃ: ['dya'], ぢゅ: ['dyu'], ぢょ: ['dyo'],
  ふぁ: ['fa'], ふぃ: ['fi'], ふぇ: ['fe'], ふぉ: ['fo'],
  てぃ: ['thi'], でぃ: ['dhi'], でゅ: ['dhu'], とぅ: ['twu'], どぅ: ['dwu'],
  うぃ: ['wi'], うぇ: ['we'], ゔぁ: ['va'], ゔぃ: ['vi'], ゔぇ: ['ve'], ゔぉ: ['vo'],
}

// きゃ → kya, etc.
const Y_ROWS: Record<string, string> = { き: 'k', に: 'n', ひ: 'h', み: 'm', り: 'r', ぎ: 'g', び: 'b', ぴ: 'p' }
for (const [kana, consonant] of Object.entries(Y_ROWS)) {
  COMBO[kana + 'ゃ'] = [consonant + 'ya']
  COMBO[kana + 'ゅ'] = [consonant + 'yu']
  COMBO[kana + 'ょ'] = [consonant + 'yo']
}

const unique = (list: string[]) => [...new Set(list)]

function katakanaToHiragana(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
}

/** Parses one chunk (other than っ / ん) starting at chars[i]. */
function parseAt(chars: string[], i: number): { chunk: Chunk; length: number } {
  const pair = chars[i] + (chars[i + 1] ?? '')
  if (COMBO[pair]) {
    // Also accept typing the two kana separately, e.g. き + ゃ → kilya.
    const split = SINGLE[chars[i]].flatMap((a) => SINGLE[chars[i + 1]].map((b) => a + b))
    return { chunk: { text: pair, candidates: unique([...COMBO[pair], ...split]) }, length: 2 }
  }
  const ch = chars[i]
  return { chunk: { text: ch, candidates: SINGLE[ch] ?? [ch.toLowerCase()] }, length: 1 }
}

export function toChunks(reading: string): Chunk[] {
  const chars = [...katakanaToHiragana(reading)]
  const chunks: Chunk[] = []
  let i = 0
  while (i < chars.length) {
    const ch = chars[i]
    if (ch === 'ん') {
      chunks.push({ text: ch, candidates: ['nn', 'xn', "n'"], singleN: true })
      i++
      continue
    }
    if (ch === 'っ') {
      const nextCh = chars[i + 1]
      if (nextCh && nextCh !== 'っ' && nextCh !== 'ん') {
        // Merge っ with the following kana so "kka" and "ltuka" are both possible.
        const next = parseAt(chars, i + 1)
        const candidates: string[] = []
        for (const c of next.chunk.candidates) {
          if (/^[bcdfghjkmpqrstvwyz]/.test(c)) candidates.push(c[0] + c)
          if (c.startsWith('ch')) candidates.push('t' + c)
        }
        for (const tsu of SMALL_TSU) for (const c of next.chunk.candidates) candidates.push(tsu + c)
        chunks.push({ text: ch + next.chunk.text, candidates: unique(candidates) })
        i += 1 + next.length
        continue
      }
      chunks.push({ text: ch, candidates: SMALL_TSU })
      i++
      continue
    }
    const { chunk, length } = parseAt(chars, i)
    chunks.push(chunk)
    i += length
  }
  return chunks
}

/** One chunk per character, matched exactly (used for English). */
export function literalChunks(text: string): Chunk[] {
  return [...text].map((ch) => ({ text: ch, candidates: [ch] }))
}
