import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchErrors'
import { UserOutModel } from '../models/user/user.out.model'

@Injectable()
export class SenderQueryRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async getSenderByUserId(userId: number) {
		/*const user = await this.prisma.user.findUnique({
			where: { id },
		})

		if (!user) {
			return null
		}

		return this.mapDbUserToServiceUser(user)*/
	}

	mapDbSenderToServiceSender(dbUser: User): UserOutModel {
		return {
			id: dbUser.id,
			email: dbUser.email,
		}
	}
}
