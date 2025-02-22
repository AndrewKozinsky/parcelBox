import { INestApplication } from '@nestjs/common'
import { agent as request } from 'supertest'
import * as dateFns from 'date-fns'
import { MainConfigService } from '../../src/config/mainConfig.service'
import RouteNames from '../../src/infrastructure/routeNames'
import { DeviceTokenOutModel } from '../../src/models/auth/auth.out.model'
import { UserServiceModel } from '../../src/models/auth/auth.service.model'
import { DevicesRepository } from '../../src/repo/devices.repository'
import { UserRepository } from '../../src/repo/user.repository'
import { createUniqString } from '../../src/utils/stringUtils'
import { makeGraphQLReq, makeGraphQLReqWithRefreshToken } from '../makeGQReq'
import { defAdminEmail, defAdminPassword, extractErrObjFromResp } from './common'
import { queries } from './queries'
import { UserOutModel } from 'src/models/user/user.out.model'
import { JwtAdapterService } from 'src/infrastructure/jwtAdapter/jwtAdapter.service'

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

		const createAdminResp = await makeGraphQLReq(props.app, registerAdminMutation)
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

		const confirmEmailResp = await makeGraphQLReq(props.app, confirmEmailQuery)

		return props.userRepository.getUserById(createdAdmin.id)
	},

	async createAdminAndLogin(props: {
		app: INestApplication
		userRepository: UserRepository
		email?: string
		password?: string
	}) {
		const email = props.email ?? defAdminEmail
		const password = props.email ?? defAdminPassword

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
		const loginResp = await makeGraphQLReq(props.app, loginQuery)
		const data = loginResp.data[RouteNames.AUTH.LOGIN]

		// const { accessToken } = loginRes.body.data
		// const refreshTokenStr = loginRes.headers['set-cookie'][0]

		// return [accessToken, refreshTokenStr, loginRes.body.data.user]*/
	},

	isUserEmailConfirmed(user: UserServiceModel) {
		return user.isEmailConfirmed && !user.emailConfirmationCode && !user.confirmationCodeExpirationDate
	},

	checkUserOutModel(user: UserOutModel) {
		expect(typeof user.id).toBe('number')
		expect(typeof user.email).toBe('string')
	},

	refreshDeviceTokenChecks: {
		// should return 401 if there is not cookies
		async tokenNotExist(app: INestApplication, queryOrMutationStr: string) {
			const resendConfirmationEmailResp = await makeGraphQLReq(app, queryOrMutationStr)

			expect(resendConfirmationEmailResp.data).toBe(null)

			const firstErr = extractErrObjFromResp(resendConfirmationEmailResp)

			expect(firstErr).toStrictEqual({
				message: 'Refresh token is not valid',
				code: 401,
			})
		},
		// should return 401 if the JWT refreshToken inside cookie is missing, expired or incorrect
		async refreshTokenExpired(props: {
			app: INestApplication
			queryOrMutationStr: string
			userRepository: UserRepository
			devicesRepository: DevicesRepository
			jwtAdapterService: JwtAdapterService
			mainConfig: MainConfigService
		}) {
			const admin = await userUtils.createAdminWithUnconfirmedEmail(props)

			// Create expired token in database
			const deviceId = createUniqString()
			const expiredDate = dateFns.subMilliseconds(
				new Date(),
				props.mainConfig.get().refreshToken.lifeDurationInMs,
			)
			const issuedAt = expiredDate.toISOString()

			const expiredRefreshToken: DeviceTokenOutModel = {
				issuedAt,
				deviceIP: '123',
				deviceId,
				deviceName: 'Unknown',
				userId: admin!.id,
			}

			await props.devicesRepository.insertDeviceRefreshToken(expiredRefreshToken)

			// Create expired token string
			const refreshTokenStr = props.jwtAdapterService.createRefreshTokenStr({ deviceId, issuedAt })

			const requestRes = await makeGraphQLReqWithRefreshToken({
				app: props.app,
				query: props.queryOrMutationStr,
				mainConfig: props.mainConfig,
				refreshTokenStr,
			})

			const firstErr = extractErrObjFromResp(requestRes)

			expect(firstErr).toEqual({
				code: 401,
				message: 'Refresh token is not valid',
			})
		},
		/*async tokenValid(props: {
			mainApp: INestApplication
			filesMicroservice: ClientProxy
			routeUrl: string
			userRepository: UserRepository
			mainConfig: MainConfigService
		}) {
			const [accessToken, refreshTokenStr] = await userUtils.createUserAndLogin({
				mainApp: props.mainApp,
				filesMicroservice: props.filesMicroservice,
				userRepository: props.userRepository,
				email: defUserEmail,
				password: defUserPassword,
			})

			const refreshTokenValue = parseCookieStringToObj(refreshTokenStr).cookieValue

			await postRequest(props.mainApp, props.routeUrl)
				.set('Cookie', props.mainConfig.get().refreshToken.name + '=' + refreshTokenValue)
				.expect(HTTP_STATUSES.OK_200)
		},*/
	},
}
