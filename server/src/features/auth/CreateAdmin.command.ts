import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { EmailAdapterService } from '../../infrastructure/email-adapter/email-adapter.service'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customGraphQLError'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { CreateAdminInputModel } from '../../models/auth/auth.input.model'
import { SenderRepository } from '../../repo/sender.repository'
import { UserRepository } from '../../repo/user.repository'

export class CreateAdminCommand implements ICommand {
	constructor(public createAdminInput: CreateAdminInputModel) {}
}

@CommandHandler(CreateAdminCommand)
export class CreateAdminHandler implements ICommandHandler<CreateAdminCommand> {
	async execute(command: CreateAdminCommand) {
		const { createAdminInput } = command

		const existingUser = await this.userRepository.getUserByEmail(createAdminInput.email)

		if (existingUser) {
			if (existingUser.isEmailConfirmed) {
				throw new CustomGraphQLError(errorMessage.emailIsAlreadyRegistered, ErrorCode.BadRequest_400)
			}

			await this.userRepository.deleteUser(existingUser.id)
		}

		const createdUser = await this.userRepository.createUser(createAdminInput)
		const createdAdmin = await this.adminRepository.createAdmin({ userId: createdUser.id })

		await this.emailAdapter.sendEmailConfirmationMessage(createdUser.email, createdUser.emailConfirmationCode!)
	}

	constructor(
		private userRepository: UserRepository,
		private emailAdapter: EmailAdapterService,
		public adminRepository: SenderRepository,
	) {}
}
