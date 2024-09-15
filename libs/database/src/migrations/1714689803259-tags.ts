import { MigrationInterface, QueryRunner } from "typeorm";

export class Tags1714689803259 implements MigrationInterface {
    name = 'Tags1714689803259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "color" character varying NOT NULL, "householdId" integer NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_47e13534a56d46b8edddf71312" ON "tag" ("householdId") `);
        await queryRunner.query(`CREATE TABLE "transaction_tag" ("transactionId" character varying NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_98e8433fd6e79706ce7e0e728f1" PRIMARY KEY ("transactionId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1ca03ffb21331116c797badf43" ON "transaction_tag" ("transactionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6777ee8ab46f1aedb494aae36c" ON "transaction_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "notes" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "attachments" character varying array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_47e13534a56d46b8edddf713123" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_tag" ADD CONSTRAINT "FK_1ca03ffb21331116c797badf434" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "transaction_tag" ADD CONSTRAINT "FK_6777ee8ab46f1aedb494aae36c3" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_tag" DROP CONSTRAINT "FK_6777ee8ab46f1aedb494aae36c3"`);
        await queryRunner.query(`ALTER TABLE "transaction_tag" DROP CONSTRAINT "FK_1ca03ffb21331116c797badf434"`);
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_47e13534a56d46b8edddf713123"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "attachments"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "notes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6777ee8ab46f1aedb494aae36c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1ca03ffb21331116c797badf43"`);
        await queryRunner.query(`DROP TABLE "transaction_tag"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_47e13534a56d46b8edddf71312"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }
}
