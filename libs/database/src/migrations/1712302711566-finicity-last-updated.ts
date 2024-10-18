import { MigrationInterface, QueryRunner } from "typeorm";

export class FinicityLastUpdated1712302711566 implements MigrationInterface {
    name = 'FinicityLastUpdated1712302711566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household" ADD "finicityLastUpdate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household" DROP COLUMN "finicityLastUpdate"`);
    }
}
