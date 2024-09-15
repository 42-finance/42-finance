import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveEmailConfirmationForgotPassword1713145242454 implements MigrationInterface {
    name = 'RemoveEmailConfirmationForgotPassword1713145242454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "email_confirmation"`);
        await queryRunner.query(`DROP TABLE "forgot_password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> { 
    }
}
