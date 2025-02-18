/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email_confirmation_code" TEXT,
ADD COLUMN     "email_confirmation_code_expiration_date" TEXT,
ADD COLUMN     "is_email_confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT NOT NULL;
