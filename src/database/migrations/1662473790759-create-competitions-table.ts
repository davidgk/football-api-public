import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCompetitions1662473790759 implements MigrationInterface {
  name = 'createCompetitions1662473790759';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            CREATE TABLE IF NOT EXISTS public."COMPETITIONS" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "deleted_at" TIMESTAMP,  
                "name" character varying(40)  NOT NULL, 
                "code" character varying(2) NOT NULL, 
                "area_name" character varying(40) NOT NULL, 
                CONSTRAINT "PK_COMPETITIONS" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "competition_pkey" ON "COMPETITIONS" ("id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "public"."competition_pkey";
             DROP TABLE IF EXISTS "public"."COMPETITIONS";
    `,
    );
  }
}
