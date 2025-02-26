import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customGraphQLError'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { SenderQueryRepository } from '../../repo/sender.queryRepository'
import { UserQueryRepository } from '../../repo/user.queryRepository'

export class GetMeCommand implements ICommand {
	constructor(public userId: number) {}
}

@CommandHandler(GetMeCommand)
export class GetMeHandler implements ICommandHandler<GetMeCommand> {
	constructor(
		private userQueryRepository: UserQueryRepository,
		private senderQueryRepository: SenderQueryRepository,
	) {}

	async execute(command: GetMeCommand) {
		const { userId } = command

		const existingUser = await this.userQueryRepository.getUserById(userId)
		if (!existingUser) {
			throw new CustomGraphQLError(errorMessage.userNotFound, ErrorCode.BadRequest_400)
		}

		if (existingUser.role === 'admin') {
			return existingUser
		}

		const existingSender = await this.senderQueryRepository.getSenderByUserId(userId)
		if (!existingSender) {
			throw new CustomGraphQLError(errorMessage.userNotFound, ErrorCode.BadRequest_400)
		}

		return existingSender
	}
}
