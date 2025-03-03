import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customErrors'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { AdminQueryRepository } from '../../repo/admin.queryRepository'
import { SenderQueryRepository } from '../../repo/sender.queryRepository'
import { UserQueryRepository } from '../../repo/user.queryRepository'

export class GetAdminOrSenderByIdCommand implements ICommand {
	constructor(public userId: number) {}
}

@CommandHandler(GetAdminOrSenderByIdCommand)
export class GetAdminOrSenderByIdHandler implements ICommandHandler<GetAdminOrSenderByIdCommand> {
	constructor(
		private userQueryRepository: UserQueryRepository,
		private adminQueryRepository: AdminQueryRepository,
		private senderQueryRepository: SenderQueryRepository,
	) {}

	async execute(command: GetAdminOrSenderByIdCommand) {
		const { userId } = command

		const existingUser = await this.userQueryRepository.getUserById(userId)
		if (!existingUser) {
			throw new CustomGraphQLError(errorMessage.userNotFound, ErrorCode.BadRequest_400)
		}

		if (existingUser.role === 'admin') {
			return await this.adminQueryRepository.getAdminByUserId(userId)
		} else if (existingUser.role === 'sender') {
			return await this.senderQueryRepository.getSenderByUserId(userId)
		}
	}
}
