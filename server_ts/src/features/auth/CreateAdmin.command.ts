import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { EmailAdapterService } from '../../infrastructure/email-adapter/email-adapter.service'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { CreateAdminInputModel } from '../../models/auth/auth.input.model'
import { UserRepository } from '../../repo/user.repository'
// import { UserOutModel } from '../../models/user/user.out.model'

export class CreateAdminCommand implements ICommand {
	constructor(public readonly createAdminInput: CreateAdminInputModel) {}
}

@CommandHandler(CreateAdminCommand)
export class CreateAdminHandler implements ICommandHandler<CreateAdminCommand> {
	constructor(
		private userRepository: UserRepository,
		private emailAdapter: EmailAdapterService,
	) {}

	async execute(command: CreateAdminCommand) {
		const { createAdminInput } = command

		const existingUser = await this.userRepository.getUserByEmail(createAdminInput.email)

		if (existingUser) {
			if (existingUser.isEmailConfirmed) {
				throw new Error(errorMessage.emailIsAlreadyRegistered)
			}

			await this.userRepository.deleteUser(existingUser.id)
		}

		const createdUser = await this.userRepository.createUser(createAdminInput)

		await this.emailAdapter.sendEmailConfirmationMessage(createdUser.email, createdUser.emailConfirmationCode!)
	}
}
