import { CommandBus, CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customGraphQLError'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { JwtAdapterService } from '../../infrastructure/jwtAdapter/jwtAdapter.service'
import { LoginInputModel } from '../../models/auth/auth.input.model'
import { UserQueryRepository } from '../../repo/user.queryRepository'
import { UserRepository } from '../../repo/user.repository'
import { CreateRefreshTokenCommand } from './CreateRefreshToken.command'

export class LoginCommand implements ICommand {
	constructor(
		public loginInput: LoginInputModel,
		public clientIP: string,
		public clientName: string,
	) {}
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
	constructor(
		private userRepository: UserRepository,
		private userQueryRepository: UserQueryRepository,
		private commandBus: CommandBus,
		private jwtAdapter: JwtAdapterService,
	) {}

	async execute(command: LoginCommand) {
		const { loginInput, clientIP, clientName } = command

		const user = await this.userRepository.getUserByEmailAndPassword(loginInput.email, loginInput.password)

		if (!user) {
			throw new CustomGraphQLError(errorMessage.emailOrPasswordDoNotMatch, ErrorCode.BadRequest_400)
		}

		if (!user.isEmailConfirmed) {
			throw new CustomGraphQLError(errorMessage.emailIsNotConfirmed, ErrorCode.BadRequest_400)
		}

		const refreshTokenStr = await this.commandBus.execute(
			new CreateRefreshTokenCommand(user.id, clientIP, clientName),
		)

		const accessTokenStr = this.jwtAdapter.createAccessTokenStr(user.id)

		const outUser = await this.userQueryRepository.getUserById(user.id)

		return {
			refreshTokenStr,
			accessTokenStr,
			user: outUser!,
		}
	}
}
