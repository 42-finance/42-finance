import { MigrationInterface, QueryRunner } from "typeorm";

export class Bills1726858192375 implements MigrationInterface {
    name = 'Bills1726858192375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bill" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "balance" double precision, "issueDate" TIMESTAMP NOT NULL, "dueDate" TIMESTAMP, "minimumPaymentAmount" double precision, "isOverdue" boolean, "accountId" character varying NOT NULL, "householdId" integer NOT NULL, CONSTRAINT "PK_683b47912b8b30fe71d1fa22199" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1f9f865e841e7879e4f2359988" ON "bill" ("accountId") `);
        await queryRunner.query(`CREATE INDEX "IDX_47caf9fba670ea12b9fd0590db" ON "bill" ("householdId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "bill_issue_date_account_id" ON "bill" ("issueDate", "accountId") `);
        await queryRunner.query(`CREATE TABLE "bill_payment" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "amount" double precision NOT NULL, "date" TIMESTAMP NOT NULL, "accountId" character varying NOT NULL, "householdId" integer NOT NULL, CONSTRAINT "PK_daac59b5f9723aed4b2108d4a5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_512645eb424baec784777f1236" ON "bill_payment" ("accountId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c5685fc560469f835811642d74" ON "bill_payment" ("householdId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "bill_payment_amount_date_account_id" ON "bill_payment" ("amount", "date", "accountId") `);
        await queryRunner.query(`ALTER TABLE "bill" ADD CONSTRAINT "FK_1f9f865e841e7879e4f2359988d" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bill" ADD CONSTRAINT "FK_47caf9fba670ea12b9fd0590db0" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bill_payment" ADD CONSTRAINT "FK_512645eb424baec784777f1236f" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bill_payment" ADD CONSTRAINT "FK_c5685fc560469f835811642d74d" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bill_payment" DROP CONSTRAINT "FK_c5685fc560469f835811642d74d"`);
        await queryRunner.query(`ALTER TABLE "bill_payment" DROP CONSTRAINT "FK_512645eb424baec784777f1236f"`);
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_47caf9fba670ea12b9fd0590db0"`);
        await queryRunner.query(`ALTER TABLE "bill" DROP CONSTRAINT "FK_1f9f865e841e7879e4f2359988d"`);
        await queryRunner.query(`DROP INDEX "public"."bill_payment_amount_date_account_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c5685fc560469f835811642d74"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_512645eb424baec784777f1236"`);
        await queryRunner.query(`DROP TABLE "bill_payment"`);
        await queryRunner.query(`DROP INDEX "public"."bill_issue_date_account_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_47caf9fba670ea12b9fd0590db"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f9f865e841e7879e4f2359988"`);
        await queryRunner.query(`DROP TABLE "bill"`);
    }
}
