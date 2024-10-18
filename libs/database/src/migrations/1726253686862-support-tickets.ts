import { MigrationInterface, QueryRunner } from "typeorm";

export class SupportTickets1726253686862 implements MigrationInterface {
    name = 'SupportTickets1726253686862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "support_ticket_comment" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "content" character varying NOT NULL, "supportTicketId" integer NOT NULL, CONSTRAINT "PK_7a73ef93d9dad948d911adaf62e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b77588d7470f60829446969601" ON "support_ticket_comment" ("supportTicketId") `);
        await queryRunner.query(`CREATE TABLE "support_ticket" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "title" character varying NOT NULL, "householdId" integer NOT NULL, CONSTRAINT "PK_506b4b9f579fb3adbaebe3950c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a0bc283ab82d2ff826b69b66a7" ON "support_ticket" ("householdId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD "hideCommunity" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TYPE "public"."household_subscriptionoverride_enum" RENAME TO "household_subscriptionoverride_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."household_subscriptionoverride_enum" AS ENUM('connection_unlimited', 'connection_unlimited_yearly')`);
        await queryRunner.query(`ALTER TABLE "household" ALTER COLUMN "subscriptionOverride" TYPE "public"."household_subscriptionoverride_enum" USING "subscriptionOverride"::"text"::"public"."household_subscriptionoverride_enum"`);
        await queryRunner.query(`DROP TYPE "public"."household_subscriptionoverride_enum_old"`);
        await queryRunner.query(`ALTER TABLE "support_ticket_comment" ADD CONSTRAINT "FK_b77588d7470f608294469696017" FOREIGN KEY ("supportTicketId") REFERENCES "support_ticket"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support_ticket" ADD CONSTRAINT "FK_a0bc283ab82d2ff826b69b66a7d" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "support_ticket" DROP CONSTRAINT "FK_a0bc283ab82d2ff826b69b66a7d"`);
        await queryRunner.query(`ALTER TABLE "support_ticket_comment" DROP CONSTRAINT "FK_b77588d7470f608294469696017"`);
        await queryRunner.query(`CREATE TYPE "public"."household_subscriptionoverride_enum_old" AS ENUM('connection_single', 'connection_unlimited', 'connection_unlimited_yearly')`);
        await queryRunner.query(`ALTER TABLE "household" ALTER COLUMN "subscriptionOverride" TYPE "public"."household_subscriptionoverride_enum_old" USING "subscriptionOverride"::"text"::"public"."household_subscriptionoverride_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."household_subscriptionoverride_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."household_subscriptionoverride_enum_old" RENAME TO "household_subscriptionoverride_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hideCommunity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0bc283ab82d2ff826b69b66a7"`);
        await queryRunner.query(`DROP TABLE "support_ticket"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b77588d7470f60829446969601"`);
        await queryRunner.query(`DROP TABLE "support_ticket_comment"`);
    }
}
