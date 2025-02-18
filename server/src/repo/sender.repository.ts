import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchErrors'
import { AdminServiceModel } from '../models/admin/admin.service.model'

@Injectable()
export class SenderRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async createSender(dto: { userId: number }) {
		const newSenderParams: any = {
			userId: dto.userId,
		}

		/*const sender = await this.prisma.sender.create({
			data: newSenderParams,
		})*/

		// return this.mapDbSenderToServiceSender(sender)
	}

	mapDbSenderToServiceSender(dbUser: User): AdminServiceModel {
		return {
			id: dbUser.id,
		}
	}
}
