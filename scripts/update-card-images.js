// カード名から画像URLを自動生成するスクリプト
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// カード名と画像URLのマッピング（公式ポケモンカードサイトのURLパターン）
const cardImageMap = {
  'リザードンVMAX': 'https://www.pokemon-card.com/assets/images/card_images/large/S8b/040378_P_RIZADONVMAX.jpg',
  'ピカチュウV': 'https://www.pokemon-card.com/assets/images/card_images/large/S4a/038951_P_PIKACHUUV.jpg',
  'ミュウVMAX': 'https://www.pokemon-card.com/assets/images/card_images/large/S8b/040380_P_MYUUVMAX.jpg',
  'カイリューV': 'https://www.pokemon-card.com/assets/images/card_images/large/S7D/039158_P_KAIRYUUUV.jpg',
  'ゲンガーVMAX': 'https://www.pokemon-card.com/assets/images/card_images/large/S6a/038438_P_GENGAAVMAX.jpg',
  'ルカリオV': 'https://www.pokemon-card.com/assets/images/card_images/large/S6H/038821_P_RUKARIOV.jpg',
  'ブラッキーVMAX': 'https://www.pokemon-card.com/assets/images/card_images/large/S6a/038446_P_BURAKKIUVMAX.jpg',
  'ダークライV': 'https://www.pokemon-card.com/assets/images/card_images/large/S10D/042773_P_DAKURAIV.jpg',
};

async function updateCardImages() {
  try {
    for (const [name, imageUrl] of Object.entries(cardImageMap)) {
      await prisma.card.updateMany({
        where: { name },
        data: { imageUrl: imageUrl },
      });
      console.log(`Updated ${name} with image URL`);
    }
    console.log('All card images updated successfully!');
  } catch (error) {
    console.error('Error updating card images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCardImages();
