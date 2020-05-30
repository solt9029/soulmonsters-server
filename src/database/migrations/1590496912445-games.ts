import { MigrationInterface, QueryRunner } from 'typeorm';

export class Games1590496912445 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
      CREATE TABLE games (
        id int(11) NOT NULL AUTO_INCREMENT,
        firstUserId varchar(255) COLLATE utf8_unicode_ci NOT NULL,
        secondUserId varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
        playingUser varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
        phase varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'DRAW',
        winningUserId varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
        status varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'WAIT',
        startedAt datetime DEFAULT NULL,
        endedAt datetime DEFAULT NULL,
        createdAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updatedAt datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`DROP TABLE games`);
  }
}
