import { MigrationInterface, QueryRunner } from "typeorm";

export class RefreshToken1728960020398 implements MigrationInterface {
    name = 'RefreshToken1728960020398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" ADD "refreshToken" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "refreshToken"`);
    }

}
