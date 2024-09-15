import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRotessa1712532931900 implements MigrationInterface {
    name = 'RemoveRotessa1712532931900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "rotessaClientId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "rotessaClientVerified"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "rotessaVerificationUrl"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "rotessaVerificationUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "rotessaClientVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "rotessaClientId" bigint`);
    }
}
