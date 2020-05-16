import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeckCards1589634532296 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
      CREATE TABLE deckCards (
        id varchar(36) NOT NULL,
        count int(11) NOT NULL,
        cardId varchar(36) NOT NULL,
        deckId varchar(36) NOT NULL,
        PRIMARY KEY (id,cardId,deckId),
        UNIQUE KEY IDX_7cf4fca9445dfa0f5247ec78d7 (cardId,deckId),
        KEY FK_2f311ec3f91467ed53191796250 (deckId),
        CONSTRAINT FK_2f311ec3f91467ed53191796250 FOREIGN KEY (deckId) REFERENCES decks (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT FK_f6ec9673aa14e8b3e34c8572ffd FOREIGN KEY (cardId) REFERENCES cards (id) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`DROP TABLE deckCards`);
  }
}