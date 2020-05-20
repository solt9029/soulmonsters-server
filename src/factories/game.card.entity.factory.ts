import { CardEntity } from '../entities/card.entity';
import { DeckCardEntity } from '../entities/deck.card.entity';
import { GameCardEntity } from '../entities/game.card.entity';
import { Injectable } from '@nestjs/common';
import { Zone } from 'src/graphql';

function shuffle<T>(array: T[]): T[] {
  const oldArray = [...array];
  let newArray = new Array<T>();
  while (oldArray.length) {
    const i = Math.floor(Math.random() * oldArray.length);
    newArray = newArray.concat(oldArray.splice(i, 1));
  }
  return newArray;
}

@Injectable()
export class GameCardEntityFactory {
  private static get HAND_COUNT() {
    return 5;
  }

  create(deckCardEntities: DeckCardEntity[]): GameCardEntity[] {
    if (deckCardEntities.length <= 0) {
      return [];
    }

    const userId = deckCardEntities[0].deck.userId;

    const cardEntities: CardEntity[] = deckCardEntities.flatMap(value => {
      return new Array(value.count).fill(value.card);
    });
    const shuffledCardEntities = shuffle(cardEntities);

    return shuffledCardEntities.map((value, index) => {
      const gameCardEntity = new GameCardEntity();

      gameCardEntity.originalUserId = userId;
      gameCardEntity.currentUserId = userId;
      gameCardEntity.zone =
        index >= GameCardEntityFactory.HAND_COUNT ? Zone.DECK : Zone.HAND;
      gameCardEntity.position =
        index >= GameCardEntityFactory.HAND_COUNT
          ? index - GameCardEntityFactory.HAND_COUNT
          : index;
      gameCardEntity.name = value.name;
      gameCardEntity.kind = value.kind;
      gameCardEntity.type = value.type;
      gameCardEntity.attribute = value.attribute;
      gameCardEntity.attack = value.attack;
      gameCardEntity.defence = value.defence;
      gameCardEntity.cost = value.cost;
      gameCardEntity.detail = value.detail;
      gameCardEntity.card = value;

      return gameCardEntity;
    });
  }
}
