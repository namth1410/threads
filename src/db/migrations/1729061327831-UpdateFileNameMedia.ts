import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFileNameMedia1729061327831 implements MigrationInterface {
    name = 'UpdateFileNameMedia1729061327831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ADD "fileName" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "fileName"`);
    }

}
