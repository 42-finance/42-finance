import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountUpdate1712816877194 implements MigrationInterface {
    name = 'AccountUpdate1712816877194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "finicityLastUpdate"`);
        await queryRunner.query(`CREATE TYPE "public"."connection_type_enum" AS ENUM('finicity', 'mx', 'plaid')`);
        await queryRunner.query(`ALTER TABLE "connection" ADD "type" "public"."connection_type_enum" NOT NULL DEFAULT 'plaid'`);
        await queryRunner.query(`ALTER TABLE "connection" ALTER COLUMN "accessToken" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connection" ALTER COLUMN "accessToken" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "connection" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."connection_type_enum"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "finicityLastUpdate" TIMESTAMP`);
    }
}
