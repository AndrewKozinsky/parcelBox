import { Injectable } from '@nestjs/common'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { SenderOutModel } from '../models/sender/sender.out.model'
import { SenderWithUser } from './common'

@Injectable()
export class SenderQueryRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async getSenderByUserId(userId: number) {
		const sender = await this.prisma.sender.findFirst({
			where: { user: { id: userId } },
			include: {
				user: true,
			},
		})

		if (!sender) {
			return null
		}

		return this.mapDbSenderToServiceSender(sender)
	}

	mapDbSenderToServiceSender(dbSender: SenderWithUser): SenderOutModel {
		return {
			id: dbSender.user.id,
			email: dbSender.user.email, // dbSender.email,
			firstName: dbSender.first_name,
			lastName: dbSender.last_name,
			passportNum: dbSender.passport_num,
			balance: dbSender.balance,
			active: dbSender.active,
			role: 'sender',
		}
	}
}
