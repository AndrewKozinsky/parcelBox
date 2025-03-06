import { Injectable } from '@nestjs/common'
import { CellType } from '@prisma/client'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { CellTypeServiceModel } from '../models/cellType/cellType.service.model'
import { CreateCellTypeInput } from '../routes/cellType/inputs/createCellType.input'

@Injectable()
export class CellTypeRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async createCellType(dto: CreateCellTypeInput) {
		const cellType = await this.prisma.cellType.create({
			data: {
				name: dto.name,
				width: dto.width,
				height: dto.height,
				depth: dto.depth,
				parcel_box_type_id: dto.parcelBoxTypeId,
			},
		})

		return this.mapDbCellTypeToServiceCellType(cellType)
	}

	@CatchDbError()
	async getCellTypeById(id: number) {
		const cellType = await this.prisma.cellType.findUnique({
			where: { id },
		})

		if (!cellType) return null

		return this.mapDbCellTypeToServiceCellType(cellType)
	}

	mapDbCellTypeToServiceCellType(cellType: CellType): CellTypeServiceModel {
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
