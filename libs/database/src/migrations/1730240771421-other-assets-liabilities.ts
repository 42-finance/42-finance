import { MigrationInterface, QueryRunner } from "typeorm";

export class OtherAssetsLiabilities1730240771421 implements MigrationInterface {
    name = 'OtherAssetsLiabilities1730240771421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."account_group_type_enum" RENAME TO "account_group_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."account_group_type_enum" AS ENUM('cash', 'creditCards', 'investments', 'loans', 'otherAssets', 'otherLiabilities', 'vehicles')`);
        await queryRunner.query(`ALTER TABLE "account_group" ALTER COLUMN "type" TYPE "public"."account_group_type_enum" USING "type"::"text"::"public"."account_group_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."account_group_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."account_group_type_enum_old" AS ENUM('cash', 'creditCards', 'investments', 'loans', 'other', 'vehicles')`);
        await queryRunner.query(`ALTER TABLE "account_group" ALTER COLUMN "type" TYPE "public"."account_group_type_enum_old" USING "type"::"text"::"public"."account_group_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."account_group_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."account_group_type_enum_old" RENAME TO "account_group_type_enum"`);
    }
}
