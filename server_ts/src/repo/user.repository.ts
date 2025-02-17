import { Inject, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { add } from 'date-fns'
import { PrismaService } from '../db/prisma.service'
import { HashAdapterService } from '../infrastructure/hashAdapter/hash-adapter.service'
import { UserServiceModel } from '../models/auth/auth.service.model'
import { createUniqString } from '../utils/stringUtils'

@Injectable()
export class UserRepository {
	constructor(
		private prisma: PrismaService,
		private hashAdapter: HashAdapterService,
	) {}

	/*async getUserById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id },
		})

		if (!user) {
			return null
		}

		const userAvatarUrl = await this.getUserAvatarUrl(user.id)
		return this.mapDbUserToServiceUser(user, userAvatarUrl)
	}*/

	async getUserByEmail(email: string) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { email },
			})

			if (!user) return null

			return this.mapDbUserToServiceUser(user)
		} catch (err: unknown) {
			console.log(err)
		}
	}

	/*async getUserByEmailAndPassword(email: string, password: string) {
		const user = await this.prisma.user.findUnique({
			where: { email },
		})
		if (!user) return null

		const isPasswordMath = await this.hashAdapter.compare(password, user.hashed_password)
		if (!isPasswordMath) return null

		const userAvatarUrl = await this.getUserAvatarUrl(user.id)
		return this.mapDbUserToServiceUser(user, userAvatarUrl)
	}*/

	/*async getUserByUserName(userName: string) {
		const user = await this.prisma.user.findFirst({
			where: { user_name: userName },
		})

		if (!user) return null

		const userAvatarUrl = await this.getUserAvatarUrl(user.id)
		return this.mapDbUserToServiceUser(user, userAvatarUrl)
	}*/

	/*async getUserByConfirmationCode(confirmationCode: string) {
		const user = await this.prisma.user.findFirst({
			where: { email_confirmation_code: confirmationCode },
		})

		if (!user) return null

		const userAvatarUrl = await this.getUserAvatarUrl(user.id)
		return this.mapDbUserToServiceUser(user, userAvatarUrl)
	}*/

	/*async getConfirmedUserByEmailAndPassword(email: string, password: string): Promise<null | UserServiceModel> {
		const user = await this.getUserByEmailAndPassword(email, password)

		if (!user || !user.isEmailConfirmed) {
			return null
		}

		return user
	}*/

	/*async getUserByPasswordRecoveryCode(password_recovery_code: string) {
		const user = await this.prisma.user.findFirst({
			where: { password_recovery_code },
		})

		if (!user) return null

		const userAvatarUrl = await this.getUserAvatarUrl(user.id)
		return this.mapDbUserToServiceUser(user, userAvatarUrl)
	}*/

	/*async getUserByRefreshToken(refreshTokenStr: string) {
		const refreshTokenData = this.jwtAdapter.getRefreshTokenDataFromTokenStr(refreshTokenStr)

		const device = await this.prisma.deviceToken.findFirst({
			where: { device_id: refreshTokenData!.deviceId },
		})

		if (!device) return null

		const user = await this.prisma.user.findFirst({
			where: { id: device.user_id },
		})

		if (!user) return null

		const userAvatarUrl = await this.getUserAvatarUrl(user.id)
		return this.mapDbUserToServiceUser(user, userAvatarUrl)
	}*/

	async createUser(dto: { email: string; password: string }) {
		const newUserParams: any = {
			email: dto.email,
			password: await this.hashAdapter.hashString(dto.password),
			email_confirmation_code: createUniqString(),
			email_confirmation_code_expiration_date: add(new Date(), {
				hours: 0,
				minutes: 5,
			}).toISOString(),
			is_email_confirmed: false,
		}

		const user = await this.prisma.user.create({
			data: newUserParams,
		})

		return this.mapDbUserToServiceUser(user)
	}

	/*async updateUser(userId: number, data: Partial<User>) {
		await this.prisma.user.update({
			where: { id: userId },
			data,
		})
	}*/

	/*async makeEmailVerified(userId: number) {
		await this.updateUser(userId, {
			email_confirmation_code: null,
			is_email_confirmed: true,
			email_confirmation_code_expiration_date: null,
		})
	}*/

	/*async deleteUser(userId: number) {
		await this.prisma.user.delete({
			where: { id: userId },
		})
	}*/

	/*async getUserAvatarUrl(userId: number) {
		const sendingDataContract: FileMS_GetUserAvatarInContract = { userId }
		const filesMSRes: FileMS_SaveUserAvatarOutContract = await lastValueFrom(
			this.filesMicroClient.send(FileMS_EventNames.GetUserAvatar, sendingDataContract),
		)

		return filesMSRes.avatarUrl
	}*/

	mapDbUserToServiceUser(dbUser: User): UserServiceModel {
		return {
			id: dbUser.id,
			email: dbUser.email,
			password: dbUser.password,
			emailConfirmationCode: dbUser.email_confirmation_code,
			confirmationCodeExpirationDate: dbUser.email_confirmation_code_expiration_date,
			isEmailConfirmed: dbUser.is_email_confirmed,
		}
	}
}
