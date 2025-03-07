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
		address: string
		businessDays: number[]
		businessHoursFrom: number
		businessHoursTo: number
	}) {
		const location = await this.prisma.location.create({
			data: {
				parcel_box_id: dto.parcelBoxId,
				address: dto.address,
				business_days: dto.businessDays,
				business_hours_from: dto.businessHoursFrom,
				business_hours_to: dto.businessHoursTo,
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
			businessHoursFrom: location.business_hours_from,
			businessHoursTo: location.business_hours_to,
		}
	}
}
