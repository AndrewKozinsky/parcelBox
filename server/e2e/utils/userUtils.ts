import { INestApplication } from '@nestjs/common'
import RouteNames from '../../src/infrastructure/routeNames'
import { UserServiceModel } from '../../src/models/auth/auth.service.model'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq } from '../helper'
import { defAdminEmail, defAdminPassword } from './common'

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

		const mutation = `mutation {
			  ${RouteNames.AUTH.REGISTER_ADMIN}(input: {
				email: "${fixedAdminEmail}",
				password: "${fixedAdminPassword}"
			  }) {
				id
				email
			  }
			}`

		const createAdminResp = await makeGraphQLReq(props.app, mutation)
		const adminId = createAdminResp.data[RouteNames.AUTH.REGISTER_ADMIN].id

		return props.userRepository.getUserById(adminId)
	},

	isUserEmailConfirmed(user: UserServiceModel) {
		return user.isEmailConfirmed && !user.emailConfirmationCode && !user.confirmationCodeExpirationDate
	},
}
