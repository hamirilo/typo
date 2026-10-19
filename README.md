# typo

A simple typing practice app for the browser. Supports Japanese (romaji input) and English.

## Features

- **Japanese / English** modes
  - Japanese accepts multiple spellings for the same kana, e.g. し = `shi` / `si` / `ci`, っ = doubled consonant / `ltu`, ん = `nn` / a single `n` before a consonant
- **Timed mode**: 15 / 30 / 60 / 120 seconds
- **WPM, KPM, and accuracy** shown live and on the results screen
- **High scores** saved per mode in the browser (localStorage)
- **Weak-key analysis**: misses from this run, plus a keyboard heatmap of miss rates across all runs

Press `Esc` to restart at any time. Turn off the Japanese IME before typing.

## Development

```sh
npm install
npm run dev      # dev server
npm test         # tests for the romaji matcher
npm run build    # production build to dist/
```

## Layout

| File | Purpose |
| --- | --- |
| `src/romaji.ts` | Splits a kana reading into chunks and lists the accepted romaji spellings |
| `src/matcher.ts` | Matches keystrokes against the chunks and builds the input guide |
| `src/texts.ts` | Prompts (English words, Japanese sentences) |
| `src/storage.ts` | Saves scores, key stats, and settings |
| `src/main.ts` | UI and game loop |
