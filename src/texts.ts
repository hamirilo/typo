export interface Prompt {
  /** What is shown (may contain kanji). */
  display: string
  /** Kana reading for Japanese; same as display for English. */
  reading: string
}

const ENGLISH_WORDS = `
the be to of and a in that have it for not on with he as you do at this but his by from they we say her
she or an will my one all would there their what so up out if about who get which go me when make can
like time no just him know take people into year your good some could them see other than then now look
only come its over think also back after use two how our work first well way even new want because any
these give day most us great small large world hand high place hold turn where much before line right
too mean old same tell boy follow came show around form three house point page letter mother answer
found study still learn plant cover food sun four between state keep eye never last let thought city
tree cross farm hard start might story saw far sea draw left late run while press close night real life
few north open seem together next white children begin got walk example ease paper group always music
those both mark often until mile river car feet care second book carry took science eat room friend
began idea fish mountain stop once base hear horse cut sure watch color face wood main enough plain girl
usual young ready above ever red list though feel talk bird soon body dog family direct pose leave song
measure door product black short numeral class wind question happen complete ship area half rock order
fire south problem piece told knew pass since top whole king space heard best hour better true during
hundred five remember step early west ground interest reach fast verb sing listen six table travel less
morning ten simple several vowel toward war lay against pattern slow center love person money serve
`.trim().split(/\s+/)

export const JAPANESE: Prompt[] = [
  { display: '今日はいい天気ですね', reading: 'きょうはいいてんきですね' },
  { display: '朝ごはんを食べましたか', reading: 'あさごはんをたべましたか' },
  { display: '駅まで歩いて十分です', reading: 'えきまであるいてじっぷんです' },
  { display: '新幹線で京都へ行く', reading: 'しんかんせんできょうとへいく' },
  { display: '抹茶のアイスが好きです', reading: 'まっちゃのあいすがすきです' },
  { display: '図書館で本を借りた', reading: 'としょかんでほんをかりた' },
  { display: '週末は映画を見に行こう', reading: 'しゅうまつはえいがをみにいこう' },
  { display: '冷たいコーヒーをください', reading: 'つめたいこーひーをください' },
  { display: '宿題はもう終わりました', reading: 'しゅくだいはもうおわりました' },
  { display: '富士山に登ってみたい', reading: 'ふじさんにのぼってみたい' },
  { display: '猫が窓の外を見ている', reading: 'ねこがまどのそとをみている' },
  { display: '明日の会議は十時からです', reading: 'あしたのかいぎはじゅうじからです' },
  { display: '一緒に写真を撮りましょう', reading: 'いっしょにしゃしんをとりましょう' },
  { display: '雨が降りそうな空だ', reading: 'あめがふりそうなそらだ' },
  { display: '電車が少し遅れています', reading: 'でんしゃがすこしおくれています' },
  { display: '日本語の勉強は楽しい', reading: 'にほんごのべんきょうはたのしい' },
  { display: '夏休みに海へ行った', reading: 'なつやすみにうみへいった' },
  { display: 'お茶を一杯いかがですか', reading: 'おちゃをいっぱいいかがですか' },
  { display: '部屋をきれいに片付けた', reading: 'へやをきれいにかたづけた' },
  { display: '桜の季節がやってきた', reading: 'さくらのきせつがやってきた' },
  { display: '駐車場はどこにありますか', reading: 'ちゅうしゃじょうはどこにありますか' },
  { display: '昨日は早く寝ました', reading: 'きのうははやくねました' },
  { display: '料理を作るのが得意です', reading: 'りょうりをつくるのがとくいです' },
  { display: '友達と公園で遊んだ', reading: 'ともだちとこうえんであそんだ' },
  { display: '新しいパソコンを買った', reading: 'あたらしいぱそこんをかった' },
  { display: '旅行の計画を立てよう', reading: 'りょこうのけいかくをたてよう' },
  { display: '牛乳を冷蔵庫に入れる', reading: 'ぎゅうにゅうをれいぞうこにいれる' },
  { display: '病院の予約を取りました', reading: 'びょういんのよやくをとりました' },
  { display: '静かな場所で休みたい', reading: 'しずかなばしょでやすみたい' },
  { display: 'チョコレートは甘すぎる', reading: 'ちょこれーとはあますぎる' },
  { display: '自転車で学校に通う', reading: 'じてんしゃでがっこうにかよう' },
  { display: '夜空に星がたくさん見える', reading: 'よぞらにほしがたくさんみえる' },
  { display: '手紙を出すのを忘れた', reading: 'てがみをだすのをわすれた' },
  { display: '音楽を聞きながら走る', reading: 'おんがくをききながらはしる' },
  { display: '紅茶にミルクを入れますか', reading: 'こうちゃにみるくをいれますか' },
  { display: '大切な約束を守る', reading: 'たいせつなやくそくをまもる' },
  { display: '北海道の冬はとても寒い', reading: 'ほっかいどうのふゆはとてもさむい' },
  { display: 'メールの返事を待っています', reading: 'めーるのへんじをまっています' },
  { display: '庭にきれいな花が咲いた', reading: 'にわにきれいなはながさいた' },
  { display: '最後までがんばろう', reading: 'さいごまでがんばろう' },
]

const pick = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)]

export type Language = 'en' | 'ja'

export function nextPrompt(lang: Language, previous?: Prompt): Prompt {
  if (lang === 'ja') {
    let p = pick(JAPANESE)
    while (p === previous) p = pick(JAPANESE)
    return p
  }
  const words = Array.from({ length: 8 }, () => pick(ENGLISH_WORDS)).join(' ')
  return { display: words, reading: words }
}
