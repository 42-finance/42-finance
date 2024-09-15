import { MigrationInterface, QueryRunner } from "typeorm";

export class NewAccountSubTypes1712818277022 implements MigrationInterface {
    name = 'NewAccountSubTypes1712818277022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connection" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TYPE "public"."account_subtype_enum" RENAME TO "account_subtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."account_subtype_enum" AS ENUM('401a', '401k', '403B', '457b', '529', 'brokerage', 'cashIsa', 'cryptoExchange', 'educationSavingsAccount', 'ebt', 'fixedAnnuity', 'gic', 'healthReimbursementArrangement', 'hsa', 'investment', 'isa', 'ira', 'lif', 'lifeInsurance', 'lira', 'lrif', 'lrsp', 'nonCustodialWallet', 'nonTaxableBrokerageAccount', 'other', 'otherInsurance', 'otherAnnuity', 'prif', 'rdsp', 'resp', 'rlif', 'rrif', 'pension', 'profitSharingPlan', 'retirement', 'roth', 'roth401k', 'rrsp', 'sepIra', 'simpleIra', 'sipp', 'stockPlan', 'thriftSavingsPlan', 'tfsa', 'trust', 'ugma', 'utma', 'variableAnnuity', 'creditCard', 'paypal', 'cd', 'checking', 'savings', 'moneyMarket', 'prepaid', 'auto', 'business', 'commercial', 'construction', 'consumer', 'homeEquity', 'loan', 'mortgage', 'overdraft', 'lineOfCredit', 'student', 'cashManagement', 'keogh', 'mutualFund', 'recurring', 'rewards', 'safeDeposit', 'sarsep', 'payroll', 'vehicle', 'property', 'cash')`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "subType" TYPE "public"."account_subtype_enum" USING "subType"::"text"::"public"."account_subtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."account_subtype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."account_subtype_enum_old" AS ENUM('401a', '401k', '403B', '457b', '529', 'brokerage', 'cashIsa', 'cryptoExchange', 'educationSavingsAccount', 'ebt', 'fixedAnnuity', 'gic', 'healthReimbursementArrangement', 'hsa', 'isa', 'ira', 'lif', 'lifeInsurance', 'lira', 'lrif', 'lrsp', 'nonCustodialWallet', 'nonTaxableBrokerageAccount', 'other', 'otherInsurance', 'otherAnnuity', 'prif', 'rdsp', 'resp', 'rlif', 'rrif', 'pension', 'profitSharingPlan', 'retirement', 'roth', 'roth401k', 'rrsp', 'sepIra', 'simpleIra', 'sipp', 'stockPlan', 'thriftSavingsPlan', 'tfsa', 'trust', 'ugma', 'utma', 'variableAnnuity', 'creditCard', 'paypal', 'cd', 'checking', 'savings', 'moneyMarket', 'prepaid', 'auto', 'business', 'commercial', 'construction', 'consumer', 'homeEquity', 'loan', 'mortgage', 'overdraft', 'lineOfCredit', 'student', 'cashManagement', 'keogh', 'mutualFund', 'recurring', 'rewards', 'safeDeposit', 'sarsep', 'payroll', 'vehicle')`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "subType" TYPE "public"."account_subtype_enum_old" USING "subType"::"text"::"public"."account_subtype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."account_subtype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."account_subtype_enum_old" RENAME TO "account_subtype_enum"`);
        await queryRunner.query(`ALTER TABLE "connection" ALTER COLUMN "type" SET DEFAULT 'plaid'`);
    }
}
