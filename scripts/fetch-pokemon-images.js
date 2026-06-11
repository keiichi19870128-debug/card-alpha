// Pokemon TCG APIでカード画像を自動取得するスクリプト
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// カード名と英語名・セット名のマッピング
const cardMapping = {
  'リザードンVMAX': { name: 'Charizard', set: 'SWSH Black Star Promos' },
  'ピカチュウV': { name: 'Pikachu', set: 'Vivid Voltage' },
  'ミュウVMAX': { name: 'Mew', set: 'Fusion Strike' },
  'カイリューV': { name: 'Dragonite', set: 'Evolution' },
  'ゲンガーVMAX': { name: 'Gengar', set: 'Fusion Strike' },
  'ルカリオV': { name: 'Lucario', set: 'SWSH Black Star Promos' },
  'ブラッキーVMAX': { name: 'Umbreon', set: 'Evolving Skies' },
  'ダークライV': { name: 'Darkrai', set: 'Astral Radiance' },
  'ピカチュウVMAX': { name: 'Pikachu', set: 'Vivid Voltage' },
  'ルギアV': { name: 'Lugia', set: 'Silver Tempest' },
  'リザードンV': { name: 'Charizard', set: 'Brilliant Stars' },
  'ミュウV': { name: 'Mew', set: 'Fusion Strike' },
  'リザードンVSTAR': { name: 'Charizard', set: 'Brilliant Stars' },
  'ミュウツーV': { name: 'Mewtwo', set: 'Pokémon GO' },
  'ニンフィアVMAX': { name: 'Sylveon', set: 'Evolving Skies' },
  'シャイニーミュウ': { name: 'Mew', set: 'Celebrations' },
  'リザードンex': { name: 'Charizard', set: 'Obsidian Flames' },
  'ルギアVSTAR': { name: 'Lugia', set: 'Silver Tempest' },
  'コイキング': { name: 'Magikarp', set: '151' },
  'グレイシアVMAX': { name: 'Glaceon', set: 'Evolving Skies' },
  'レックウザVMAX': { name: 'Rayquaza', set: 'Evolving Skies' },
  'ガラルファイヤーV': { name: 'Galarian Moltres', set: 'Chilling Reign' },
};

// 直接画像URLを指定（見つからない場合用）
const fallbackImages = {
  'リザードンVMAX': 'https://images.pokemontcg.io/swsh261/1_hires.png',
  'ピカチュウV': 'https://images.pokemontcg.io/swsh062/1_hires.png',
  'ミュウVMAX': 'https://images.pokemontcg.io/swsh084/1_hires.png',
  'カイリューV': 'https://images.pokemontcg.io/swsh154/1_hires.png',
  'ゲンガーVMAX': 'https://images.pokemontcg.io/swsh144/1_hires.png',
  'ルカリオV': 'https://images.pokemontcg.io/swsh154/1_hires.png',
  'ブラッキーVMAX': 'https://images.pokemontcg.io/swsh084/1_hires.png',
  'ダークライV': 'https://images.pokemontcg.io/swsh183/1_hires.png',
  'ピカチュウVMAX': 'https://images.pokemontcg.io/swsh062/1_hires.png',
  'ルギアV': 'https://images.pokemontcg.io/swsh184/1_hires.png',
  'リザードンV': 'https://images.pokemontcg.io/swsh260/1_hires.png',
  'ミュウV': 'https://images.pokemontcg.io/swsh223/1_hires.png',
  'リザードンVSTAR': 'https://images.pokemontcg.io/swsh262/1_hires.png',
  'ミュウツーV': 'https://images.pokemontcg.io/pgo/1_hires.png',
  'ニンフィアVMAX': 'https://images.pokemontcg.io/swsh183/1_hires.png',
  'シャイニーミュウ': 'https://images.pokemontcg.io/cel25/1_hires.png',
  'リザードンex': 'https://images.pokemontcg.io/sv3/1_hires.png',
  'ルギアVSTAR': 'https://images.pokemontcg.io/swsh184/1_hires.png',
  'コイキング': 'https://images.pokemontcg.io/sv3pt5/1_hires.png',
  'グレイシアVMAX': 'https://images.pokemontcg.io/swsh184/1_hires.png',
  'レックウザVMAX': 'https://images.pokemontcg.io/swsh147/1_hires.png',
  'メイ': 'https://images.pokemontcg.io/swsh6/160_hires.png',
  'リーリエ': 'https://images.pokemontcg.io/sm2/119_hires.png',
  'アセロラの予感': 'https://images.pokemontcg.io/swsh12/153_hires.png',
  'マリィ': 'https://images.pokemontcg.io/swsh2/169_hires.png',
  'エーフィ': 'https://images.pokemontcg.io/swsh7/76_hires.png',
  'エーフィV': 'https://images.pokemontcg.io/swsh7/76_hires.png',
  '古代の咆哮 BOX': 'https://images.pokemontcg.io/sv5/1_hires.png',
};

async function fetchCardImage(name) {
  // レアリティ部分を除去してベース名を取得
  const baseName = name.replace(/（[^）]+）/g, '').trim();
  const mapping = cardMapping[baseName];
  if (!mapping) return fallbackImages[baseName] || null;

  try {
    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${mapping.name}" set.name:"${mapping.set}"`);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const card = data.data[0];
      return card.images.large || card.images.small;
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
      const imageUrl = await fetchCardImage(card.name);
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
