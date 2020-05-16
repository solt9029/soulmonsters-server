import { DeckCardEntity } from './../entities/deck.card.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DeckCardService {
  constructor(
    @InjectRepository(DeckCardEntity)
    private readonly deckCardRepository: Repository<DeckCardEntity>,
  ) {}

  async findByDeckId(deckId: string): Promise<DeckCardEntity[]> {
    return await this.deckCardRepository.find({
      where: { deck: { id: deckId } },
      relations: ['card', 'deck'],
    });
  }

  async findByDeckIdAndCardId(
    deckId: string,
    cardId: string,
  ): Promise<DeckCardEntity | undefined> {
    return await this.deckCardRepository.findOne({
      where: { deck: { id: deckId }, card: { id: cardId } },
      relations: ['card', 'deck'],
    });
  }

  async updateCountById(id: string, count: number): Promise<DeckCardEntity> {
    await this.deckCardRepository.update({ id }, { count });
    return await this.deckCardRepository.findOne({ where: { id } });
  }

  async create(deckId: string, cardId: string): Promise<DeckCardEntity> {
    const insertResult = await this.deckCardRepository.insert({
      deck: { id: deckId },
      card: { id: cardId },
      count: 1,
    });
    return await this.deckCardRepository.findOne({
      where: { id: insertResult.identifiers[0].id },
    });
  }
}
