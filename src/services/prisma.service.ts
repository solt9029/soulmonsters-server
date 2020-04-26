import { Injectable } from '@nestjs/common';
import { Prisma } from '../prisma/prisma.binding';

@Injectable()
export class PrismaService extends Prisma {
  constructor() {
    super({
      endpoint: 'http://localhost:4466',
      debug: true,
    });
  }
}
