import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customGraphQLError'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { JwtAdapterService } from '../../infrastructure/jwtAdapter/jwtAdapter.service'
import { DevicesRepository } from '../../repo/devices.repository'

export class LogoutCommand {
	constructor(public readonly refreshToken: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
	constructor(
		private devicesRepository: DevicesRepository,
		private jwtAdapter: JwtAdapterService,
	) {}

	async execute(command: LogoutCommand) {
		const { refreshToken } = command

		const refreshTokenInDb = await this.devicesRepository.getDeviceRefreshTokenByTokenStr(refreshToken)

		if (!refreshTokenInDb || !this.jwtAdapter.getRefreshTokenFromStr(refreshToken)) {
			throw new CustomGraphQLError(errorMessage.refreshTokenIsNotValid, ErrorCode.BadRequest_400)
		}

		await this.devicesRepository.deleteRefreshTokenByDeviceId(refreshTokenInDb.deviceId)
	}
}
