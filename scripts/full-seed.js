const Database = require("better-sqlite3");
const db = new Database("prisma/dev.db");

for (const tbl of ["strategy_card_items","cards","articles","budget_strategies","article_categories","games"]) {
  try { db.prepare("DELETE FROM " + tbl).run(); } catch(e) {}
}

const gid = crypto.randomUUID();
db.prepare("INSERT INTO games VALUES (?,?,?,?,?,?,?)")
  .run(gid,"ポケモンカード","pokemon-card",null,1,new Date().toISOString(),new Date().toISOString());

const cats = [
  {id:crypto.randomUUID(),n:"ポケモンカード",s:"pokemon-card"},
  {id:crypto.randomUUID(),n:"投資戦略",s:"investment-strategy"},
  {id:crypto.randomUUID(),n:"高騰予想",s:"price-prediction"},
];
for (const c of cats) {
  db.prepare("INSERT INTO article_categories VALUES (?,?,?,?,?,?)")
    .run(c.id,c.n,c.s,null,1,new Date().toISOString());
}

const catMap = {};
for (const c of cats) catMap[c.s] = c.id;

const now = new Date().toISOString();
const cardData = [
["リザードンV（SA）",120000,"S","s8b-173","SR","VMAXクライマックス","リザードンはポケモンカードの顔。30周年に向けて再評価される可能性大。PSA10の鑑定枚数も限定的で希少性が高い。"],
["ピカチュウVMAX（HR）",45000,"A","s4-114","HR","仰天のボルテッカー","人気キャラで需要が安定。海外市場でも需要が高く、長期的に値下がりリスクが低い。"],
["ミュウV（SA）",89000,"S","s8b-169","SR","VMAXクライマックス","かわいらしいイラストと強さで男女問わず人気。未再録の可能性が高い。"],
["ルギアV（SA）",15000,"B","s11-186","SR","ロストアビス","人気伝説ポケモンだが、供給が比較的多い。長期保有向き。"],
["メイ（SR）",180000,"S","bw8-080","SR","ライデンナックル","サポートカードの中でもトップクラスの人気。女性サポートは希少で値下がりしにくい。"],
["エーフィV（SA）",35000,"A","s6a-041","SR","イーブイヒーローズ","イーブイフレンズ人気の牽引役。ブイズ全般が強い中でも上位人気。"],
["リザードンVSTAR（UR）",250000,"S","s12a-099","UR","VSTARユニバース","リザードンの最上位レアリティ。未再録の可能性が極めて高く、海外市場でも最高額を記録。"],
["ピカチュウV（SA）",68000,"A","s4a-221","SR","シャイニースターV","ブルースカイの背景が美しい。ピカチュウ人気の高まりで安定した値上がり。"],
["ミュウツーV（SA）",150000,"S","s12a-026","SR","VSTARユニバース","初代最強ポケモン。30周年に向けて懐かしさと強さで再評価必至。"],
["ブラッキーVMAX（SA）",42000,"A","s6a-076","SR","イーブイヒーローズ","クールなデザインが人気。女性ファンからも絶大な支持を受けている。"],
["ニンフィアVMAX（SA）",38000,"B","s6a-093","SR","イーブイヒーローズ","女性ファンの圧倒的人気。かわいらしさと儚さが魅力の一枚。"],
["シャイニーミュウ",220000,"S","s4a-279","SSR","シャイニースターV","限定カード。ホロ仕様が美しく、コレクションの中でもトップクラスの資産価値。"],
["リザードンex（SR）",85000,"A","sv1s-125","SR","スカーレットex","新時代のリザードン。デザイン刷新で若い層にも人気。長期的に値上がりの可能性大。"],
["ルギアVSTAR（SA）",55000,"A","s12a-139","SR","VSTARユニバース","伝説の銀色の翼。VSTARパワーと美麗なイラストで人気急上昇。"],
["コイキング（AR）",8000,"B","s11a-071","AR","白熱のアルカナ","コミカルで愛らしいデザイン。低価格帯でコレクションしやすい穴場カード。"],
["グレイシアVMAX（SA）",45000,"A","s6a-041","SR","イーブイヒーローズ","冷色調の美麗なイラスト。季節感と相まって価値が高まる可能性。"],
["リーリエ（SR）",350000,"S","sm1m-066","SR","コレクションサン","女性サポートカードの最高峰。プレミアムな一枚、状態によっては50万円超えも。"],
["ミステリーボックス",12000,"B","s3a-062","UR","伝説の鼓動","未開封BOXの希少性。未開封品は年々減少し資産価値が上昇。"],
["リザードンV（PSA10）",180000,"S","s1a-202","SR","VMAXライジング","PSA10保証付きで安心。リザードンの人気は不動、値下がりリスクが極めて低い。"],
["カイリューV（SA）",32000,"A","s11-174","SR","ロストアビス","初代最強進化系。ドラゴンタイプの中でも美麗なイラストで人気。"],
["ピカチュウVMAX（PSA10）",55000,"A","s4a-283","SSR","シャイニースターV","PSA10鑑定済み。ピカチュウは需要が最も安定している安全資産。"],
];
for (const c of cardData) {
  db.prepare("INSERT INTO cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(
    crypto.randomUUID(), c[0], null, c[1], c[2], gid, c[3], c[4], c[5], null, c[6], 1, "active", now, now);
}

const stratData = [[10000,"1万円コース","少額から始める投資の第一歩。確実に価値を保つカードを厳選しました。",1], [50000,"5万円コース","バランスの良いポートフォリオを組めます。確実性と成長性を両立させた構成です。",2], [100000,"10万円コース","プレミアムカードと未開封BOXのバランス型。30周年に向けて大きな値上がりを狙えます。",3], [150000,"15万円コース","本格的な投資を始めるならこのコース。高額カードと未開封BOXで確実な資産形成。",4]];
for (const s of stratData) {
  db.prepare("INSERT INTO budget_strategies VALUES (?,?,?,?,?,?,?,?,?,?)").run(
    crypto.randomUUID(), s[0], s[1], s[2], null, 0, gid, s[3], now, now);
}

const artData = [
  ["ポケモン30周年に向けて仕込むべきカード5選","pokemon-30th-anniversary-top5","## 2026年ポケモン30周年\n\n2026年にポケモン30周年を迎えるにあたり、市場はすでに動き始めています。今回は、今から仕込んでおくべき注目カードを5枚厳選しました。\n\n### 1. リザードンV（SA）\n\n現在価格: ¥120,000\n評価: Sランク\n\nリザードンはポケモンカードの顔であり、常に高い人気と需要を誇ります。\n\n### 2. ピカチュウVMAX（HR）\n\n現在価格: ¥45,000\n評価: Aランク\n\nポケモンの中で最も知名度の高いキャラクター。",catMap["price-prediction"]],
  ["初心者が最初に買うべきカードガイド","beginners-first-card-guide","## はじめに\n\nポケモンカード投資を始めたいけど、何を買えばいいか分からない。そんな悩みを持つ人は多いです。\n\n### ポイント1: 人気キャラクターを中心に選ぶ\n\nリザードン、ピカチュウ、ミュウなど、知名度の高いキャラクターのカードは需要が安定しています。\n\n### ポイント2: 状態（PSA10）にこだわる\n\n同じカードでも、状態の違いで価格が数倍変わります。",catMap["investment-strategy"]],
  ["PSA10の買い方・保存の裏ワザ","psa10-tips","## PSA10とは\n\nPSA（Professional Sports Authenticator）による最高グレードです。カードの状態が完璧であることを証明しています。\n\n### 保存のポイント\n\n1. 直射日光を避ける\n2. 湿度管理（40-60%が理想）\n3. スリーブ + ローダー + ケースの3重構造",catMap["pokemon-card"]],
  ["【2026年10月】今週の高騰ランキングTOP5","weekly-top5-oct-2026","# 今週の高騰ランキング\n\n今週はポケモン30周年関連のニュースが複数出たことで、関連カードが全面的に高騰しています。\n\n## 1位：リザードンVSTAR（UR） +15.2%\n\n30周年プロモーション発表による波及効果。\n\n## 2位：ミュウツーV（SA） +12.8%",catMap["price-prediction"]],
  ["PSA鑑定完全ガイド","psa-guide-home","# PSA鑑定完全ガイド\n\n## 自宅でできる状態チェック\n\nPSA10を狙うなら、購入前に以下の4箇所を必ず確認しましょう。\n\n## 1. 四隅（コーナー）\n\n10倍ルーペで四隅を確認。",catMap["investment-strategy"]],
  ["【初心者向け】5万円で作る最強ポートフォリオ","beginner-5man","# 5万円で作る最強ポートフォリオ\n\n## ポートフォリオ構成\n\n### 3万円：メインカード「ピカチュウVMAX（HR）」\n\n安定の人気カード。リスクが最も低い。",catMap["investment-strategy"]],
  ["ワンピースカード対応について","onepiece-roadmap","# ワンピースカードへの対応について\n\n## 現時点の準備状況\n\nCard Alphaのデータベース設計には、ゲーム種別の切り替え機能が組み込まれています。",catMap["pokemon-card"]],
];
for (const a of artData) {
  db.prepare("INSERT INTO articles (id, title, slug, content, category_id, featured_image, is_published, is_premium, published_at, meta_title, meta_description, view_count, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(
    crypto.randomUUID(), a[0], a[1], a[2], a[3], null, 1, 0, now, null, null, 0, now, now);
}

console.log("Seed OK! Cards:", db.prepare("SELECT count(*) c FROM cards").get().c, "Articles:", db.prepare("SELECT count(*) c FROM articles").get().c, "Strategies:", db.prepare("SELECT count(*) c FROM budget_strategies").get().c);
db.close();
