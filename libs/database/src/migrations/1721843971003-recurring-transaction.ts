import { MigrationInterface, QueryRunner } from "typeorm";

export class RecurringTransaction1721843971003 implements MigrationInterface {
    name = 'RecurringTransaction1721843971003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."recurring_transaction_frequency_enum" AS ENUM('once', 'daily', 'weekly', 'biweekly', 'monthly')`);
        await queryRunner.query(`CREATE TYPE "public"."recurring_transaction_currencycode_enum" AS ENUM('AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'FOK', 'GBP', 'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK', 'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KID', 'KMF', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TVD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL')`);
        await queryRunner.query(`CREATE TYPE "public"."recurring_transaction_type_enum" AS ENUM('income', 'expense', 'transfer')`);
        await queryRunner.query(`CREATE TABLE "recurring_transaction" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "frequency" "public"."recurring_transaction_frequency_enum" NOT NULL, "amount" double precision NOT NULL, "currencyCode" "public"."recurring_transaction_currencycode_enum" NOT NULL, "type" "public"."recurring_transaction_type_enum" NOT NULL, "status" boolean NOT NULL, "accountId" character varying NOT NULL, "categoryId" integer NOT NULL, "merchantId" integer NOT NULL, "householdId" integer NOT NULL, CONSTRAINT "PK_6f2199a889c8e4de41bcc2ca46c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9c4a7f8db1af0576c1a3dffb2a" ON "recurring_transaction" ("accountId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9df125eeb66acd35b815debd36" ON "recurring_transaction" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3664bb4c4906c688287644191d" ON "recurring_transaction" ("merchantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c2479cafa58611ff12afb48974" ON "recurring_transaction" ("householdId") `);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ADD CONSTRAINT "FK_9c4a7f8db1af0576c1a3dffb2a9" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ADD CONSTRAINT "FK_9df125eeb66acd35b815debd369" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ADD CONSTRAINT "FK_3664bb4c4906c688287644191dd" FOREIGN KEY ("merchantId") REFERENCES "merchant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" ADD CONSTRAINT "FK_c2479cafa58611ff12afb489743" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recurring_transaction" DROP CONSTRAINT "FK_c2479cafa58611ff12afb489743"`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" DROP CONSTRAINT "FK_3664bb4c4906c688287644191dd"`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" DROP CONSTRAINT "FK_9df125eeb66acd35b815debd369"`);
        await queryRunner.query(`ALTER TABLE "recurring_transaction" DROP CONSTRAINT "FK_9c4a7f8db1af0576c1a3dffb2a9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c2479cafa58611ff12afb48974"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3664bb4c4906c688287644191d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9df125eeb66acd35b815debd36"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c4a7f8db1af0576c1a3dffb2a"`);
        await queryRunner.query(`DROP TABLE "recurring_transaction"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_transaction_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_transaction_currencycode_enum"`);
        await queryRunner.query(`DROP TYPE "public"."recurring_transaction_frequency_enum"`);
    }
}
