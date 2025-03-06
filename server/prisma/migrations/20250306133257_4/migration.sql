/*
  Warnings:

  - You are about to drop the column `location_id` on the `ParcelBox` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parcel_box_id]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parcel_box_id` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ParcelBox" DROP CONSTRAINT "ParcelBox_location_id_fkey";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "parcel_box_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ParcelBox" DROP COLUMN "location_id";

-- CreateIndex
CREATE UNIQUE INDEX "Location_parcel_box_id_key" ON "Location"("parcel_box_id");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_parcel_box_id_fkey" FOREIGN KEY ("parcel_box_id") REFERENCES "ParcelBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
