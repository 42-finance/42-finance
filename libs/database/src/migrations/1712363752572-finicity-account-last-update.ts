import { MigrationInterface, QueryRunner } from "typeorm";

export class FinicityAccountLastUpdate1712363752572 implements MigrationInterface {
    name = 'FinicityAccountLastUpdate1712363752572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "authorizedDate"`);
        await queryRunner.query(`ALTER TABLE "household" DROP COLUMN "finicityLastUpdate"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "finicityLastUpdate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "finicityLastUpdate"`);
        await queryRunner.query(`ALTER TABLE "household" ADD "finicityLastUpdate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "authorizedDate" TIMESTAMP`);
    }
}
