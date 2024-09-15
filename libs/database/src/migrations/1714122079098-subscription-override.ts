import { MigrationInterface, QueryRunner } from "typeorm";

export class SubscriptionOverride1714122079098 implements MigrationInterface {
    name = 'SubscriptionOverride1714122079098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household" DROP COLUMN "connectionsDiscount"`);
        await queryRunner.query(`CREATE TYPE "public"."household_subscriptionoverride_enum" AS ENUM('connection_single', 'connection_unlimited')`);
        await queryRunner.query(`ALTER TABLE "household" ADD "subscriptionOverride" "public"."household_subscriptionoverride_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household" DROP COLUMN "subscriptionOverride"`);
        await queryRunner.query(`DROP TYPE "public"."household_subscriptionoverride_enum"`);
        await queryRunner.query(`ALTER TABLE "household" ADD "connectionsDiscount" integer NOT NULL DEFAULT '0'`);
    }
}
