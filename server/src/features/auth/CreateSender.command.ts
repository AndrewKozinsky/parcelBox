import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { UserRole } from '../../db/dbConstants'
import { EmailAdapterService } from '../../infrastructure/email-adapter/email-adapter.service'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customGraphQLError'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { CreateSenderInputModel } from '../../models/auth/auth.input.model'
import { SenderQueryRepository } from '../../repo/sender.queryRepository'
import { SenderRepository } from '../../repo/sender.repository'
import { UserRepository } from '../../repo/user.repository'

export class CreateSenderCommand implements ICommand {
	constructor(public createSenderInput: CreateSenderInputModel) {}
}

@CommandHandler(CreateSenderCommand)
export class CreateSenderHandler implements ICommandHandler<CreateSenderCommand> {
	constructor(
		private userRepository: UserRepository,
		private senderRepository: SenderRepository,
		private senderQueryRepository: SenderQueryRepository,
		private emailAdapter: EmailAdapterService,
	) {}

	async execute(command: CreateSenderCommand) {
		const { createSenderInput } = command

		const existingUser = await this.userRepository.getUserByEmail(createSenderInput.email)

		if (existingUser) {
			const errMessage = existingUser.isEmailConfirmed
				? errorMessage.emailIsAlreadyRegistered
				: errorMessage.EmailIsNotConfirmed

			throw new CustomGraphQLError(errMessage, ErrorCode.BadRequest_400)
		}

		const createdUser = await this.userRepository.createUser(createSenderInput, UserRole.Sender)
		await this.senderRepository.createSender(createdUser.id)
		const newSender = await this.senderQueryRepository.getSenderByUserId(createdUser.id)

		await this.emailAdapter.sendEmailConfirmationMessage(createdUser.email, createdUser.emailConfirmationCode!)

		return newSender
	}
}
