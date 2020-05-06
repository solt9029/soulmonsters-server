import { UserData } from '../graphql/index';
import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserDataService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByUserId(userId: string): Promise<UserData> {
    return await this.prismaService.query.userData({ where: { userId } });
  }

  async create(userId: string): Promise<UserData> {
    return await this.prismaService.mutation.createUserData({
      data: { userId },
    });
  }
}
