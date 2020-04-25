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
      autoSchemaFile: 'src/schema.graphql',
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [PrismaService, DeckResolver, UserService],
})
export class AppModule {}
