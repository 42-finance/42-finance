import { MigrationInterface, QueryRunner } from "typeorm";

export class HouseholdUserOwner1712644827761 implements MigrationInterface {
    name = 'HouseholdUserOwner1712644827761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."user_invite_permission_enum" RENAME TO "user_invite_permission_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_invite_permission_enum" AS ENUM('owner', 'admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "user_invite" ALTER COLUMN "permission" TYPE "public"."user_invite_permission_enum" USING "permission"::"text"::"public"."user_invite_permission_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_invite_permission_enum_old"`);

        await queryRunner.query(`ALTER TYPE "public"."user_household_permission_enum" RENAME TO "user_household_permission_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_household_permission_enum" AS ENUM('owner', 'admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "user_household" ALTER COLUMN "permission" TYPE "public"."user_household_permission_enum" USING "permission"::"text"::"public"."user_household_permission_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_household_permission_enum_old"`);

        await queryRunner.query(`ALTER TABLE "user_household" RENAME TO "household_user"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_invite_permission_enum_old" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "user_invite" ALTER COLUMN "permission" TYPE "public"."user_invite_permission_enum_old" USING "permission"::"text"::"public"."user_invite_permission_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."user_invite_permission_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_invite_permission_enum_old" RENAME TO "user_invite_permission_enum"`);

        await queryRunner.query(`CREATE TYPE "public"."user_household_permission_enum_old" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "user_household" ALTER COLUMN "permission" TYPE "public"."user_household_permission_enum_old" USING "permission"::"text"::"public"."user_household_permission_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."user_household_permission_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_household_permission_enum_old" RENAME TO "user_household_permission_enum"`);

        await queryRunner.query(`ALTER TABLE "household_user" RENAME TO "user_household"`)
    }
}
