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
    console.log('deck');
    return await this.deckCardRepository.find({
      where: { deck: { id: deckId } },
      relations: ['card', 'deck'],
    });
  }
}
