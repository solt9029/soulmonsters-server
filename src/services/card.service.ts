import { Card } from './../graphql/index';
import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CardService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Card[]> {
    return await this.prismaService.query.cards({});
  }
}
