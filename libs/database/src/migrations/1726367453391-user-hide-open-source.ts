import { MigrationInterface, QueryRunner } from "typeorm";

export class UserHideOpenSource1726367453391 implements MigrationInterface {
    name = 'UserHideOpenSource1726367453391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "hideOpenSource" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hideOpenSource"`);
    }
}
