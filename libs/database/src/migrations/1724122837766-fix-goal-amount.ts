import { MigrationInterface, QueryRunner } from "typeorm";

export class FixGoalAmount1724122837766 implements MigrationInterface {
    name = 'FixGoalAmount1724122837766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."recurring_transaction_frequency_enum" RENAME TO "recurring_transaction_frequency_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."recurring_transaction_frequency_enum" AS ENUM('daily', 'weekly', 'biWeekly', 'semiMonthly', 'monthlyExactDay', 'monthlyDayOfWeek', 'monthlyLastDay', 'monthlyLastWeekday', 'quarterly', 'biMonthly', 'yearlyExactDay', 'yearlyDayOfWeek', 'fixedInverval')`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ALTER COLUMN "frequency" TYPE "public"."recurring_transaction_frequency_enum" USING "frequency"::"text"::"public"."recurring_transaction_frequency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_transaction_frequency_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."expense_frequency_enum" RENAME TO "expense_frequency_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."expense_frequency_enum" AS ENUM('daily', 'weekly', 'biWeekly', 'semiMonthly', 'monthlyExactDay', 'monthlyDayOfWeek', 'monthlyLastDay', 'monthlyLastWeekday', 'quarterly', 'biMonthly', 'yearlyExactDay', 'yearlyDayOfWeek', 'fixedInverval')`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "frequency" TYPE "public"."expense_frequency_enum" USING "frequency"::"text"::"public"."expense_frequency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."expense_frequency_enum_old"`);
        await queryRunner.query(`ALTER TABLE "goal" ALTER COLUMN "amount" TYPE double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal" ALTER COLUMN "amount" TYPE integer`);
        await queryRunner.query(`CREATE TYPE "public"."expense_frequency_enum_old" AS ENUM('biMonthly', 'biWeekly', 'daily', 'fixedInverval', 'irregular', 'monthlyDayOfWeek', 'monthlyExactDay', 'monthlyLastDay', 'monthlyLastWeekday', 'quarterly', 'semiMonthly', 'weekly', 'yearlyDayOfWeek', 'yearlyExactDay')`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "frequency" TYPE "public"."expense_frequency_enum_old" USING "frequency"::"text"::"public"."expense_frequency_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."expense_frequency_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."expense_frequency_enum_old" RENAME TO "expense_frequency_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."recurring_transaction_frequency_enum_old" AS ENUM('biMonthly', 'biWeekly', 'daily', 'fixedInverval', 'irregular', 'monthlyDayOfWeek', 'monthlyExactDay', 'monthlyLastDay', 'monthlyLastWeekday', 'quarterly', 'semiMonthly', 'weekly', 'yearlyDayOfWeek', 'yearlyExactDay')`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ALTER COLUMN "frequency" TYPE "public"."recurring_transaction_frequency_enum_old" USING "frequency"::"text"::"public"."recurring_transaction_frequency_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_transaction_frequency_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."recurring_transaction_frequency_enum_old" RENAME TO "recurring_transaction_frequency_enum"`);
    }
}
