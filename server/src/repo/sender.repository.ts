import { Injectable } from '@nestjs/common'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { SenderServiceModel } from '../models/sender/sender.service.model'
import { SenderWithUser } from './common'

@Injectable()
export class SenderRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async createSender(userId: number) {
		const newSenderParams = {
			user_id: userId,
			active: false,
		}

		const sender = await this.prisma.sender.create({
			data: newSenderParams,
			include: {
				user: true,
			},
		})

		return this.mapDbSenderToServiceSender(sender)
	}

	mapDbSenderToServiceSender(dbUser: SenderWithUser): SenderServiceModel {
		return {
			id: dbUser.user_id,
		}
	}
}
