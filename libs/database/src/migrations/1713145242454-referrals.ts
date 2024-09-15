import { MigrationInterface, QueryRunner } from "typeorm";

export class Referrals1713145242454 implements MigrationInterface {
    name = 'Referrals1713145242454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "referral" ("householdId" integer NOT NULL, "referredByHouseholdId" integer NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_e0c8c58c5c8b81b8d97a817b71c" PRIMARY KEY ("householdId", "referredByHouseholdId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2901747a35872e5cee7373977a" ON "referral" ("householdId") `);
        await queryRunner.query(`CREATE INDEX "IDX_eb5d98c24ba44f6c8ad4145219" ON "referral" ("referredByHouseholdId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD "referralCode" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_bf0e513b5cd8b4e937fa0702311" UNIQUE ("referralCode")`);
        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "FK_2901747a35872e5cee7373977a7" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "FK_eb5d98c24ba44f6c8ad41452190" FOREIGN KEY ("referredByHouseholdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "FK_eb5d98c24ba44f6c8ad41452190"`);
        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "FK_2901747a35872e5cee7373977a7"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_bf0e513b5cd8b4e937fa0702311"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "referralCode"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eb5d98c24ba44f6c8ad4145219"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2901747a35872e5cee7373977a"`);
        await queryRunner.query(`DROP TABLE "referral"`);
    }
}
