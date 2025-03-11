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
	async getAllCellTypes() {
		const cellTypes = await this.prisma.cellType.findMany()

		return cellTypes.map(this.mapDbCellTypeToServiceCellType)
	}

	@CatchDbError()
	async getCellTypesOfParcelBoxTypeWithName(parcelBoxTypeName: string) {
		const cellTypes = await this.prisma.cellType.findMany({
			include: {
				parcel_box_type: true,
			},
			where: {
				parcel_box_type: {
					name: parcelBoxTypeName,
				},
			},
		})

		return cellTypes.map(this.mapDbCellTypeToServiceCellType)
	}

	@CatchDbError()
	async getCellTypeById(id: number) {
		const cellType = await this.prisma.cellType.findUnique({
			where: { id },
		})

		if (!cellType) return null

		return this.mapDbCellTypeToServiceCellType(cellType)
	}

	@CatchDbError()
	async getCellTypesByParcelBoxTypeId(parcelBoxTypeId: number) {
		const cellType = await this.prisma.cellType.findMany({
			where: { parcel_box_type_id: parcelBoxTypeId },
		})

		return cellType.map(this.mapDbCellTypeToServiceCellType)
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
