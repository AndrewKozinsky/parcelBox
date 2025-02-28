import { Injectable } from '@nestjs/common'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { AdminOutModel } from '../models/admin/admin.out.model'
import { AdminWithUser } from './common'

@Injectable()
export class AdminQueryRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async getAdminByUserId(userId: number) {
		const admin = await this.prisma.admin.findFirst({
			where: { user: { id: userId } },
			include: {
				user: true,
			},
		})

		if (!admin) {
			return null
		}

		return this.mapDbAdminToServiceSender(admin)
	}

	mapDbAdminToServiceSender(dbSender: AdminWithUser): AdminOutModel {
		return {
			id: dbSender.user.id,
			email: dbSender.user.email, // dbSender.email,
			role: 'admin',
		}
	}
}
