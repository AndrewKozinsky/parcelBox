import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { UserRole } from '../db/dbConstants'
import { PrismaService } from '../db/prisma.service'
import CatchDbError from '../infrastructure/exceptions/CatchErrors'
import { UserOutModel } from '../models/user/user.out.model'

@Injectable()
export class UserQueryRepository {
	constructor(private prisma: PrismaService) {}

	@CatchDbError()
	async getUserById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id },
		})

		if (!user) {
			return null
		}

		return this.mapDbUserToServiceUser(user)
	}

	mapDbUserToServiceUser(dbUser: User): UserOutModel {
		return {
			id: dbUser.id,
			email: dbUser.email,
			role: dbUser.role === UserRole.Admin ? 'admin' : 'sender',
		}
	}
}
