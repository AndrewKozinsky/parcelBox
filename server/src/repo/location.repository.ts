import { Injectable } from '@nestjs/common'
import { Location } from '@prisma/client'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { LocationServiceModel } from '../models/location/location.service.model'

@Injectable()
export class LocationRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async createLocation(dto: {
		parcelBoxId: number
		address?: string
		businessDays?: number[]
		businessTimeFrom?: string
		businessTimeTo?: string
	}) {
		const location = await this.prisma.location.create({
			data: {
				parcel_box_id: dto.parcelBoxId,
				address: dto.address,
				business_days: dto.businessDays,
				business_time_from: dto.businessTimeFrom,
				business_time_to: dto.businessTimeTo,
			},
		})

		return this.mapDbLocationToServiceLocation(location)
	}

	mapDbLocationToServiceLocation(location: Location): LocationServiceModel {
		return {
			id: location.id,
			parcelBoxId: location.parcel_box_id,
			address: location.address,
			businessDays: location.business_days,
			businessTimeFrom: location.business_time_from,
			businessTimeTo: location.business_time_to,
		}
	}
}
