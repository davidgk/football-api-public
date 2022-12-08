import { MigrationInterface, QueryRunner } from 'typeorm';

export class createMigrationsTable1662128617247 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS public.migrations
                  (
                  id integer NOT NULL DEFAULT nextval('migrations_id_seq'::regclass),
                  "timestamp" bigint NOT NULL,
                  name character varying COLLATE pg_catalog."default" NOT NULL,
                  CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id)
                  )
          `,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    // If we want to destroy migrations should be sth intentionally.
  }
}
