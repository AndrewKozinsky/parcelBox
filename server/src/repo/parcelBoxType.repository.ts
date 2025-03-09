import { Injectable } from '@nestjs/common'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { ParcelBoxTypeServiceModel } from '../models/parcelBoxType/parcelBoxType.service.model'
import { ParcelBoxTypeFullDataPrisma } from './common'

@Injectable()
export class ParcelBoxTypeRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async createParcelBoxType(dto: { name: string }) {
		const parcelBoxType = await this.prisma.parcelBoxType.create({
			data: {
				name: dto.name,
			},
			include: {
				CellType: true,
			},
		})

		return this.mapDbParcelBoxTypeToServiceParcelBoxType(parcelBoxType)
	}

	@CatchDbError()
	async getAllParcelBoxTypes() {
		const parcelBoxTypes = await this.prisma.parcelBoxType.findMany()

		return parcelBoxTypes.map(this.mapDbParcelBoxTypeToServiceParcelBoxType)
	}

	@CatchDbError()
	async getParcelBoxTypeByName(parcelBoxTypeName: string) {
		const parcelBoxType = await this.prisma.parcelBoxType.findFirst({
			where: { name: parcelBoxTypeName },
			include: {
				CellType: true,
			},
		})

		if (!parcelBoxType) return null

		return this.mapDbParcelBoxTypeToServiceParcelBoxType(parcelBoxType)
	}

	@CatchDbError()
	async getParcelBoxTypeById(id: number) {
		const parcelBoxType = await this.prisma.parcelBoxType.findUnique({
			where: { id },
			include: {
				CellType: true,
			},
		})

		if (!parcelBoxType) return null

		return this.mapDbParcelBoxTypeToServiceParcelBoxType(parcelBoxType)
	}

	mapDbParcelBoxTypeToServiceParcelBoxType(parcelBoxType: ParcelBoxTypeFullDataPrisma): ParcelBoxTypeServiceModel {
		return {
			id: parcelBoxType.id,
			name: parcelBoxType.name,
			cellTypes: parcelBoxType.CellType.map((cell) => {
				return {
					id: cell.id,
					name: cell.name,
					width: cell.width,
					height: cell.height,
					depth: cell.depth,
					parcelBoxTypeId: parcelBoxType.id,
				}
			}),
		}
	}
}
