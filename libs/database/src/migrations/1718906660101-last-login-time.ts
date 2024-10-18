import { MigrationInterface, QueryRunner } from "typeorm";

export class LastLoginTime1718906660101 implements MigrationInterface {
    name = 'LastLoginTime1718906660101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "lastLoginTime" TIMESTAMP`);
        await queryRunner.query(`ALTER TYPE "public"."household_subscriptionoverride_enum" RENAME TO "household_subscriptionoverride_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."household_subscriptionoverride_enum" AS ENUM('connection_single', 'connection_unlimited', 'connection_unlimited_yearly')`);
        await queryRunner.query(`ALTER TABLE "household" ALTER COLUMN "subscriptionOverride" TYPE "public"."household_subscriptionoverride_enum" USING "subscriptionOverride"::"text"::"public"."household_subscriptionoverride_enum"`);
        await queryRunner.query(`DROP TYPE "public"."household_subscriptionoverride_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."household_subscriptionoverride_enum_old" AS ENUM('connection_single', 'connection_unlimited')`);
        await queryRunner.query(`ALTER TABLE "household" ALTER COLUMN "subscriptionOverride" TYPE "public"."household_subscriptionoverride_enum_old" USING "subscriptionOverride"::"text"::"public"."household_subscriptionoverride_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."household_subscriptionoverride_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."household_subscriptionoverride_enum_old" RENAME TO "household_subscriptionoverride_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastLoginTime"`);
    }
}
