import { Injectable } from '@nestjs/common'
import { ParcelBox } from '@prisma/client'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { ParcelBoxServiceModel } from '../models/parcelBox/parcelBox.service.model'

@Injectable()
export class ParcelBoxRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async createParcelBox(dto: { parcelBoxTypeId: number }) {
		const parcelBoxType = await this.prisma.parcelBox.create({
			data: {
				parcel_box_type_id: dto.parcelBoxTypeId,
			},
		})

		return this.mapDbParcelBoxTypeToServiceParcelBoxType(parcelBoxType)
	}

	/*@CatchDbError()
	async getAllParcelBoxTypes() {
		const parcelBoxTypes = await this.prisma.parcelBoxType.findMany()

		return parcelBoxTypes.map(this.mapDbParcelBoxTypeToServiceParcelBoxType)
	}*/

	/*@CatchDbError()
	async getParcelBoxTypeById(id: number) {
		const parcelBoxType = await this.prisma.parcelBoxType.findUnique({
			where: { id },
		})

		if (!parcelBoxType) return null

		return this.mapDbParcelBoxTypeToServiceParcelBoxType(parcelBoxType)
	}*/

	mapDbParcelBoxTypeToServiceParcelBoxType(parcelBox: ParcelBox): ParcelBoxServiceModel {
		return {
			id: parcelBox.id,
			parcelBoxTypeId: parcelBox.parcel_box_type_id,
			createdAt: parcelBox.created_at,
		}
	}
}
