import { Injectable } from '@nestjs/common'
import { ParcelBoxType } from '@prisma/client'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { ParcelBoxTypeServiceModel } from '../models/parcelBoxType/parcelBoxType.service.model'

@Injectable()
export class ParcelBoxTypeRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async createParcelBoxType(dto: { name: string }) {
		const parcelBoxType = await this.prisma.parcelBoxType.create({
			data: {
				name: dto.name,
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
		})

		if (!parcelBoxType) return null

		return this.mapDbParcelBoxTypeToServiceParcelBoxType(parcelBoxType)
	}

	@CatchDbError()
	async getParcelBoxTypeById(id: number) {
		const parcelBoxType = await this.prisma.parcelBoxType.findUnique({
			where: { id },
		})

		if (!parcelBoxType) return null

		return this.mapDbParcelBoxTypeToServiceParcelBoxType(parcelBoxType)
	}

	mapDbParcelBoxTypeToServiceParcelBoxType(parcelBoxType: ParcelBoxType): ParcelBoxTypeServiceModel {
		return {
			id: parcelBoxType.id,
			name: parcelBoxType.name,
		}
	}
}
