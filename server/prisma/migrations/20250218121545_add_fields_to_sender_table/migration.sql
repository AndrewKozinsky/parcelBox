/*
  Warnings:

  - Added the required column `active` to the `Sender` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sender" ADD COLUMN     "active" BOOLEAN NOT NULL,
ADD COLUMN     "balance" INTEGER,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "passport_num" TEXT;
