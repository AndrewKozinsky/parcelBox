import { Injectable } from '@nestjs/common'
import { ParcelBox, ParcelBoxType } from '@prisma/client'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { ParcelBoxOutModel } from '../models/parcelBox/parcelBox.out.model'
import { ParcelBoxTypeOutModel } from '../models/parcelBoxType/parcelBoxType.out.model'
import { ParcelBoxWithCells } from './common'

@Injectable()
export class ParcelBoxQueryRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async getParcelBoxById(id: number) {
		const parcelBox = await this.prisma.parcelBox.findUnique({
			where: { id },
			include: {
				Cell: true,
			},
		})

		if (!parcelBox) {
			return null
		}

		return this.mapDbParcelBoxToOutParcelBox(parcelBox)
	}

	mapDbParcelBoxToOutParcelBox(parcelBox: ParcelBoxWithCells): ParcelBoxOutModel {
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
				}
			}),
		}
	}
}
