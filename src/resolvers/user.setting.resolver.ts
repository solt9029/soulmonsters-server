import { UserSettingUpdateInput } from './../graphql/index';
import { UserSettingService } from './../services/user.setting.service';
import { AuthGuard } from './../guards/auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';

@Resolver()
@UseGuards(AuthGuard)
export class UserSettingResolver {
  constructor(private readonly userSettingService: UserSettingService) {}

  @Query()
  async userSetting(@User() user: auth.DecodedIdToken) {
    return await this.userSettingService.findByUserId(user.uid);
  }

  @Mutation()
  async createUserSetting(@User() user: auth.DecodedIdToken) {
    return await this.userSettingService.create(user.uid);
  }

  @Mutation()
  async updateUserSetting(
    @Args('data') data: UserSettingUpdateInput,
    @User() user: auth.DecodedIdToken,
  ) {
    return await this.userSettingService.updateSelectedDeck(
      user.uid,
      data.selectedDeckId,
    );
  }
}
