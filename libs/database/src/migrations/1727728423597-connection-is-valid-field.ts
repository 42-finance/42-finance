import { MigrationInterface, QueryRunner } from "typeorm";

export class ConnectionIsValidField1727728423597 implements MigrationInterface {
    name = 'ConnectionIsValidField1727728423597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connection" ADD "isValid" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "isValid"`);
    }
}
