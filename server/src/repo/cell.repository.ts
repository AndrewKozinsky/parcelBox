import { Injectable } from '@nestjs/common'
import { Cell } from '@prisma/client'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { CellServiceModel } from '../models/cell/cell.service.model'

@Injectable()
export class CellRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async createCell(dto: { cellTypeId: number; name: string; parcelBoxId: number }) {
		const cellType = await this.prisma.cell.create({
			data: {
				cell_type_id: dto.cellTypeId,
				cell_name: dto.name,
				parcel_box_id: dto.parcelBoxId,
			},
		})

		return this.mapDbCellToServiceCell(cellType)
	}

	/*@CatchDbError()
	async getAllCellTypes() {
		const cellTypes = await this.prisma.cellType.findMany()

		return cellTypes.map(this.mapDbCellToServiceCell)
	}*/

	/*@CatchDbError()
	async getCellTypeById(id: number) {
		const cellType = await this.prisma.cellType.findUnique({
			where: { id },
		})

		if (!cellType) return null

		return this.mapDbCellToServiceCell(cellType)
	}*/

	/*@CatchDbError()
	async getCellTypesByParcelBoxTypeId(parcelBoxTypeId: number) {
		const cellType = await this.prisma.cellType.findMany({
			where: { parcel_box_type_id: parcelBoxTypeId },
		})

		return cellType.map(this.mapDbCellToServiceCell)
	}*/

	mapDbCellToServiceCell(cell: Cell): CellServiceModel {
		return {
			id: cell.id,
		}
	}
}
