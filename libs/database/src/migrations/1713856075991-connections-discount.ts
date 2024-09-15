import { MigrationInterface, QueryRunner } from "typeorm";

export class ConnectionsDiscount1713856075991 implements MigrationInterface {
    name = 'ConnectionsDiscount1713856075991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household" ADD "connectionsDiscount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household" DROP COLUMN "connectionsDiscount"`);
    }
}
