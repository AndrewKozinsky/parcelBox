-- CreateTable
CREATE TABLE "Cell" (
    "id" SERIAL NOT NULL,
    "cell_type_id" INTEGER NOT NULL,
    "parcel_box_id" INTEGER NOT NULL,
    "cell_name" TEXT NOT NULL,

    CONSTRAINT "Cell_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_cell_type_id_fkey" FOREIGN KEY ("cell_type_id") REFERENCES "CellType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_parcel_box_id_fkey" FOREIGN KEY ("parcel_box_id") REFERENCES "ParcelBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
