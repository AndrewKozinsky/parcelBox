/*
  Warnings:

  - The primary key for the `Sender` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Sender` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sender" DROP CONSTRAINT "Sender_pkey",
DROP COLUMN "id";
