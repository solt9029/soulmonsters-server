import { DeckCardResolver } from './../resolvers/deck.card.resolver';
import { CardResolver } from './../resolvers/card.resolver';
import { UserService } from './../services/user.service';
import { DeckResolver } from './../resolvers/deck.resolver';
import { PrismaService } from './../services/prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      introspection: true,
      typePaths: ['src/graphql/schema.graphql'],
      definitions: {
        path: 'src/graphql/index.ts',
        outputAs: 'class',
      },
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    DeckResolver,
    UserService,
    CardResolver,
    DeckCardResolver,
  ],
})
export class AppModule {}
