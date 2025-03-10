import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UserRole } from '../../db/dbConstants'
import { ParcelBoxTypeRepository } from '../../repo/parcelBoxType.repository'
import { UserRepository } from '../../repo/user.repository'
import { ConfirmEmailCommand } from '../auth/ConfirmEmail.command'
import { CreateAdminCommand } from '../auth/CreateAdmin.command'
import { CreateSenderCommand } from '../auth/CreateSender.command'
import { CreateParcelBoxCommand } from '../parcelBox/CreateParcelBox.command'
import { seedTestDataConfig, UsersConfig } from './seedTestDataConfig'

export class SeedTestDataCommand {
	constructor() {}
}

@CommandHandler(SeedTestDataCommand)
export class SeedTestDataHandler implements ICommandHandler<SeedTestDataCommand> {
	constructor(
		private userRepository: UserRepository,
		private parcelBoxTypeRepository: ParcelBoxTypeRepository,
		private commandBus: CommandBus,
	) {}

	async execute() {
		// Create test admins and users and set id into each user in usersConfig
		const usersConfig = await this.seedUsers()
		// Parcel box types and cell types were created earlier.
		// I'll use them to create parcel boxes...
		// await this.seedParcelBoxes(usersConfig)
	}

	async seedUsers() {
		// Create test users
		const usersConfig = seedTestDataConfig.getUsersConfig()

		for (let userKey in usersConfig) {
			const userConfig = usersConfig[userKey]

			let createdUser = userConfig.confirmed
				? await this.createUserWithConfirmedEmail({
					role: userConfig.role,
					email: userConfig.email,
					password: userConfig.password,
				})
				: await this.createUserWithUnconfirmedEmail({
					role: userConfig.role,
					email: userConfig.email,
					password: userConfig.password,
				})

			if (!createdUser) {
				throw new Error('User was not created')
			}

			userConfig.id = createdUser.id
		}

		return usersConfig
	}

	async seedParcelBoxes(usersConfig: UsersConfig) {
		const usersParcelBoxesConfig = seedTestDataConfig.getUsersParcelBoxesConfig()

		// Loop throw user's email who has parcel boxes
		for (let userEmail in usersParcelBoxesConfig) {
			let userId = 0
			for (const key in usersConfig) {
				if (usersConfig[key].email === userEmail) {
					userId = usersConfig[key].id!
				}
			}
			if (!userId) {
				throw new Error('User is not found')
			}

			// Which parcel boxes create for current user
			const userParcelBoxesConfig = usersParcelBoxesConfig[userEmail]

			// Loop through parcel boxes current user
			for (let parcelBoxTypeName in userParcelBoxesConfig) {
				// Get parcel box type
				const parcelBoxType = await this.parcelBoxTypeRepository.getParcelBoxTypeByName(parcelBoxTypeName)
				if (!parcelBoxType) {
					throw new Error('ParcelBoxTypeId not found')
				}

				const parcelBoxesCount = userParcelBoxesConfig[parcelBoxTypeName]
				for (let i = 1; i <= parcelBoxesCount; i++) {
					await this.commandBus.execute(
						new CreateParcelBoxCommand({ parcelBoxTypeId: parcelBoxType.id, userId }),
					)
				}
			}
		}
	}

	async createUserWithUnconfirmedEmail(props: { role: UserRole; email: string; password: string }) {
		const createdUser =
			props.role === UserRole.Admin
				? await this.commandBus.execute(
					new CreateAdminCommand({ email: props.email, password: props.password }),
				)
				: await this.commandBus.execute(
					new CreateSenderCommand({ email: props.email, password: props.password }),
				)

		return await this.userRepository.getUserById(createdUser.id)
	}

	async createUserWithConfirmedEmail(props: { role: UserRole; email: string; password: string }) {
		const createdUser = await this.createUserWithUnconfirmedEmail(props)
		if (!createdUser) {
			throw new Error('A user was not created')
		}

		const { emailConfirmationCode } = createdUser
		if (!emailConfirmationCode) {
			throw new Error('Email confirmationCode not found')
		}

		await this.commandBus.execute(new ConfirmEmailCommand({ code: emailConfirmationCode }))

		return createdUser
	}
}
