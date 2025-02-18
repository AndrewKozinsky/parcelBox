import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { UserRole } from '../../db/dbConstants'
import { EmailAdapterService } from '../../infrastructure/email-adapter/email-adapter.service'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customGraphQLError'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { CreateAdminInputModel } from '../../models/auth/auth.input.model'
import { UserQueryRepository } from '../../repo/user.queryRepository'
import { UserRepository } from '../../repo/user.repository'

export class CreateAdminCommand implements ICommand {
	constructor(public createAdminInput: CreateAdminInputModel) {}
}

@CommandHandler(CreateAdminCommand)
export class CreateAdminHandler implements ICommandHandler<CreateAdminCommand> {
	constructor(
		private userRepository: UserRepository,
		private userQueryRepository: UserQueryRepository,
		private emailAdapter: EmailAdapterService,
	) {}

	async execute(command: CreateAdminCommand) {
		const { createAdminInput } = command

		const existingUser = await this.userRepository.getUserByEmail(createAdminInput.email)

		if (existingUser) {
			const errMessage = existingUser.isEmailConfirmed
				? errorMessage.emailIsAlreadyRegistered
				: errorMessage.EmailIsNotConfirmed

			throw new CustomGraphQLError(errMessage, ErrorCode.BadRequest_400)
		}

		const createdUser = await this.userRepository.createUser(createAdminInput, UserRole.Admin)
		const newUser = await this.userQueryRepository.getUserById(createdUser.id)

		await this.emailAdapter.sendEmailConfirmationMessage(createdUser.email, createdUser.emailConfirmationCode!)

		return newUser
	}
}
