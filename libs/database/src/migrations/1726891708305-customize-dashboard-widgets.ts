import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomizeDashboardWidgets1726891708305 implements MigrationInterface {
    name = 'CustomizeDashboardWidgets1726891708305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dashboard_widget_type_enum" AS ENUM('news', 'community', 'gettingStarted', 'netWorth', 'reviewTransactions', 'recentTransactions', 'bills', 'budget', 'categorySpending', 'monthlySpending', 'recurringTransactions', 'goals')`);
        await queryRunner.query(`CREATE TABLE "dashboard_widget" ("type" "public"."dashboard_widget_type_enum" NOT NULL, "userId" integer NOT NULL, "order" integer NOT NULL, "isSelected" boolean NOT NULL, CONSTRAINT "PK_ab12a4e0a887110853e42f218a6" PRIMARY KEY ("type", "userId"))`);
        await queryRunner.query(`ALTER TABLE "dashboard_widget" ADD CONSTRAINT "FK_03b066001ad19ccff74662d4c6d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dashboard_widget" DROP CONSTRAINT "FK_03b066001ad19ccff74662d4c6d"`);
        await queryRunner.query(`DROP TABLE "dashboard_widget"`);
        await queryRunner.query(`DROP TYPE "public"."dashboard_widget_type_enum"`);
    }
}
