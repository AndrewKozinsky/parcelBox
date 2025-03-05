import { Injectable } from '@nestjs/common'
import { CellType } from '@prisma/client'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { CellTypeOutModel } from '../models/cellType/cellType.out.model'

@Injectable()
export class CellTypeQueryRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async getCellTypeById(id: number) {
		const cellType = await this.prisma.cellType.findUnique({
			where: { id },
		})

		if (!cellType) {
			return null
		}

		return this.mapDbCellTypeToOutCellType(cellType)
	}

	mapDbCellTypeToOutCellType(cellType: CellType): CellTypeOutModel {
		return {
			id: cellType.id,
			name: cellType.name,
			width: cellType.width,
			height: cellType.height,
			depth: cellType.depth,
			parcelBoxTypeId: cellType.parcel_box_type_id,
		}
	}
}
