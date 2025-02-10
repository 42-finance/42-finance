import { MigrationInterface, QueryRunner } from "typeorm";

export class RulePriority1739225378147 implements MigrationInterface {
    name = 'RulePriority1739225378147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rule" ADD "priority" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rule" DROP COLUMN "priority"`);
    }
}
