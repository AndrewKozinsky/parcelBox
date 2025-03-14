import { Injectable } from '@nestjs/common'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { ParcelBoxOutModel } from '../models/parcelBox/parcelBox.out.model'
import { ParcelBoxFullDataPrisma } from './common'

@Injectable()
export class ParcelBoxQueryRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async getParcelBoxById(id: number) {
		const parcelBox = await this.prisma.parcelBox.findUnique({
			where: { id },
			include: {
				parcel_box_type: true,
				Cell: {
					include: {
						cell_type: true,
					},
				},
				Location: true,
			},
		})

		if (!parcelBox) {
			return null
		}

		return this.mapDbParcelBoxToOutParcelBox(parcelBox)
	}

	@CatchDbError()
	async getParcelBoxesByUserId(userId: number) {
		const parcelBoxes = await this.prisma.parcelBox.findMany({
			where: { user_id: userId },
			include: {
				parcel_box_type: true,
				Cell: {
					include: {
						cell_type: true,
					},
				},
				Location: true,
			},
		})

		return parcelBoxes.map(this.mapDbParcelBoxToOutParcelBox)
	}

	mapDbParcelBoxToOutParcelBox(parcelBox: ParcelBoxFullDataPrisma): ParcelBoxOutModel {
		return {
			id: parcelBox.id,
			parcelBoxTypeId: parcelBox.parcel_box_type_id,
			parcelBoxTypeName: parcelBox.parcel_box_type.name,
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
				address: parcelBox?.Location?.address,
				businessDays: parcelBox?.Location?.business_days,
				businessTimeFrom: parcelBox?.Location?.business_time_from,
				businessTimeTo: parcelBox?.Location?.business_time_to,
			},
		}
	}
}
