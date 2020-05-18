import { GameResolver } from './../resolvers/game.resolver';
import { GameService } from './../services/game.service';
import { PlayerEntity } from './../entities/player.entity';
import { GameEntity } from './../entities/game.entity';
import { DeckCardResolver } from './../resolvers/deck.card.resolver';
import { DeckCardService } from './../services/deck.card.service';
import { DeckCardEntity } from './../entities/deck.card.entity';
import { CardEntity } from './../entities/card.entity';
import { CardResolver } from './../resolvers/card.resolver';
import { CardService } from './../services/card.service';
import { DeckResolver } from './../resolvers/deck.resolver';
import { DeckService } from './../services/deck.service';
import { DeckEntity } from './../entities/deck.entity';
import { UserService } from './../services/user.service';
import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

const {
  DB_TYPE,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_SYNCHRONIZE,
} = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: DB_TYPE,
      host: DB_HOST,
      port: parseInt(DB_PORT),
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      entities: [
        DeckEntity,
        CardEntity,
        DeckCardEntity,
        GameEntity,
        PlayerEntity,
      ],
      synchronize: DB_SYNCHRONIZE?.toLowerCase() === 'true',
    }),
    TypeOrmModule.forFeature([
      DeckEntity,
      CardEntity,
      DeckCardEntity,
      GameEntity,
      PlayerEntity,
    ]),
    GraphQLModule.forRoot({
      playground: true,
      introspection: true,
      typePaths: ['src/graphql/schema/*.graphql'],
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
    UserService,
    DeckService,
    DeckResolver,
    CardService,
    CardResolver,
    DeckCardService,
    DeckCardResolver,
    GameService,
    GameResolver,
  ],
})
export class AppModule {}
