import { MigrationInterface, QueryRunner } from "typeorm";

export class FinicityUserId1712283923088 implements MigrationInterface {
    name = 'FinicityUserId1712283923088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household" ADD "finicityUserId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household" DROP COLUMN "finicityUserId"`);
    }
}
