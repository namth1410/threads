import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1728882320535 implements MigrationInterface {
    name = 'Init1728882320535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "threadId" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "threadId" integer, CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "threads" ("id" SERIAL NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_d8a74804c34fc3900502cd27275" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "followers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "followerId" integer, "followedId" integer, CONSTRAINT "PK_c90cfc5b18edd29bd15ba95c1a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_f682eb665c360168731f596b0e3" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_111596eb3f640a4c675ca0b6b9d" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "threads" ADD CONSTRAINT "FK_256dd2e4946d6768c5583caa072" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "followers" ADD CONSTRAINT "FK_451bb9eb792c3023a164cf14e0a" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "followers" ADD CONSTRAINT "FK_2dcfccfd508fbd43e29def8e815" FOREIGN KEY ("followedId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "followers" DROP CONSTRAINT "FK_2dcfccfd508fbd43e29def8e815"`);
        await queryRunner.query(`ALTER TABLE "followers" DROP CONSTRAINT "FK_451bb9eb792c3023a164cf14e0a"`);
        await queryRunner.query(`ALTER TABLE "threads" DROP CONSTRAINT "FK_256dd2e4946d6768c5583caa072"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_111596eb3f640a4c675ca0b6b9d"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_f682eb665c360168731f596b0e3"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "followers"`);
        await queryRunner.query(`DROP TABLE "threads"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP TABLE "comments"`);
    }

}
