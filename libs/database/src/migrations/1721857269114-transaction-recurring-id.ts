import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionRecurringId1721857269114 implements MigrationInterface {
    name = 'TransactionRecurringId1721857269114'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "recurringTransactionId" integer`);
        await queryRunner.query(`ALTER TYPE "public"."recurring_transaction_frequency_enum" RENAME TO "recurring_transaction_frequency_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."recurring_transaction_frequency_enum" AS ENUM('once', 'daily', 'weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'semiAnnual', 'annual')`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ALTER COLUMN "frequency" TYPE "public"."recurring_transaction_frequency_enum" USING "frequency"::"text"::"public"."recurring_transaction_frequency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_transaction_frequency_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."expense_frequency_enum" RENAME TO "expense_frequency_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."expense_frequency_enum" AS ENUM('once', 'daily', 'weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'semiAnnual', 'annual')`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "frequency" TYPE "public"."expense_frequency_enum" USING "frequency"::"text"::"public"."expense_frequency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."expense_frequency_enum_old"`);
        await queryRunner.query(`CREATE INDEX "IDX_cfd18ed127ef44ee2279132932" ON "transaction" ("recurringTransactionId") `);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_cfd18ed127ef44ee22791329320" FOREIGN KEY ("recurringTransactionId") REFERENCES "recurring_transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_cfd18ed127ef44ee22791329320"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfd18ed127ef44ee2279132932"`);
        await queryRunner.query(`CREATE TYPE "public"."expense_frequency_enum_old" AS ENUM('once', 'daily', 'weekly', 'biweekly', 'monthly')`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "frequency" TYPE "public"."expense_frequency_enum_old" USING "frequency"::"text"::"public"."expense_frequency_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."expense_frequency_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."expense_frequency_enum_old" RENAME TO "expense_frequency_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."recurring_transaction_frequency_enum_old" AS ENUM('once', 'daily', 'weekly', 'biweekly', 'monthly')`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ALTER COLUMN "frequency" TYPE "public"."recurring_transaction_frequency_enum_old" USING "frequency"::"text"::"public"."recurring_transaction_frequency_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_transaction_frequency_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."recurring_transaction_frequency_enum_old" RENAME TO "recurring_transaction_frequency_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "recurringTransactionId"`);
    }
}
