import { INestApplication } from '@nestjs/common'
import RouteNames from '../../src/infrastructure/routeNames'
import { UserServiceModel } from '../../src/models/auth/auth.service.model'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq } from '../makeGQReq'
import { defAdminEmail, defAdminPassword } from './common'
import { queries } from './queries'
import { UserOutModel } from 'src/models/user/user.out.model'

export const userUtils = {
	async createAdminWithUnconfirmedEmail(props: {
		app: INestApplication
		userRepository: UserRepository
		email?: string
		password?: string
	}) {
		const fixedAdminEmail = props.email ?? defAdminEmail
		const fixedAdminPassword = props.password ?? defAdminPassword

		const registerAdminMutation = queries.auth.registerAdmin({
			email: fixedAdminEmail,
			password: fixedAdminPassword,
		})

		const [createAdminResp] = await makeGraphQLReq(props.app, registerAdminMutation)
		const adminId = createAdminResp.data[RouteNames.AUTH.REGISTER_ADMIN].id

		return props.userRepository.getUserById(adminId)
	},

	async createAdminWithConfirmedEmail(props: {
		app: INestApplication
		userRepository: UserRepository
		email?: string
		password?: string
	}) {
		const createdAdmin = await this.createAdminWithUnconfirmedEmail(props)
		if (!createdAdmin) return

		const { emailConfirmationCode } = createdAdmin

		const confirmEmailQuery = queries.auth.confirmEmail(emailConfirmationCode!)

		const [confirmEmailResp] = await makeGraphQLReq(props.app, confirmEmailQuery)

		return props.userRepository.getUserById(createdAdmin.id)
	},

	async createAdminAndLogin(props: {
		app: INestApplication
		userRepository: UserRepository
		email?: string
		password?: string
	}) {
		const email = props.email ?? defAdminEmail
		const password = props.password ?? defAdminPassword

		await this.createAdminWithConfirmedEmail({
			app: props.app,
			userRepository: props.userRepository,
			email,
			password,
		})

		return this.loginUser({
			app: props.app,
			email,
			password,
		})
	},

	async loginUser(props: { app: INestApplication; email: string; password: string }) {
		const loginQuery = queries.auth.login({ email: defAdminEmail, password: defAdminPassword })
		const [loginResp, cookies] = await makeGraphQLReq(props.app, loginQuery)

		return {
			loginData: loginResp.data[RouteNames.AUTH.LOGIN],
			accessToken: cookies?.accessToken,
			refreshToken: cookies?.refreshToken,
		}
	},

	isUserEmailConfirmed(user: UserServiceModel) {
		return user.isEmailConfirmed && !user.emailConfirmationCode && !user.confirmationCodeExpirationDate
	},

	checkUserOutModel(user: UserOutModel) {
		expect(typeof user.id).toBe('number')
		expect(typeof user.email).toBe('string')
		expect(['admin', 'sender']).toContain(user.role)
	},
}
