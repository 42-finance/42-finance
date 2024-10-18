import { MigrationInterface, QueryRunner } from "typeorm";

export class NullablePassword1712952431128 implements MigrationInterface {
    name = 'NullablePassword1712952431128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordHash" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordHash" SET NOT NULL`);
    }
}
