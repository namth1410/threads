import { MigrationInterface, QueryRunner } from "typeorm";

export class Minio1728980787689 implements MigrationInterface {
    name = 'Minio1728980787689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "media" ("id" SERIAL NOT NULL, "url" text NOT NULL, "type" text NOT NULL, "threadId" integer, CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "media" ADD CONSTRAINT "FK_8b6565e93811f213070f393116d" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "FK_8b6565e93811f213070f393116d"`);
        await queryRunner.query(`DROP TABLE "media"`);
    }

}
