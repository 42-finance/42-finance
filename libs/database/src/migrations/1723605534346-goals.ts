import { MigrationInterface, QueryRunner } from "typeorm";

export class Goals1723605534346 implements MigrationInterface {
    name = 'Goals1723605534346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."goal_type_enum" AS ENUM('savings', 'debt')`);
        await queryRunner.query(`CREATE TABLE "goal" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "amount" integer NOT NULL, "type" "public"."goal_type_enum" NOT NULL, "targetDate" TIMESTAMP, "budgetAmount" integer, "householdId" integer NOT NULL, CONSTRAINT "PK_88c8e2b461b711336c836b1e130" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8319787f607dd7ffc8ba96770d" ON "goal" ("householdId") `);
        await queryRunner.query(`CREATE TABLE "goal_account" ("goalId" integer NOT NULL, "accountId" character varying NOT NULL, CONSTRAINT "PK_0979dd98984ef4d387973e23435" PRIMARY KEY ("goalId", "accountId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2298a97eeeb484fe4d9f2c2e9b" ON "goal_account" ("goalId") `);
        await queryRunner.query(`CREATE INDEX "IDX_39811391104fad6a3bd8c15ab4" ON "goal_account" ("accountId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileUpdated" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "goal" ADD CONSTRAINT "FK_8319787f607dd7ffc8ba96770d2" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "goal_account" ADD CONSTRAINT "FK_2298a97eeeb484fe4d9f2c2e9bb" FOREIGN KEY ("goalId") REFERENCES "goal"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "goal_account" ADD CONSTRAINT "FK_39811391104fad6a3bd8c15ab4d" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal_account" DROP CONSTRAINT "FK_39811391104fad6a3bd8c15ab4d"`);
        await queryRunner.query(`ALTER TABLE "goal_account" DROP CONSTRAINT "FK_2298a97eeeb484fe4d9f2c2e9bb"`);
        await queryRunner.query(`ALTER TABLE "goal" DROP CONSTRAINT "FK_8319787f607dd7ffc8ba96770d2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileUpdated"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39811391104fad6a3bd8c15ab4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2298a97eeeb484fe4d9f2c2e9b"`);
        await queryRunner.query(`DROP TABLE "goal_account"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8319787f607dd7ffc8ba96770d"`);
        await queryRunner.query(`DROP TABLE "goal"`);
        await queryRunner.query(`DROP TYPE "public"."goal_type_enum"`);
    }
}
