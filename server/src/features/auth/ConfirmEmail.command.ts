import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customErrors'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { ConfirmEmailInputModel } from '../../models/auth/auth.input.model'
import { UserRepository } from '../../repo/user.repository'

export class ConfirmEmailCommand implements ICommand {
	constructor(public createAdminInput: ConfirmEmailInputModel) {}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailHandler implements ICommandHandler<ConfirmEmailCommand> {
	constructor(private userRepository: UserRepository) {}

	async execute(command: ConfirmEmailCommand) {
		const { createAdminInput } = command

		const user = await this.userRepository.getUserByConfirmationCode(createAdminInput.code)
		console.log({ user })

		if (!user) {
			throw new CustomGraphQLError(errorMessage.emailConfirmationCodeNotFound, ErrorCode.BadRequest_400)
		}

		if (new Date(user.confirmationCodeExpirationDate!) <= new Date()) {
			throw new CustomGraphQLError(errorMessage.emailConfirmationCodeIsExpired, ErrorCode.BadRequest_400)
		}

		await this.userRepository.makeEmailVerified(user.id)
		return true
	}
}
