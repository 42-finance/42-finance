import { MigrationInterface, QueryRunner } from "typeorm";

export class HouseholdMxUserId1712218796828 implements MigrationInterface {
    name = 'HouseholdMxUserId1712218796828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household" ADD "mxUserId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household" DROP COLUMN "mxUserId"`);
    }
}
