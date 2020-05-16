import { DeckEntity } from './../entities/deck.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DeckService {
  constructor(
    @InjectRepository(DeckEntity)
    private readonly deckRepository: Repository<DeckEntity>,
  ) {}

  async findByUserId(userId: string): Promise<DeckEntity[]> {
    return await this.deckRepository.find({ where: { userId } });
  }

  async save(deckEntity: DeckEntity): Promise<DeckEntity> {
    return await this.deckRepository.save(deckEntity);
  }
}
