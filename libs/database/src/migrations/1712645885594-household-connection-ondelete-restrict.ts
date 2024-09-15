import { MigrationInterface, QueryRunner } from "typeorm";

export class HouseholdConnectionOndeleteRestrict1712645885594 implements MigrationInterface {
    name = 'HouseholdConnectionOndeleteRestrict1712645885594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "connection" DROP CONSTRAINT "FK_1a2be58594d7d36b159ba9456cb"`);
        await queryRunner.query(`ALTER TABLE "household_user" DROP CONSTRAINT "FK_e6306ed9aa594ac55f0c96d1caa"`);
        await queryRunner.query(`ALTER TABLE "household_user" DROP CONSTRAINT "FK_e762ef4acca7677fce82976265a"`);
        await queryRunner.query(`ALTER TYPE "public"."user_household_permission_enum" RENAME TO "user_household_permission_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."household_user_permission_enum" AS ENUM('owner', 'admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "household_user" ALTER COLUMN "permission" TYPE "public"."household_user_permission_enum" USING "permission"::"text"::"public"."household_user_permission_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_household_permission_enum_old"`);
        await queryRunner.query(`ALTER TABLE "connection" ADD CONSTRAINT "FK_1a2be58594d7d36b159ba9456cb" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "household_user" ADD CONSTRAINT "FK_9f54b89c361cf17b18f0a49dc5d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "household_user" ADD CONSTRAINT "FK_bd088f3812eae5015bf47c8840b" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "household_user" DROP CONSTRAINT "FK_bd088f3812eae5015bf47c8840b"`);
        await queryRunner.query(`ALTER TABLE "household_user" DROP CONSTRAINT "FK_9f54b89c361cf17b18f0a49dc5d"`);
        await queryRunner.query(`ALTER TABLE "connection" DROP CONSTRAINT "FK_1a2be58594d7d36b159ba9456cb"`);
        await queryRunner.query(`CREATE TYPE "public"."user_household_permission_enum_old" AS ENUM('owner', 'admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "household_user" ALTER COLUMN "permission" TYPE "public"."user_household_permission_enum_old" USING "permission"::"text"::"public"."user_household_permission_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."household_user_permission_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_household_permission_enum_old" RENAME TO "user_household_permission_enum"`);
        await queryRunner.query(`ALTER TABLE "household_user" ADD CONSTRAINT "FK_e762ef4acca7677fce82976265a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "household_user" ADD CONSTRAINT "FK_e6306ed9aa594ac55f0c96d1caa" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "connection" ADD CONSTRAINT "FK_1a2be58594d7d36b159ba9456cb" FOREIGN KEY ("householdId") REFERENCES "household"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
