import { Injectable } from '@nestjs/common'
import { Sender } from '@prisma/client'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchErrors'
import { SenderServiceModel } from '../models/sender/sender.service.model'

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
		})

		return this.mapDbSenderToServiceSender(sender)
	}

	mapDbSenderToServiceSender(dbUser: Sender): SenderServiceModel {
		return {
			id: dbUser.id,
		}
	}
}
