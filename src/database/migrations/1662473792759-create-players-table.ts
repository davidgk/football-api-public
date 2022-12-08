import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPlayers1662473792759 implements MigrationInterface {
  name = 'createPlayers1662473792759';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            CREATE TABLE IF NOT EXISTS public."PLAYERS" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "deleted_at" TIMESTAMP,  
                "name" character varying(200), 
                "position" character varying(20), 
                "nationality" character varying(50), 
                "date_of_birth" date, 
                "is_coach" boolean DEFAULT false, 
                "id_team" uuid NOT NULL,
                CONSTRAINT "PK_PLAYERS" PRIMARY KEY ("id"),
                CONSTRAINT "FK_TEAM" FOREIGN KEY (id_team) REFERENCES public."TEAMS"(id))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "player_pkey" ON "PLAYERS" ("id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
             ALTER TABLE public."PLAYERS" DROP CONSTRAINT IF EXISTS "FK_TEAM";
             DROP INDEX IF EXISTS "public"."player_pkey";
             DROP TABLE IF EXISTS "public"."PLAYERS";
    `,
    );
  }
}
