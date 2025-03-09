import { INestApplication } from '@nestjs/common'
import { CellRepository } from '../../src/repo/cell.repository'
import { ParcelBoxRepository } from '../../src/repo/parcelBox.repository'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { UserRepository } from '../../src/repo/user.repository'
import { parcelBoxUtils } from './parcelBoxUtils'
import { seedTestDataConfig, UsersConfig } from './seedTestDataConfig'
import { userUtils } from './userUtils'

/**
 * Seed database with some data for testing.
 * @param props
 */
export async function seedTestData(props: {
	app: INestApplication
	userRepository: UserRepository
	parcelBoxRepository: ParcelBoxRepository
	cellRepository: CellRepository
	parcelBoxTypeRepository: ParcelBoxTypeRepository
}) {
	const { app, userRepository, parcelBoxRepository, cellRepository, parcelBoxTypeRepository } = props

	// Create test admins and users and set id into each user in usersConfig
	const usersConfig = await seedUsers(props)

	// Parcel box types and cell types were created earlier.
	// I'll use them to create parcel boxes...
	await seedParcelBoxes(usersConfig, props)
}

async function seedUsers(props: {
	app: INestApplication
	userRepository: UserRepository
	parcelBoxRepository: ParcelBoxRepository
	cellRepository: CellRepository
	parcelBoxTypeRepository: ParcelBoxTypeRepository
}) {
	const { app, userRepository, parcelBoxRepository, cellRepository, parcelBoxTypeRepository } = props

	// Create test users
	const usersConfig = seedTestDataConfig.getUsersConfig()

	for (let userEmail in usersConfig) {
		const userConfig = usersConfig[userEmail]

		let createdUser: { id: number } | null | undefined = null

		if (!userConfig.confirmed && !userConfig.login) {
			createdUser = await userUtils.createUserWithUnconfirmedEmail({
				app,
				userRepository,
				role: userConfig.role,
				email: userEmail,
				password: userConfig.password,
			})
		} else if (userConfig.confirmed && !userConfig.login) {
			createdUser = await userUtils.createUserWithConfirmedEmail({
				app,
				userRepository,
				role: userConfig.role,
				email: userEmail,
				password: userConfig.password,
			})
		} else if (userConfig.confirmed && userConfig.login) {
			const { loginData } = await userUtils.createUserAndLogin({
				app,
				userRepository,
				role: userConfig.role,
				email: userEmail,
				password: userConfig.password,
			})
			createdUser = loginData
		}

		if (!createdUser) {
			throw new Error('User was not created')
		}

		userConfig.id = createdUser.id
	}

	return usersConfig
}

async function seedParcelBoxes(
	usersConfig: UsersConfig,
	props: {
		app: INestApplication
		parcelBoxRepository: ParcelBoxRepository
		cellRepository: CellRepository
		parcelBoxTypeRepository: ParcelBoxTypeRepository
	},
) {
	const { app, parcelBoxRepository, cellRepository, parcelBoxTypeRepository } = props

	const usersParcelBoxesConfig = seedTestDataConfig.getUsersParcelBoxesConfig()

	// Loop throw user's email who has parcel boxes
	for (let userEmail in usersParcelBoxesConfig) {
		const userId = usersConfig[userEmail].id
		if (!userId) {
			throw new Error('User is not found')
		}

		// Which parcel boxes create for current user
		const userParcelBoxesConfig = usersParcelBoxesConfig[userEmail]

		// Loop through parcel boxes current user
		for (let parcelBoxTypeName in userParcelBoxesConfig) {
			// Get parcel box type
			const parcelBoxType = await parcelBoxUtils.getParcelBoxTypeIdByName({
				app,
				parcelBoxTypeRepository,
				parcelBoxTypeName,
			})
			if (!parcelBoxType) {
				throw new Error('ParcelBoxTypeId not found')
			}

			// Create a parcel box with specified type id
			await parcelBoxUtils.createParcelBoxWithCells({
				app,
				userId,
				parcelBoxTypeId: parcelBoxType.id,
				parcelBoxRepository,
				cellRepository,
			})
		}
	}
}
