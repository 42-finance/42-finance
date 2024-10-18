import { MigrationInterface, QueryRunner } from "typeorm";

export class MapCategoryRestrict1712824394212 implements MigrationInterface {
    name = 'MapCategoryRestrict1712824394212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_96dd908d970d925138776be31b6"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_96dd908d970d925138776be31b6" FOREIGN KEY ("mapToCategoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_96dd908d970d925138776be31b6"`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_96dd908d970d925138776be31b6" FOREIGN KEY ("mapToCategoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
