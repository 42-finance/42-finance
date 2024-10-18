import { MigrationInterface, QueryRunner } from "typeorm";

export class UserHideSettings1713119539017 implements MigrationInterface {
    name = 'UserHideSettings1713119539017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "hideGettingStarted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "hideWhatsNew" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hideWhatsNew"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hideGettingStarted"`);
    }
}
