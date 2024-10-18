import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountPropertyAddress1712864412407 implements MigrationInterface {
    name = 'AccountPropertyAddress1712864412407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "propertyAddress" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "propertyAddress"`);
    }
}
