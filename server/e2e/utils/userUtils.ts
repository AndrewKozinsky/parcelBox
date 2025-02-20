import { INestApplication } from '@nestjs/common'
import RouteNames from '../../src/infrastructure/routeNames'
import { UserServiceModel } from '../../src/models/auth/auth.service.model'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq } from '../helper'
import { defAdminEmail, defAdminPassword } from './common'
import { queries } from './queries'

export const userUtils = {
	async createAdminWithUnconfirmedEmail(props: {
		app: INestApplication
		userRepository: UserRepository
		userName?: string
		email?: string
		password?: string
	}) {
		const fixedAdminEmail = props.email ?? defAdminEmail
		const fixedAdminPassword = props.password ?? defAdminPassword

		const registerAdminMutation = queries.auth.registerAdmin({
			email: fixedAdminEmail,
			password: fixedAdminPassword,
		})

		const createAdminResp = await makeGraphQLReq(props.app, registerAdminMutation)
		const adminId = createAdminResp.data[RouteNames.AUTH.REGISTER_ADMIN].id

		return props.userRepository.getUserById(adminId)
	},
	async createAdminWithConfirmedEmail(props: {
		app: INestApplication
		userRepository: UserRepository
		userName?: string
		email?: string
		password?: string
	}) {
		await this.createAdminWithUnconfirmedEmail(props)
	},

	isUserEmailConfirmed(user: UserServiceModel) {
		return user.isEmailConfirmed && !user.emailConfirmationCode && !user.confirmationCodeExpirationDate
	},
}
