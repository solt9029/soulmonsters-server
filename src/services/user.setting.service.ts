import { UserSetting } from './../graphql/index';
import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserSettingService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUserId(userId: string): Promise<UserSetting> {
    return await this.prismaService.query.userSetting({ where: { userId } });
  }

  async create(userId: string): Promise<UserSetting> {
    return await this.prismaService.mutation.createUserSetting({
      data: { userId },
    });
  }

  async updateSelectedDeck(
    userId: string,
    deckId: string,
  ): Promise<UserSetting> {
    return await this.prismaService.mutation.updateUserSetting({
      where: { userId },
      data: { selectedDeck: { connect: { id: deckId } } },
    });
  }
}
