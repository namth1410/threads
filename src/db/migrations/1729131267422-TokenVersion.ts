import { MigrationInterface, QueryRunner } from "typeorm";

export class TokenVersion1729131267422 implements MigrationInterface {
    name = 'TokenVersion1729131267422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "tokenVersion" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tokenVersion"`);
    }

}
