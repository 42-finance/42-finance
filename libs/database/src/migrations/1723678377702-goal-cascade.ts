import { MigrationInterface, QueryRunner } from "typeorm";

export class GoalCascade1723678377702 implements MigrationInterface {
    name = 'GoalCascade1723678377702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal_account" DROP CONSTRAINT "FK_39811391104fad6a3bd8c15ab4d"`);
        await queryRunner.query(`ALTER TABLE "goal_account" ADD CONSTRAINT "FK_39811391104fad6a3bd8c15ab4d" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal_account" DROP CONSTRAINT "FK_39811391104fad6a3bd8c15ab4d"`);
        await queryRunner.query(`ALTER TABLE "goal_account" ADD CONSTRAINT "FK_39811391104fad6a3bd8c15ab4d" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
