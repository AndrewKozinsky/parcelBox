/*
  Warnings:

  - You are about to drop the column `expiration_date` on the `DeviceToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DeviceToken" DROP COLUMN "expiration_date";
