import { INestApplication } from '@nestjs/common'
import { CellRepository } from '../../src/repo/cell.repository'
import { CellTypeRepository } from '../../src/repo/cellType.repository'
import { ParcelBoxRepository } from '../../src/repo/parcelBox.repository'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { UserRepository } from '../../src/repo/user.repository'
import { cellTypeUtils } from './cellTypeUtils'
import { parcelBoxUtils } from './parcelBoxUtils'
import { seedDataConfig } from './seedDataConfig'
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
	cellTypeRepository: CellTypeRepository
	parcelBoxTypeRepository: ParcelBoxTypeRepository
}) {
	const { app, userRepository } = props

	// Create test users
	const usersConfig = seedDataConfig.getUsersConfig()
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

	// Parcel box types and cell types were created earlier...

	const usersParcelBoxesConfig = seedDataConfig.getUsersParcelBoxesConfig()

	// Pour parcelBoxConfig with correct parcelBoxTypeId
	for (let userEmail in usersParcelBoxesConfig) {
		const userId = usersConfig[userEmail].id
		if (!userId) {
			throw new Error('User is not found')
		}

		const userParcelBoxesConfig = usersParcelBoxesConfig[userEmail]

		for (let parcelBoxTypeName in userParcelBoxesConfig) {
			const parcelBoxType = await parcelBoxUtils.getParcelBoxTypeIdByName({
				app,
				parcelBoxTypeRepository: props.parcelBoxTypeRepository,
				parcelBoxTypeName,
			})
			if (!parcelBoxType) {
				throw new Error('ParcelBoxTypeId not found')
			}

			await parcelBoxUtils.createParcelBoxWithCells({
				app,
				userId,
				parcelBoxTypeId: parcelBoxType.id,
				parcelBoxRepository: props.parcelBoxRepository,
				cellRepository: props.cellRepository,
			})
		}
	}
}
