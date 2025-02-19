/*
  Warnings:

  - Made the column `active` on table `Sender` required. This step will fail if there are existing NULL values in that column.
  - Made the column `balance` on table `Sender` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Sender" ALTER COLUMN "active" SET NOT NULL,
ALTER COLUMN "balance" SET NOT NULL;
