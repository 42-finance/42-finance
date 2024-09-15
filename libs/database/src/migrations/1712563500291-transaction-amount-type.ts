import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionAmountType1712563500291 implements MigrationInterface {
    name = 'TransactionAmountType1712563500291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."rule_amounttype_enum" RENAME TO "rule_amounttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."rule_amounttype_enum" AS ENUM('credit', 'debit')`);
        await queryRunner.query(`ALTER TABLE "rule" ALTER COLUMN "amountType" TYPE "public"."rule_amounttype_enum" USING "amountType"::"text"::"public"."rule_amounttype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."rule_amounttype_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."rule_amountfiltertype_enum" RENAME TO "rule_amountfiltertype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."rule_amountfiltertype_enum" AS ENUM('lessThan', 'equal', 'greaterThan', 'between')`);
        await queryRunner.query(`ALTER TABLE "rule" ALTER COLUMN "amountFilterType" TYPE "public"."rule_amountfiltertype_enum" USING "amountFilterType"::"text"::"public"."rule_amountfiltertype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."rule_amountfiltertype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."rule_amountfiltertype_enum_old" AS ENUM('allAmounts', 'lessThan', 'equal', 'greaterThan', 'between')`);
        await queryRunner.query(`ALTER TABLE "rule" ALTER COLUMN "amountFilterType" TYPE "public"."rule_amountfiltertype_enum_old" USING "amountFilterType"::"text"::"public"."rule_amountfiltertype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."rule_amountfiltertype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."rule_amountfiltertype_enum_old" RENAME TO "rule_amountfiltertype_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."rule_amounttype_enum_old" AS ENUM('income', 'expense', 'transfer')`);
        await queryRunner.query(`ALTER TABLE "rule" ALTER COLUMN "amountType" TYPE "public"."rule_amounttype_enum_old" USING "amountType"::"text"::"public"."rule_amounttype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."rule_amounttype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."rule_amounttype_enum_old" RENAME TO "rule_amounttype_enum"`);
    }
}
