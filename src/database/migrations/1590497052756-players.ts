import { MigrationInterface, QueryRunner } from 'typeorm';

export class Players1590497052756 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
      CREATE TABLE players (
        id int(11) NOT NULL AUTO_INCREMENT,
        userId varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        energy int(11) DEFAULT NULL,
        lifePoint int(11) NOT NULL DEFAULT '8000',
        lastViewedAt datetime NOT NULL,
        gameId int(11) DEFAULT NULL,
        deckId int(11) DEFAULT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY IDX_7c11c744c0601ab432cfa6ff7a (userId),
        UNIQUE KEY REL_ee5da30384a20252517bdf0785 (deckId),
        KEY FK_e987db4cbe03070958e54074005 (gameId),
        CONSTRAINT FK_e987db4cbe03070958e54074005 FOREIGN KEY (gameId) REFERENCES games (id) ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT FK_ee5da30384a20252517bdf07855 FOREIGN KEY (deckId) REFERENCES decks (id) ON DELETE NO ACTION ON UPDATE NO ACTION
      ) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`DROP TABLE players`);
  }
}
