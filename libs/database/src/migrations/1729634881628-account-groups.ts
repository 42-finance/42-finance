import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountGroups1729634881628 implements MigrationInterface {
    name = 'AccountGroups1729634881628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."account_group_type_enum" AS ENUM('cash', 'creditCards', 'investments', 'loans', 'other', 'vehicles')`);
        await queryRunner.query(`CREATE TABLE "account_group" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" "public"."account_group_type_enum" NOT NULL, "householdId" integer NOT NULL, CONSTRAINT "PK_26903426dfff4c2d0ad461ed19b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0c52818ca288b61b0dd107fc38" ON "account_group" ("householdId") `);
        await queryRunner.query(`ALTER TABLE "account" ADD "accountGroupId" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_445a30b369fc55050c9364a93a" ON "account" ("accountGroupId") `);
        await queryRunner.query(`ALTER TABLE "account_group" ADD CONSTRAINT "FK_0c52818ca288b61b0dd107fc382" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_445a30b369fc55050c9364a93aa" FOREIGN KEY ("accountGroupId") REFERENCES "account_group"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_445a30b369fc55050c9364a93aa"`);
        await queryRunner.query(`ALTER TABLE "account_group" DROP CONSTRAINT "FK_0c52818ca288b61b0dd107fc382"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_445a30b369fc55050c9364a93a"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "accountGroupId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c52818ca288b61b0dd107fc38"`);
        await queryRunner.query(`DROP TABLE "account_group"`);
        await queryRunner.query(`DROP TYPE "public"."account_group_type_enum"`);
    }
}
