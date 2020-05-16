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
      ) ENGINE=InnoDB`);

    queryRunner.query(`
      INSERT INTO cards VALUES (
        "天気の神　ルテルテ改",
        "MONSTER",
        "CIRCLE",
        "BLUE",
        600,
        500,
        2,
        "1",
        "◼1ターンに1度●エナジー1デッキからカードを1枚ドローする。",
        "https://lh3.googleusercontent.com/k23uZNlje2ER4DxaHKr_HSnd0slrRQHXk8BfhO2umxfzHUm0WiHZdXI71momtKrl9BkSIAjElb0HehDdzv98uCQxAUCJ84iyB5zTpuINGzL7-bpo-jvj1z3iiJ4pP-VQkC8o5PXBQlhFhSaCpMfHxLBzIJyTvBYz76BwsKvtRgFXqkHYMy901rK7E_xkLsF1_fXq0Cy51fVUZvIT9grXLQz3r1y_Ma9CigYPJWlt63gWTfM_yZSlqxXwflSMV9_r98EpZjtqwN-2hnYnWI29sOl62VjQiw__08vWxHz3Cj-5Tr5ioZbRxcyRcPZfRtC_l9OoCBiR2QrzRBJbQy7ieF7hcinSBk53vrXTLfPf-B1fSd7KzKl71O9k-9xcilNhzcc4xniIiHal5M8gl-nqV3EP7ytxfEMsFw03eyjd9O3RSVne0JBeb2oEyONqz0EPmrcau17hxz-piPpFozs8gw2mLOHvaG7CUuC1WWQqnp68vCTi5PRjYQWyIEIwZTuVhuQXMXuzuLpK9L76t-OwA4k5nUyubtrXRzzL1Zg0HVD3Z6fjw4c03DZ5wHlIG0CMN-lhCaJbe_8BB0rm9NQW1WjMpORz_xJfPtB-WPWAYt8uyheJ62ISEoNwUEed85KFys06j5K0lewrLXKyJyriRkSabyMnhRw9BoMScamRNhJVzMVB35NHF5hxsX9HUC1T4rImFTuzfHHM1YuttSe8fW-f5i7hYqcHOHvssBv39c_StQ0I6qJ3EZI=w500-h715-no"
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    queryRunner.query(`DROP TABLE "cards"`);
  }
}
