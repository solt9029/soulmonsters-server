import { MigrationInterface, QueryRunner } from 'typeorm';

export class Cards1589634412240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`
      CREATE TABLE cards (
        name varchar(255) NOT NULL,
        kind varchar(255) NOT NULL,
        type varchar(255) NOT NULL,
        attribute varchar(255) NOT NULL,
        attack int(11) NOT NULL,
        defence int(11) NOT NULL,
        cost int(11) NOT NULL,
        id varchar(36) NOT NULL,
        detail text NOT NULL,
        picture text NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`DROP TABLE "cards"`);
  }
}
