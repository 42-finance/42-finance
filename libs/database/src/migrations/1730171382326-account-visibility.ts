import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountVisibility1730171382326 implements MigrationInterface {
    name = 'AccountVisibility1730171382326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_group" ADD "hideFromAccountsList" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "account_group" ADD "hideFromNetWorth" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "account_group" ADD "hideFromBudget" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "account" ADD "hideFromAccountsList" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "account" ADD "hideFromNetWorth" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "account" ADD "hideFromBudget" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "hideFromBudget"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "hideFromNetWorth"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "hideFromAccountsList"`);
        await queryRunner.query(`ALTER TABLE "account_group" DROP COLUMN "hideFromBudget"`);
        await queryRunner.query(`ALTER TABLE "account_group" DROP COLUMN "hideFromNetWorth"`);
        await queryRunner.query(`ALTER TABLE "account_group" DROP COLUMN "hideFromAccountsList"`);
    }
}
