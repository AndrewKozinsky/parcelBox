/*
  Warnings:

  - You are about to drop the column `business_hours_from` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `business_hours_to` on the `Location` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "business_hours_from",
DROP COLUMN "business_hours_to",
ADD COLUMN     "business_time_from" TEXT,
ADD COLUMN     "business_time_to" TEXT;
