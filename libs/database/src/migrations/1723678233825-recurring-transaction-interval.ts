import { MigrationInterface, QueryRunner } from "typeorm";

export class RecurringTransactionInterval1723678233825 implements MigrationInterface {
    name = 'RecurringTransactionInterval1723678233825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recurring_transaction" DROP CONSTRAINT "FK_9df125eeb66acd35b815debd369"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_cfd18ed127ef44ee22791329320"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9df125eeb66acd35b815debd36"`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" DROP COLUMN "currencyCode"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_transaction_currencycode_enum"`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ADD "interval" integer`);
        await queryRunner.query(`ALTER TYPE "public"."recurring_transaction_frequency_enum" RENAME TO "recurring_transaction_frequency_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."recurring_transaction_frequency_enum" AS ENUM('daily', 'weekly', 'biWeekly', 'semiMonthly', 'monthlyExactDay', 'monthlyDayOfWeek', 'monthlyLastDay', 'monthlyLastWeekday', 'quarterly', 'biMonthly', 'yearlyExactDay', 'yearlyDayOfWeek', 'fixedInverval', 'irregular')`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ALTER COLUMN "frequency" TYPE "public"."recurring_transaction_frequency_enum" USING "frequency"::"text"::"public"."recurring_transaction_frequency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_transaction_frequency_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."expense_frequency_enum" RENAME TO "expense_frequency_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."expense_frequency_enum" AS ENUM('daily', 'weekly', 'biWeekly', 'semiMonthly', 'monthlyExactDay', 'monthlyDayOfWeek', 'monthlyLastDay', 'monthlyLastWeekday', 'quarterly', 'biMonthly', 'yearlyExactDay', 'yearlyDayOfWeek', 'fixedInverval', 'irregular')`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "frequency" TYPE "public"."expense_frequency_enum" USING "frequency"::"text"::"public"."expense_frequency_enum"`);
        await queryRunner.query(`DROP TYPE "public"."expense_frequency_enum_old"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_cfd18ed127ef44ee22791329320" FOREIGN KEY ("recurringTransactionId") REFERENCES "recurring_transaction"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_cfd18ed127ef44ee22791329320"`);
        await queryRunner.query(`CREATE TYPE "public"."expense_frequency_enum_old" AS ENUM('annual', 'bimonthly', 'biweekly', 'daily', 'monthly', 'once', 'quarterly', 'semiAnnual', 'weekly')`);
        await queryRunner.query(`ALTER TABLE "expense" ALTER COLUMN "frequency" TYPE "public"."expense_frequency_enum_old" USING "frequency"::"text"::"public"."expense_frequency_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."expense_frequency_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."expense_frequency_enum_old" RENAME TO "expense_frequency_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."recurring_transaction_frequency_enum_old" AS ENUM('annual', 'bimonthly', 'biweekly', 'daily', 'monthly', 'once', 'quarterly', 'semiAnnual', 'weekly')`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ALTER COLUMN "frequency" TYPE "public"."recurring_transaction_frequency_enum_old" USING "frequency"::"text"::"public"."recurring_transaction_frequency_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_transaction_frequency_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."recurring_transaction_frequency_enum_old" RENAME TO "recurring_transaction_frequency_enum"`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" DROP COLUMN "interval"`);
        await queryRunner.query(`CREATE TYPE "public"."recurring_transaction_currencycode_enum" AS ENUM('AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'FOK', 'GBP', 'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK', 'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KID', 'KMF', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TVD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL')`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ADD "currencyCode" "public"."recurring_transaction_currencycode_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ADD "categoryId" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_9df125eeb66acd35b815debd36" ON "recurring_transaction" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_cfd18ed127ef44ee22791329320" FOREIGN KEY ("recurringTransactionId") REFERENCES "recurring_transaction"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ADD CONSTRAINT "FK_9df125eeb66acd35b815debd369" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
