import { Injectable } from '@nestjs/common';
import { auth } from 'firebase-admin';

@Injectable()
export class UserService {
  async findByIdToken(idToken: string): Promise<auth.DecodedIdToken> {
    return await auth().verifyIdToken(idToken);
  }
}
