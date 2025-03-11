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
				parcel_box_type: true,
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
				parcel_box_type: true,
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

	@CatchDbError()
	async deleteParcelBox(parcelBoxId: number) {
		await this.prisma.cell.deleteMany({
			where: {
				parcel_box_id: parcelBoxId,
			},
		})

		await this.prisma.location.deleteMany({
			where: {
				parcel_box_id: parcelBoxId,
			},
		})

		await this.prisma.parcelBox.delete({
			where: {
				id: parcelBoxId,
			},
		})

		return true
	}

	mapDbParcelBoxTypeToServiceParcelBoxType(parcelBox: ParcelBoxFullDataPrisma): ParcelBoxServiceModel {
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
				address: parcelBox?.Location?.address ?? '',
				businessDays: parcelBox?.Location?.business_days ?? [],
				businessTimeFrom: parcelBox?.Location?.business_time_from,
				businessTimeTo: parcelBox?.Location?.business_time_to,
			},
		}
	}
}
