import { MigrationInterface, QueryRunner } from "typeorm";

export class MapToCategory1712345043928 implements MigrationInterface {
    name = 'MapToCategory1712345043928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "hidden"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "mapToCategoryId" integer`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_96dd908d970d925138776be31b6" FOREIGN KEY ("mapToCategoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_96dd908d970d925138776be31b6"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "mapToCategoryId"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "hidden" boolean NOT NULL DEFAULT false`);
    }
}
