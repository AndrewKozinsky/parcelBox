import { INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { App } from 'supertest/types'
import { MainConfigService } from '../../src/infrastructure/config/mainConfig.service'
import RouteNames from '../../src/infrastructure/routeNames'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { agent as request } from 'supertest'

export const defAdminEmail = 'admin@email.com'
export const defAdminPassword = 'adminPassword'

export const defSenderEmail = 'sender@email.com'
export const defSenderPassword = 'senderPassword'

type GraphQLErrorResponse = {
	errors: {
		message: string
		code: number
		fields?: Record<string, string[]>
	}[]
	data: null
}

export function extractErrObjFromResp(errResponse: GraphQLErrorResponse) {
	try {
		return errResponse.errors[0]
	} catch (err: unknown) {
		throw new Error('The response does not match to the schema of error')
	}
}

export async function isUserExists(userQueryRepository: UserQueryRepository, userId: number) {
	const createdUser = await userQueryRepository.getUserById(userId)
	expect(createdUser).toBeTruthy()
}

/**
 * Set server working mode to "production"
 * @param moduleFixture
 */
export function setProductionMode(moduleFixture: TestingModule) {
	const configService = moduleFixture.get(MainConfigService)

	// Store the original get() method
	const originalGet = configService.get.bind(configService)

	jest.spyOn(configService, 'get').mockImplementation((key?: string) => {
		const overriddenConfig = { mode: 'production' } // Your override
		const defaultConfig = originalGet() // Get the original config

		return key ? (overriddenConfig[key] ?? defaultConfig[key]) : { ...defaultConfig, ...overriddenConfig }
	})
}

export async function seedInitDataInDatabase(app: INestApplication<App>) {
	await request(app.getHttpServer()).post('/' + RouteNames.INIT_DATA.SEED)
}
