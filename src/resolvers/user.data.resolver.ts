import { UserDataService } from './../services/user.data.service';
import { AuthGuard } from '../guards/auth.guard';
import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { User } from 'src/decorators/user.decorator';

@Resolver()
@UseGuards(AuthGuard)
export class UserDataResolver {
  constructor(private readonly userDataService: UserDataService) {}

  @Query()
  async userData(@User() user: auth.DecodedIdToken) {
    return await this.userDataService.findByUserId(user.uid);
  }
}
