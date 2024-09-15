import { MigrationInterface, QueryRunner } from "typeorm";

export class QuilttUserId1713469476420 implements MigrationInterface {
    name = 'QuilttUserId1713469476420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household" ADD "quilttUserId" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household" DROP COLUMN "quilttUserId"`);
    }
}
