import { MigrationInterface, QueryRunner } from "typeorm";

export class NewNotificationTypes1726902108847 implements MigrationInterface {
    name = 'NewNotificationTypes1726902108847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."notification_setting_type_enum" RENAME TO "notification_setting_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_setting_type_enum" AS ENUM('accountOutOfSync', 'balanceSummary', 'budgetExceeded', 'newTransactionsSynced', 'newRecurringTransaction', 'upcomingRecurringTransaction', 'newExpense', 'newDeposit', 'goalMilestone', 'monthlyGoalUpdate', 'monthlyReview', 'yearlyReview', 'productUpdates')`);
        await queryRunner.query(`ALTER TABLE "notification_setting" ALTER COLUMN "type" TYPE "public"."notification_setting_type_enum" USING "type"::"text"::"public"."notification_setting_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_setting_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notification_setting_type_enum_old" AS ENUM('accountOutOfSync', 'newTransactionsSynced')`);
        await queryRunner.query(`ALTER TABLE "notification_setting" ALTER COLUMN "type" TYPE "public"."notification_setting_type_enum_old" USING "type"::"text"::"public"."notification_setting_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_setting_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_setting_type_enum_old" RENAME TO "notification_setting_type_enum"`);
    }
}
