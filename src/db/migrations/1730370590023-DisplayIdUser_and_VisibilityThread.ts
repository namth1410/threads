import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class DisplayIdUserAndVisibilityThread1730370590023
  implements MigrationInterface
{
  name = 'DisplayIdUserAndVisibilityThread1730370590023';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."threads_visibility_enum" AS ENUM('public', 'private', 'followers_only')`,
    );
    await queryRunner.query(
      `ALTER TABLE "threads" ADD "visibility" "public"."threads_visibility_enum" NOT NULL DEFAULT 'public'`,
    );

    // 2. Thêm cột displayId mà không có ràng buộc NOT NULL
    await queryRunner.query(
      `ALTER TABLE "users" ADD "displayId" character varying`,
    );

    // 3. Cập nhật tất cả các hàng hiện có với giá trị UUID
    const users = await queryRunner.query(`SELECT id FROM "users"`);
    for (const user of users) {
      const displayId = uuidv4(); // Tạo UUID mới cho mỗi user
      await queryRunner.query(
        `UPDATE "users" SET "displayId" = '${displayId}' WHERE "id" = ${user.id}`,
      );
    }

    // 4. Thay đổi cột thành NOT NULL
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "displayId" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_fab8abf5c6f575391f6e6005322" UNIQUE ("displayId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_fab8abf5c6f575391f6e6005322"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "displayId"`);
    await queryRunner.query(`ALTER TABLE "threads" DROP COLUMN "visibility"`);
    await queryRunner.query(`DROP TYPE "public"."threads_visibility_enum"`);
  }
}
