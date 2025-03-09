import { Injectable } from '@nestjs/common'
import { ParcelBox } from '@prisma/client'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { ParcelBoxServiceModel } from '../models/parcelBox/parcelBox.service.model'
import { ParcelBoxFullDataPrisma } from './common'

@Injectable()
export class ParcelBoxRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async createParcelBox(dto: { parcelBoxTypeId: number; userId: number }) {
		const parcelBoxType = await this.prisma.parcelBox.create({
			data: {
				user_id: dto.userId,
				parcel_box_type_id: dto.parcelBoxTypeId,
			},
			include: {
				Cell: {
					include: {
						cell_type: true,
					},
				},
				Location: true,
			},
		})

		return this.mapDbParcelBoxTypeToServiceParcelBoxType(parcelBoxType)
	}

	@CatchDbError()
	async getParcelBoxesByUserEmail(email: string) {
		const parcelBoxes = await this.prisma.parcelBox.findMany({
			where: {
				user: {
					email,
				},
			},
			include: {
				Cell: {
					include: {
						cell_type: true,
					},
				},
				Location: true,
			},
		})

		return parcelBoxes.map(this.mapDbParcelBoxTypeToServiceParcelBoxType)
	}

	mapDbParcelBoxTypeToServiceParcelBoxType(parcelBox: ParcelBoxFullDataPrisma): ParcelBoxServiceModel {
		return {
			id: parcelBox.id,
			parcelBoxTypeId: parcelBox.parcel_box_type_id,
			createdAt: parcelBox.created_at,
			cells: parcelBox.Cell.map((cell) => {
				return {
					id: cell.id,
					name: cell.cell_name,
					cellTypeId: cell.cell_type_id,
					parcelBoxId: cell.parcel_box_id,
					width: cell.cell_type.width,
					height: cell.cell_type.height,
					depth: cell.cell_type.depth,
				}
			}),
			location: {
				id: parcelBox?.Location?.id ?? 0,
				address: parcelBox?.Location?.address ?? '',
				businessDays: parcelBox?.Location?.business_days ?? [],
				businessHoursFrom: parcelBox?.Location?.business_hours_from ?? 0,
				businessHoursTo: parcelBox?.Location?.business_hours_to ?? 0,
			},
		}
	}
}
