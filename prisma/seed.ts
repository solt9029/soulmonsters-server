import { prisma } from './generated/index';

async function main() {
  const deck = await prisma.createDeck({
    name: 'deck',
    userId: 'user',
  });
  const card = await prisma.createCard({
    name: 'card',
    kind: 'MONSTER',
    type: 'CIRCLE',
    attribute: 'RED',
    attack: 1000,
    defence: 1000,
    cost: 1,
    detail: 'detail',
    picture: 'https://image.png',
  });
  await prisma.createDeckCard({
    count: 1,
    deck: {
      connect: { id: deck.id },
    },
    card: {
      connect: { id: card.id },
    },
  });
}

main().catch(err => console.error(err));
