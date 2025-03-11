-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "business_hours_from" DROP NOT NULL,
ALTER COLUMN "business_hours_to" DROP NOT NULL;
