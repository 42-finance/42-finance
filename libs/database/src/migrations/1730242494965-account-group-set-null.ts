import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountGroupSetNull1730242494965 implements MigrationInterface {
    name = 'AccountGroupSetNull1730242494965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_445a30b369fc55050c9364a93aa"`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_445a30b369fc55050c9364a93aa" FOREIGN KEY ("accountGroupId") REFERENCES "account_group"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_445a30b369fc55050c9364a93aa"`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_445a30b369fc55050c9364a93aa" FOREIGN KEY ("accountGroupId") REFERENCES "account_group"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }
}
