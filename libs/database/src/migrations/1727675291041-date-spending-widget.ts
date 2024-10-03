import { MigrationInterface, QueryRunner } from "typeorm";

export class DateSpendingWidget1727675291041 implements MigrationInterface {
    name = 'DateSpendingWidget1727675291041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."dashboard_widget_type_enum" RENAME TO "dashboard_widget_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."dashboard_widget_type_enum" AS ENUM('news', 'community', 'gettingStarted', 'netWorth', 'dateSpending', 'reviewTransactions', 'recentTransactions', 'bills', 'budget', 'categorySpending', 'monthlySpending', 'recurringTransactions', 'goals')`);
        await queryRunner.query(`ALTER TABLE "dashboard_widget" ALTER COLUMN "type" TYPE "public"."dashboard_widget_type_enum" USING "type"::"text"::"public"."dashboard_widget_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."dashboard_widget_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dashboard_widget_type_enum_old" AS ENUM('bills', 'budget', 'categorySpending', 'community', 'gettingStarted', 'goals', 'monthlySpending', 'netWorth', 'news', 'recentTransactions', 'recurringTransactions', 'reviewTransactions')`);
        await queryRunner.query(`ALTER TABLE "dashboard_widget" ALTER COLUMN "type" TYPE "public"."dashboard_widget_type_enum_old" USING "type"::"text"::"public"."dashboard_widget_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."dashboard_widget_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."dashboard_widget_type_enum_old" RENAME TO "dashboard_widget_type_enum"`);
    }
}
