import { INestApplication } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { UserRole } from '../../src/db/dbConstants'
import { MainConfigService } from '../../src/infrastructure/config/mainConfig.service'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { userUtils } from './userUtils'

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
export function makeProductionMode(moduleFixture: TestingModule) {
	const configService = moduleFixture.get(MainConfigService)

	// Store the original get() method
	const originalGet = configService.get.bind(configService)

	jest.spyOn(configService, 'get').mockImplementation((key?: string) => {
		const overriddenConfig = { mode: 'production' } // Your override
		const defaultConfig = originalGet() // Get the original config

		return key ? (overriddenConfig[key] ?? defaultConfig[key]) : { ...defaultConfig, ...overriddenConfig }
	})
}

/**
 * Seed database with some data for testing.
 * @param props
 */
export async function seedDbWithTestData(props: { app: INestApplication; userRepository: UserRepository }) {
	const { app, userRepository } = props

	// Create the first admin
	await userUtils.createUserWithUnconfirmedEmail({
		app,
		userRepository,
		role: UserRole.Admin,
		email: 'admin-1@email.com',
		password: 'adminPassword-1',
	})

	// Create the second admin
	await userUtils.createUserWithConfirmedEmail({
		app,
		userRepository,
		role: UserRole.Admin,
		email: 'admin-2@email.com',
		password: 'adminPassword-2',
	})

	// Create the third admin
	await userUtils.createUserAndLogin({
		app,
		userRepository,
		role: UserRole.Admin,
		email: 'admin-3@email.com',
		password: 'adminPassword-3',
	})

	// -------

	// Create the first sender
	await userUtils.createUserWithUnconfirmedEmail({
		app,
		userRepository,
		role: UserRole.Sender,
		email: 'sender-1@email.com',
		password: 'senderPassword-1',
	})

	// Create the second sender
	await userUtils.createUserWithUnconfirmedEmail({
		app,
		userRepository,
		role: UserRole.Sender,
		email: 'sender-2@email.com',
		password: 'senderPassword-2',
	})

	// Create the third sender
	await userUtils.createUserWithConfirmedEmail({
		app,
		userRepository,
		role: UserRole.Sender,
		email: 'sender-3@email.com',
		password: 'senderPassword-3',
	})

	// Create the forth sender
	await userUtils.createUserAndLogin({
		app,
		userRepository,
		role: UserRole.Sender,
		email: 'sender-4@email.com',
		password: 'senderPassword-4',
	})

	// Create the fifth sender
	await userUtils.createUserAndLogin({
		app,
		userRepository,
		role: UserRole.Sender,
		email: 'sender-5@email.com',
		password: 'senderPassword-5',
	})
}
