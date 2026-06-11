// TCGdex APIで日本語版カード画像を取得するスクリプト
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// カード名とTCGdex検索キーワードのマッピング
const cardSearchMap = {
  'リザードンV': 'リザードンV',
  'ピカチュウV': 'ピカチュウV',
  'ミュウV': 'ミュウV',
  'ルギアV': 'ルギアV',
  'リザードンVSTAR': 'リザードンVSTAR',
  'ミュウツーV': 'ミュウツーV',
  'ブラッキーVMAX': 'ブラッキーVMAX',
  'ニンフィアVMAX': 'ニンフィアVMAX',
  'リザードンex': 'リザードンex',
  'ルギアVSTAR': 'ルギアVSTAR',
  'コイキング': 'コイキング',
  'グレイシアVMAX': 'グレイシアVMAX',
  'レックウザVMAX': 'レックウザVMAX',
  'ガラルファイヤーV': 'ガラルファイヤーV',
  'カイリューV': 'カイリューV',
  'エーフィV': 'エーフィV',
  'メイ': 'メイ',
  'リーリエ': 'リーリエ',
  'アセロラの予感': 'アセロラの予感',
  'マリィ': 'マリィ',
  '古代の咆哮 BOX': '古代の咆哮',
};

// 特定カードの優先セットID（見つからない場合用）
const fallbackImages = {
  'リザードンV': 'https://assets.tcgdex.net/ja/S/S9/014',
  'ピカチュウV': 'https://assets.tcgdex.net/ja/S/S4/26',
  'ミュウV': 'https://assets.tcgdex.net/ja/S/S8/100',
  'ルギアV': 'https://assets.tcgdex.net/ja/S/S12/138',
  'リザードンVSTAR': 'https://assets.tcgdex.net/ja/S/S9/015',
  'ミュウツーV': 'https://assets.tcgdex.net/ja/S/S10b/75',
  'ブラッキーVMAX': 'https://assets.tcgdex.net/ja/S/S6a/88',
  'ニンフィアVMAX': 'https://assets.tcgdex.net/ja/S/S6a/74',
  'リザードンex': 'https://assets.tcgdex.net/ja/SV/SV3/125',
  'ルギアVSTAR': 'https://assets.tcgdex.net/ja/S/S12/139',
  'コイキング': 'https://assets.tcgdex.net/ja/SV/SV3a/16',
  'グレイシアVMAX': 'https://assets.tcgdex.net/ja/S/S6a/41',
  'レックウザVMAX': 'https://assets.tcgdex.net/ja/S/S7/111',
  'ガラルファイヤーV': 'https://assets.tcgdex.net/ja/S/S6H/97',
  'カイリューV': 'https://assets.tcgdex.net/ja/S/S7D/50',
  'エーフィV': 'https://assets.tcgdex.net/ja/S/S6a/76',
  'メイ': 'https://assets.tcgdex.net/ja/S/S6K/160',
  'リーリエ': 'https://assets.tcgdex.net/ja/S/SM2/119',
  'アセロラの予感': 'https://assets.tcgdex.net/ja/S/S12a/167',
  'マリィ': 'https://assets.tcgdex.net/ja/S/S2/169',
  '古代の咆哮': 'https://assets.tcgdex.net/ja/SV/SV5/1',
  'ピカチュウVMAX': 'https://assets.tcgdex.net/ja/S/S4/44',
  '古代の咆哮 BOX': 'https://assets.tcgdex.net/ja/SV/SV5/1',
  'シャイニーミュウ': 'https://assets.tcgdex.net/ja/S/S4a/284',
};

async function fetchJapaneseCardImage(name) {
  const baseName = name.replace(/（[^）]+）/g, '').trim();
  const searchKeyword = cardSearchMap[baseName];
  if (!searchKeyword) return fallbackImages[baseName] || null;

  try {
    const response = await fetch(`https://api.tcgdex.net/v2/ja/cards?name=${encodeURIComponent(searchKeyword)}`);
    const data = await response.json();
    
    if (data && data.length > 0) {
      // 最初のカードの画像URLを返す
      const card = data[0];
      if (card.image) {
        return card.image;
      }
    }
    return fallbackImages[baseName] || null;
  } catch (error) {
    console.error(`Error fetching ${name}:`, error);
    return fallbackImages[baseName] || null;
  }
}

async function updateCardImages() {
  try {
    const cards = await prisma.card.findMany();
    
    for (const card of cards) {
      const imageUrl = await fetchJapaneseCardImage(card.name);
      if (imageUrl) {
        await prisma.card.update({
          where: { id: card.id },
          data: { imageUrl: imageUrl },
        });
        console.log(`Updated ${card.name}: ${imageUrl}`);
      } else {
        console.log(`No image found for ${card.name}`);
      }
    }
    
    console.log('All card images updated!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCardImages();
