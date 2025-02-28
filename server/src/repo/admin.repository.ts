import { Injectable } from '@nestjs/common'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchDBErrors'
import { AdminServiceModel } from '../models/admin/admin.service.model'
import { AdminWithUser } from './common'

@Injectable()
export class AdminRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async createAdmin(userId: number) {
		const newAdminParams = {
			user_id: userId,
		}

		const admin = await this.prisma.admin.create({
			data: newAdminParams,
			include: {
				user: true,
			},
		})

		return this.mapDbAdminToServiceSender(admin)
	}

	mapDbAdminToServiceSender(dbUser: AdminWithUser): AdminServiceModel {
		return {
			id: dbUser.user_id,
			email: dbUser.user.email,
		}
	}
}
