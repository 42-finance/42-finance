import { MigrationInterface, QueryRunner } from "typeorm";

export class StripeCustomerId1713508203646 implements MigrationInterface {
    name = 'StripeCustomerId1713508203646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "stripeCustomerId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "stripeCustomerId"`);
    }
}
