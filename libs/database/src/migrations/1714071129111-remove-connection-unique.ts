import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveConnectionUnique1714071129111 implements MigrationInterface {
    name = 'RemoveConnectionUnique1714071129111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connection" DROP CONSTRAINT "connection_unique_institutionId_householdId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connection" ADD CONSTRAINT "connection_unique_institutionId_householdId" UNIQUE ("institutionId", "householdId")`);
    }
}
