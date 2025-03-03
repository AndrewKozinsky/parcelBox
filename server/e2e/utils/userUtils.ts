import { INestApplication } from '@nestjs/common'
import { UserOutModel } from 'src/models/user/user.out.model'
import { UserRole } from '../../src/db/dbConstants'
import RouteNames from '../../src/infrastructure/routeNames'
import { UserServiceModel } from '../../src/models/auth/auth.service.model'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq } from '../makeGQReq'
import { defAdminEmail, defAdminPassword, defSenderEmail, defSenderPassword } from './common'
import { queries } from '../../src/features/test/queries'

export const userUtils = {
	async createUserWithUnconfirmedEmail(props: {
		app: INestApplication
		userRepository: UserRepository
		role: UserRole
		email?: string
		password?: string
	}) {
		const { fixedEmail, fixedPassword } = userUtils.getUserEmailAndPasswordDependsOnRole(props)

		const mutationArgs = {
			email: fixedEmail,
			password: fixedPassword,
		}

		const createUserMutation =
			props.role === UserRole.Admin
				? queries.auth.registerAdmin(mutationArgs)
				: queries.auth.registerSender(mutationArgs)

		const [createUserResp] = await makeGraphQLReq(props.app, createUserMutation)

		const routeName =
			props.role === UserRole.Admin ? RouteNames.AUTH.REGISTER_ADMIN : RouteNames.AUTH.REGISTER_SENDER
		const userId = createUserResp.data[routeName].id

		return props.userRepository.getUserById(userId)
	},

	async createUserWithConfirmedEmail(props: {
		app: INestApplication
		userRepository: UserRepository
		role: UserRole
		email?: string
		password?: string
	}) {
		const createdUser = await userUtils.createUserWithUnconfirmedEmail(props)
		if (!createdUser) return

		const { emailConfirmationCode } = createdUser

		const confirmEmailQuery = queries.auth.confirmEmail(emailConfirmationCode!)

		const [confirmEmailResp] = await makeGraphQLReq(props.app, confirmEmailQuery)

		return props.userRepository.getUserById(createdUser.id)
	},

	async createUserAndLogin(props: {
		app: INestApplication
		userRepository: UserRepository
		role: UserRole
		email?: string
		password?: string
	}) {
		const { fixedEmail, fixedPassword } = userUtils.getUserEmailAndPasswordDependsOnRole(props)

		await userUtils.createUserWithConfirmedEmail({
			app: props.app,
			userRepository: props.userRepository,
			role: props.role,
			email: fixedEmail,
			password: fixedPassword,
		})

		return userUtils.loginUser({
			app: props.app,
			email: fixedEmail,
			password: fixedPassword,
		})
	},

	async loginUser(props: { app: INestApplication; email: string; password: string }) {
		const loginQuery = queries.auth.login({ email: props.email, password: props.password })
		const [loginResp, cookies] = await makeGraphQLReq(props.app, loginQuery)
		if (!loginResp.data) {
			throw new Error('Unable to log in')
		}

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

	getUserEmailAndPasswordDependsOnRole(props: { role?: UserRole; email?: string; password?: string }) {
		if (!props.role && !props.email && !props.password) {
			throw new Error('You must provide or role or email and password')
		}

		let fixedEmail = props.email
		if (!fixedEmail) {
			fixedEmail = props.role === UserRole.Admin ? defAdminEmail : defSenderEmail
		}

		let fixedPassword = props.password
		if (!fixedPassword) {
			fixedPassword = props.role === UserRole.Admin ? defAdminPassword : defSenderPassword
		}

		return {
			fixedEmail,
			fixedPassword,
		}
	},
}
