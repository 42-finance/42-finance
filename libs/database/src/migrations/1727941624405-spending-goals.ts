import { MigrationInterface, QueryRunner } from "typeorm";

export class SpendingGoals1727941624405 implements MigrationInterface {
    name = 'SpendingGoals1727941624405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "goal" ADD "startDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "goal" ADD "resetOnTargetDate" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TYPE "public"."goal_type_enum" RENAME TO "goal_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."goal_type_enum" AS ENUM('debt', 'savings', 'spending')`);
        await queryRunner.query(`ALTER TABLE "goal" ALTER COLUMN "type" TYPE "public"."goal_type_enum" USING "type"::"text"::"public"."goal_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."goal_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."goal_type_enum_old" AS ENUM('debt', 'savings')`);
        await queryRunner.query(`ALTER TABLE "goal" ALTER COLUMN "type" TYPE "public"."goal_type_enum_old" USING "type"::"text"::"public"."goal_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."goal_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."goal_type_enum_old" RENAME TO "goal_type_enum"`);
        await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "resetOnTargetDate"`);
        await queryRunner.query(`ALTER TABLE "goal" DROP COLUMN "startDate"`);
    }
}
