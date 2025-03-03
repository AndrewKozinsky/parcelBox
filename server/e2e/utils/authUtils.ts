import { INestApplication } from '@nestjs/common'
import * as dateFns from 'date-fns'
import { MainConfigService } from '../../src/infrastructure/config/mainConfig.service'
import { UserRole } from '../../src/db/dbConstants'
import { errorMessage } from '../../src/infrastructure/exceptions/errorMessage'
import { DeviceTokenOutModel } from '../../src/models/auth/auth.out.model'
import { DevicesRepository } from '../../src/repo/devices.repository'
import { UserRepository } from '../../src/repo/user.repository'
import { createUniqString } from '../../src/utils/stringUtils'
import { makeGraphQLReq, makeGraphQLReqWithTokens } from '../makeGQReq'
import { extractErrObjFromResp } from './common'
import { JwtAdapterService } from 'src/infrastructure/jwtAdapter/jwtAdapter.service'
import { userUtils } from './userUtils'

export const authUtils = {
	accessTokenChecks: {
		// should return 401 if there aren't cookies
		async tokenNotExist(app: INestApplication, queryOrMutationStr: string) {
			const [queryResp] = await makeGraphQLReq(app, queryOrMutationStr)

			expect(queryResp.data).toBe(null)

			const firstErr = extractErrObjFromResp(queryResp)

			expect(firstErr).toStrictEqual({
				message: errorMessage.accessTokenIsNotValid,
				code: 401,
			})
		},
		// should return 401 if the JWT refreshToken inside cookie is missing, expired or incorrect
		async tokenExpired(props: {
			app: INestApplication
			queryOrMutationStr: string
			userRepository: UserRepository
			devicesRepository: DevicesRepository
			jwtAdapter: JwtAdapterService
			mainConfig: MainConfigService
			role: UserRole
		}) {
			const admin = await userUtils.createUserWithConfirmedEmail(props)
			if (!admin) {
				throw new Error('User is not created')
			}

			const expiredAccessToken = props.jwtAdapter.createAccessTokenStr(admin.id)

			const [requestRes] = await makeGraphQLReqWithTokens({
				app: props.app,
				query: props.queryOrMutationStr,
				mainConfig: props.mainConfig,
				accessTokenStr: expiredAccessToken,
				accessTokenMaxAgeInSeconds: -1,
			})

			const firstErr = extractErrObjFromResp(requestRes)

			expect(firstErr).toEqual({
				code: 401,
				message: errorMessage.accessTokenIsNotValid,
			})
		},
	},

	refreshDeviceTokenChecks: {
		// should return 401 if there aren't cookies
		async tokenNotExist(app: INestApplication, queryOrMutationStr: string) {
			const [queryResp] = await makeGraphQLReq(app, queryOrMutationStr)

			expect(queryResp.data).toBe(null)

			const firstErr = extractErrObjFromResp(queryResp)

			expect(firstErr).toStrictEqual({
				message: errorMessage.refreshTokenIsNotValid,
				code: 401,
			})
		},
		// should return 401 if the JWT refreshToken inside cookie is missing, expired or incorrect
		async tokenExpired(props: {
			app: INestApplication
			queryOrMutationStr: string
			userRepository: UserRepository
			devicesRepository: DevicesRepository
			jwtAdapter: JwtAdapterService
			mainConfig: MainConfigService
			role: UserRole
		}) {
			const admin = await userUtils.createUserWithConfirmedEmail(props)
			if (!admin) {
				throw new Error('User is not created')
			}

			const expiredRefreshToken = await authUtils.createExpiredRefreshTokenInDatabase({
				...props,
				userId: admin.id,
			})

			const [requestRes] = await makeGraphQLReqWithTokens({
				app: props.app,
				query: props.queryOrMutationStr,
				mainConfig: props.mainConfig,
				refreshTokenStr: expiredRefreshToken,
			})

			const firstErr = extractErrObjFromResp(requestRes)

			expect(firstErr).toEqual({
				code: 401,
				message: errorMessage.refreshTokenIsNotValid,
			})
		},
	},
	async createExpiredRefreshTokenInDatabase(props: {
		app: INestApplication
		userId: number
		queryOrMutationStr: string
		devicesRepository: DevicesRepository
		jwtAdapter: JwtAdapterService
		mainConfig: MainConfigService
	}) {
		const deviceId = createUniqString()

		const expiredDate = dateFns.subMilliseconds(new Date(), props.mainConfig.get().refreshToken.lifeDurationInMs)

		const expiredRefreshToken: DeviceTokenOutModel = {
			issuedAt: expiredDate.toISOString(),
			deviceIP: '123',
			deviceId,
			deviceName: 'Unknown',
			userId: props.userId,
		}

		await props.devicesRepository.insertDeviceRefreshToken(expiredRefreshToken)

		// Create expired token string
		return props.jwtAdapter.createRefreshTokenStr({ deviceId, issuedAt: expiredDate })
	},
}
