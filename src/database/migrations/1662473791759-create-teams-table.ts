import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTeams1662473791759 implements MigrationInterface {
  name = 'createTeams1662473791759';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE IF NOT EXISTS public."TEAMS" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "deleted_at" TIMESTAMP,  
                "name" character varying(50)  NOT NULL, 
                "tla" character varying(5) NOT NULL, 
                "short_name" character varying(30) NOT NULL, 
                "area_name" character varying(20) NOT NULL, 
                "address" character varying(200) NOT NULL,
                "id_competition" uuid NOT NULL, 
                CONSTRAINT "PK_TEAMS" PRIMARY KEY ("id"),
                CONSTRAINT "FK_COMPETITION" FOREIGN KEY (id_competition) REFERENCES public."COMPETITIONS"(id))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "team_pkey" ON "TEAMS" ("id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
             ALTER TABLE public."TEAMS" DROP CONSTRAINT IF EXISTS "FK_COMPETITION";   
             DROP INDEX IF EXISTS "public"."team_pkey";
             DROP TABLE IF EXISTS "public"."TEAMS";
    `,
    );
  }
}
