import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { EmailAdapterService } from '../../infrastructure/emailAdapter/email-adapter.service'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customGraphQLError'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { UserRepository } from '../../repo/user.repository'
import { createUniqString } from '../../utils/stringUtils'

export class ResendConfirmationEmailCommand {
	constructor(public readonly email: string) {}
}

@CommandHandler(ResendConfirmationEmailCommand)
export class ResendConfirmationEmailHandler implements ICommandHandler<ResendConfirmationEmailCommand> {
	constructor(
		private userRepository: UserRepository,
		private emailAdapter: EmailAdapterService,
	) {}

	async execute(command: ResendConfirmationEmailCommand) {
		const { email } = command

		const user = await this.userRepository.getUserByEmail(email)

		if (!user) {
			throw new CustomGraphQLError(errorMessage.emailNotFound, ErrorCode.BadRequest_400)
		}

		if (user.isEmailConfirmed) {
			throw new CustomGraphQLError(errorMessage.emailIsAlreadyConfirmed, ErrorCode.BadRequest_400)
		}

		const confirmationCode = createUniqString()
		await this.userRepository.updateUser(user.id, {
			email_confirmation_code: confirmationCode,
		})

		this.emailAdapter.sendEmailConfirmationMessage(email, confirmationCode)

		return true
	}
}
