-- CreateTable
CREATE TABLE "ParcelBox" (
    "id" SERIAL NOT NULL,
    "parcel_box_type_id" INTEGER NOT NULL,
    "location_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParcelBox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "business_hours_from" INTEGER NOT NULL,
    "business_hours_to" INTEGER NOT NULL,
    "business_days" INTEGER[],

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParcelBox" ADD CONSTRAINT "ParcelBox_parcel_box_type_id_fkey" FOREIGN KEY ("parcel_box_type_id") REFERENCES "ParcelBoxType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParcelBox" ADD CONSTRAINT "ParcelBox_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
