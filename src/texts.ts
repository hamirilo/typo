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
  { display: '毎朝コーヒーを飲みます', reading: 'まいあさこーひーをのみます' },
  { display: '駅前に新しい店ができた', reading: 'えきまえにあたらしいみせができた' },
  { display: '犬と一緒に散歩する', reading: 'いぬといっしょにさんぽする' },
  { display: '窓を開けて空気を入れ替える', reading: 'まどをあけてくうきをいれかえる' },
  { display: '来週から旅行に出かけます', reading: 'らいしゅうからりょこうにでかけます' },
  { display: 'この本はとても面白い', reading: 'このほんはとてもおもしろい' },
  { display: '電話番号を教えてください', reading: 'でんわばんごうをおしえてください' },
  { display: '夕飯はカレーにしよう', reading: 'ゆうはんはかれーにしよう' },
  { display: '机の上を片付けてください', reading: 'つくえのうえをかたづけてください' },
  { display: '春になると花粉が飛ぶ', reading: 'はるになるとかふんがとぶ' },
  { display: '傘を持って出かけよう', reading: 'かさをもってでかけよう' },
  { display: '山の上から海が見える', reading: 'やまのうえからうみがみえる' },
  { display: '誕生日おめでとうございます', reading: 'たんじょうびおめでとうございます' },
  { display: '今日は早めに帰ります', reading: 'きょうははやめにかえります' },
  { display: '新聞を読みながら朝ごはんを食べる', reading: 'しんぶんをよみながらあさごはんをたべる' },
  { display: 'お風呂が沸きました', reading: 'おふろがわきました' },
  { display: '冷たい水で顔を洗う', reading: 'つめたいみずでかおをあらう' },
  { display: '公園のベンチで本を読む', reading: 'こうえんのべんちでほんをよむ' },
  { display: '来年は海外に行きたい', reading: 'らいねんはかいがいにいきたい' },
  { display: '駅の階段で転びそうになった', reading: 'えきのかいだんでころびそうになった' },
  { display: 'この道をまっすぐ進んでください', reading: 'このみちをまっすぐすすんでください' },
  { display: '図書館では静かにしましょう', reading: 'としょかんではしずかにしましょう' },
  { display: '野菜をたくさん食べよう', reading: 'やさいをたくさんたべよう' },
  { display: '雪で電車が止まった', reading: 'ゆきででんしゃがとまった' },
  { display: '秋は紅葉がきれいです', reading: 'あきはこうようがきれいです' },
  { display: '鍵をどこに置いたか忘れた', reading: 'かぎをどこにおいたかわすれた' },
  { display: '映画館でポップコーンを買う', reading: 'えいがかんでぽっぷこーんをかう' },
  { display: '毎日少しずつ練習する', reading: 'まいにちすこしずつれんしゅうする' },
  { display: 'お昼は何を食べますか', reading: 'おひるはなにをたべますか' },
  { display: 'バスに乗って美術館へ行く', reading: 'ばすにのってびじゅつかんへいく' },
  { display: '遠くで花火の音がする', reading: 'とおくではなびのおとがする' },
  { display: '洗濯物を外に干す', reading: 'せんたくものをそとにほす' },
  { display: 'カメラの電池が切れた', reading: 'かめらのでんちがきれた' },
  { display: '週末は家でゆっくり休む', reading: 'しゅうまつはいえでゆっくりやすむ' },
  { display: '祖母に手紙を書いた', reading: 'そぼにてがみをかいた' },
  { display: '試験に合格しておめでとう', reading: 'しけんにごうかくしておめでとう' },
  { display: '川の水がとても冷たい', reading: 'かわのみずがとてもつめたい' },
  { display: '新しい靴を履いて出かける', reading: 'あたらしいくつをはいてでかける' },
  { display: '朝から雨が降っている', reading: 'あさからあめがふっている' },
  { display: '一番好きな季節は夏です', reading: 'いちばんすきなきせつはなつです' },
  { display: 'この問題は少し難しい', reading: 'このもんだいはすこしむずかしい' },
  { display: '友達の家に遊びに行く', reading: 'ともだちのいえにあそびにいく' },
  { display: '港に大きな船が着いた', reading: 'みなとにおおきなふねがついた' },
  { display: '窓の外で鳥が鳴いている', reading: 'まどのそとでとりがないている' },
  { display: 'パンを焼くいい匂いがする', reading: 'ぱんをやくいいにおいがする' },
  { display: '明日は晴れるといいな', reading: 'あしたははれるといいな' },
  { display: '夜遅くまで勉強した', reading: 'よるおそくまでべんきょうした' },
  { display: '引っ越しの準備を始めよう', reading: 'ひっこしのじゅんびをはじめよう' },
  { display: '駅で友達と待ち合わせる', reading: 'えきでともだちとまちあわせる' },
  { display: 'お土産にお菓子を買った', reading: 'おみやげにおかしをかった' },
  { display: 'スマホの充電が足りない', reading: 'すまほのじゅうでんがたりない' },
  { display: '毎週日曜日に掃除をする', reading: 'まいしゅうにちようびにそうじをする' },
  { display: '温泉に入ってのんびりしたい', reading: 'おんせんにはいってのんびりしたい' },
  { display: '信号が青になったら渡ろう', reading: 'しんごうがあおになったらわたろう' },
  { display: '新しい言葉を覚えるのは楽しい', reading: 'あたらしいことばをおぼえるのはたのしい' },
  { display: '台所で野菜を切る', reading: 'だいどころでやさいをきる' },
  { display: '月がとても明るい夜だ', reading: 'つきがとてもあかるいよるだ' },
  { display: '会議の資料を準備する', reading: 'かいぎのしりょうをじゅんびする' },
  { display: '動物園でパンダを見た', reading: 'どうぶつえんでぱんだをみた' },
  { display: '寝る前に歯を磨く', reading: 'ねるまえにはをみがく' },
  { display: '机の引き出しを開ける', reading: 'つくえのひきだしをあける' },
  { display: '風が強くて帽子が飛んだ', reading: 'かぜがつよくてぼうしがとんだ' },
  { display: '母が作るご飯はおいしい', reading: 'ははがつくるごはんはおいしい' },
  { display: 'ピアノの練習を毎日続ける', reading: 'ぴあののれんしゅうをまいにちつづける' },
  { display: '空港まで車で送ります', reading: 'くうこうまでくるまでおくります' },
  { display: '寒いので上着を着よう', reading: 'さむいのでうわぎをきよう' },
  { display: '隣の席の人に話しかけた', reading: 'となりのせきのひとにはなしかけた' },
  { display: '庭で野菜を育てている', reading: 'にわでやさいをそだてている' },
  { display: 'コンビニで飲み物を買う', reading: 'こんびにでのみものをかう' },
  { display: '地図を見ながら道を探す', reading: 'ちずをみながらみちをさがす' },
  { display: '誰かがドアをノックした', reading: 'だれかがどあをのっくした' },
  { display: '今夜は鍋料理にしよう', reading: 'こんやはなべりょうりにしよう' },
  { display: '海で泳ぐのが好きです', reading: 'うみでおよぐのがすきです' },
  { display: '部屋の電気を消してください', reading: 'へやのでんきをけしてください' },
  { display: '時計の針が十二時を指す', reading: 'とけいのはりがじゅうにじをさす' },
  { display: '来月から新しい仕事を始める', reading: 'らいげつからあたらしいしごとをはじめる' },
  { display: '森の中を静かに歩く', reading: 'もりのなかをしずかにあるく' },
  { display: '晴れた日は洗濯日和だ', reading: 'はれたひはせんたくびよりだ' },
  { display: '赤ちゃんがすやすや眠っている', reading: 'あかちゃんがすやすやねむっている' },
  { display: 'お店の前に長い列ができた', reading: 'おみせのまえにながいれつができた' },
  { display: '先生に質問をしてみよう', reading: 'せんせいにしつもんをしてみよう' },
  { display: '冷蔵庫に卵が三つある', reading: 'れいぞうこにたまごがみっつある' },
  { display: '夏祭りで金魚すくいをした', reading: 'なつまつりできんぎょすくいをした' },
  { display: 'この町には古いお寺が多い', reading: 'このまちにはふるいおてらがおおい' },
  { display: '疲れたので少し休憩しよう', reading: 'つかれたのですこしきゅうけいしよう' },
  { display: '窓から富士山が見えた', reading: 'まどからふじさんがみえた' },
  { display: 'ゆっくり深呼吸をする', reading: 'ゆっくりしんこきゅうをする' },
  { display: '電車の中で音楽を聞く', reading: 'でんしゃのなかでおんがくをきく' },
  { display: '次の駅で乗り換えます', reading: 'つぎのえきでのりかえます' },
  { display: '机の上に眼鏡を置いた', reading: 'つくえのうえにめがねをおいた' },
  { display: '冬休みにスキーに行く', reading: 'ふゆやすみにすきーにいく' },
  { display: '紙飛行機を遠くまで飛ばす', reading: 'かみひこうきをとおくまでとばす' },
  { display: '牛丼を大盛りで注文した', reading: 'ぎゅうどんをおおもりでちゅうもんした' },
  { display: '東京タワーに上ってみたい', reading: 'とうきょうたわーにのぼってみたい' },
  { display: '雨上がりに虹が出た', reading: 'あめあがりににじがでた' },
  { display: '本棚に漫画がたくさんある', reading: 'ほんだなにまんががたくさんある' },
  { display: '自分の部屋を掃除した', reading: 'じぶんのへやをそうじした' },
  { display: 'キャンプで星を眺める', reading: 'きゃんぷでほしをながめる' },
  { display: 'お茶とお菓子で一休みしよう', reading: 'おちゃとおかしでひとやすみしよう' },
  { display: '朝日がまぶしい', reading: 'あさひがまぶしい' },
  { display: '帰りに郵便局に寄る', reading: 'かえりにゆうびんきょくによる' },
  { display: 'ジュースを冷やしておく', reading: 'じゅーすをひやしておく' },
  { display: '子供たちが元気に走り回る', reading: 'こどもたちがげんきにはしりまわる' },
  { display: '美容院で髪を切った', reading: 'びよういんでかみをきった' },
  { display: '今年の目標を決めよう', reading: 'ことしのもくひょうをきめよう' },
  { display: 'キーボードで速く打てるようになりたい', reading: 'きーぼーどではやくうてるようになりたい' },
  { display: '古い写真を見て懐かしくなった', reading: 'ふるいしゃしんをみてなつかしくなった' },
  { display: '植物に水をあげる', reading: 'しょくぶつにみずをあげる' },
  { display: '雷の音にびっくりした', reading: 'かみなりのおとにびっくりした' },
  { display: 'ちょっと待ってください', reading: 'ちょっとまってください' },
  { display: 'シャツにアイロンをかける', reading: 'しゃつにあいろんをかける' },
  { display: 'チームで力を合わせよう', reading: 'ちーむでちからをあわせよう' },
]

export type Language = 'en' | 'ja'

/**
 * Hands out items in shuffled order and reshuffles only once every item has
 * been used, so nothing repeats until the whole list has come up.
 */
class Deck<T> {
  private pile: T[] = []

  constructor(private readonly items: T[]) {}

  draw(avoid?: T): T {
    if (this.pile.length === 0) {
      this.pile = shuffle([...this.items])
      // Don't start the new round with the item that ended the last one.
      if (this.pile.length > 1 && this.pile[this.pile.length - 1] === avoid) this.pile.reverse()
    }
    return this.pile.pop()!
  }
}

function shuffle<T>(list: T[]): T[] {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

const japaneseDeck = new Deck(JAPANESE)
const englishDeck = new Deck(ENGLISH_WORDS)

export function nextPrompt(lang: Language, previous?: Prompt): Prompt {
  if (lang === 'ja') return japaneseDeck.draw(previous)
  const words = Array.from({ length: 8 }, () => englishDeck.draw()).join(' ')
  return { display: words, reading: words }
}
