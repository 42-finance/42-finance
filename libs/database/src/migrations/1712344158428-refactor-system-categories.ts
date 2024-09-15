import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorSystemCategories1712344158428 implements MigrationInterface {
    name = 'RefactorSystemCategories1712344158428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "hidden"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "default"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "systemName"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "default"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "systemName" TO "systemCategory"`);
        await queryRunner.query(`CREATE TYPE "public"."category_systemcategory_enum" AS ENUM('accountTransfer', 'accountingAndFinancialPlanning', 'atmFees', 'automotive', 'beerWineAndLiquor', 'bikesAndScooters', 'bookstoresAndNewsstands', 'carPayment', 'cashAdvancesAndLoans', 'casinosAndGambling', 'childcare', 'clothingAndAccessories', 'coffee', 'consultingAndLegal', 'convenienceStores', 'creditCardPayment', 'dentalCare', 'departmentStores', 'deposit', 'discountStores', 'dividends', 'donations', 'education', 'electronics', 'eyeCare', 'fastFood', 'flights', 'foreignTransactionFees', 'furniture', 'gas', 'gasAndElectricity', 'giftsAndNovelties', 'governmentDepartmentsAndAgencies', 'groceries', 'gymsAndFitnessCenters', 'hairAndBeauty', 'hardware', 'insufficientFunds', 'insurance', 'interestCharge', 'interestEarned', 'internetAndCable', 'investmentAndRetirementFunds', 'laundryAndDryCleaning', 'lodging', 'miscellaneous', 'mortgagePayment', 'musicAndAudio', 'nursingCare', 'officeSupplies', 'onlineMarketplaces', 'otherBankFees', 'otherEntertainment', 'otherFoodAndDrink', 'otherGeneralMerchandise', 'otherGeneralServices', 'otherGovernmentAndNonProfit', 'otherHomeImprovement', 'otherIncome', 'otherMedical', 'otherPayment', 'otherPersonalCare', 'otherTransferIn', 'otherTransferOut', 'otherTransportation', 'otherTravel', 'otherUtilities', 'overdraftFees', 'parking', 'personalLoanPayment', 'petSupplies', 'pharmaciesAndSupplements', 'postageAndShipping', 'primaryCare', 'publicTransit', 'rent', 'rentalCars', 'repairAndMaintenance', 'restaurant', 'retirementPension', 'savings', 'security', 'sewageAndWasteManagement', 'sportingEventsAmusementParksAndMuseums', 'sportingGoods', 'storage', 'studentLoanPayment', 'superstores', 'taxPayment', 'taxRefund', 'taxisAndRideShares', 'telephone', 'tobaccoAndVape', 'tolls', 'tvAndMovies', 'unemployment', 'vendingMachines', 'veterinaryServices', 'videoGames', 'wages', 'water', 'withdrawal')`);
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "systemCategory" TYPE "public"."category_systemcategory_enum" USING "systemCategory"::"text"::"public"."category_systemcategory_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "systemCategory" TYPE character varying USING "systemCategory"::"text"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME COLUMN "systemCategory" TO "systemName"`);
        await queryRunner.query(`DROP TYPE "public"."category_systemcategory_enum"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "default" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "group" ADD "systemName" character varying`);
        await queryRunner.query(`ALTER TABLE "group" ADD "default" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "group" ADD "hidden" boolean NOT NULL DEFAULT false`);
    }
}
