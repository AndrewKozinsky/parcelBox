-- CreateTable
CREATE TABLE "ParcelBoxType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ParcelBoxType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CellType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "depth" INTEGER NOT NULL,
    "parcel_box_type_id" INTEGER NOT NULL,

    CONSTRAINT "CellType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CellType" ADD CONSTRAINT "CellType_parcel_box_type_id_fkey" FOREIGN KEY ("parcel_box_type_id") REFERENCES "ParcelBoxType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
