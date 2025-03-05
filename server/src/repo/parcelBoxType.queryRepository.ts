import { Injectable } from '@nestjs/common'
import { ParcelBoxType } from '@prisma/client'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { ParcelBoxTypeOutModel } from '../models/parcelBoxType/parcelBoxType.out.model'

@Injectable()
export class ParcelBoxTypeQueryRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async getParcelBoxTypeById(id: number) {
		const parcelBoxType = await this.prisma.parcelBoxType.findUnique({
			where: { id },
		})

		if (!parcelBoxType) {
			return null
		}

		return this.mapDbParcelBoxTypeToOutParcelBoxType(parcelBoxType)
	}

	mapDbParcelBoxTypeToOutParcelBoxType(parcelBoxType: ParcelBoxType): ParcelBoxTypeOutModel {
		return {
			id: parcelBoxType.id,
			name: parcelBoxType.name,
		}
	}
}
