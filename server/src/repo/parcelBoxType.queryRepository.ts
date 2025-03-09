import { Injectable } from '@nestjs/common'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { ParcelBoxTypeOutModel } from '../models/parcelBoxType/parcelBoxType.out.model'
import { ParcelBoxTypeFullDataPrisma } from './common'

@Injectable()
export class ParcelBoxTypeQueryRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async getParcelBoxTypeById(id: number) {
		const parcelBoxType = await this.prisma.parcelBoxType.findUnique({
			where: { id },
			include: {
				CellType: true,
			},
		})

		if (!parcelBoxType) {
			return null
		}

		return this.mapDbParcelBoxTypeToOutParcelBoxType(parcelBoxType)
	}

	mapDbParcelBoxTypeToOutParcelBoxType(parcelBoxType: ParcelBoxTypeFullDataPrisma): ParcelBoxTypeOutModel {
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
