import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customGraphQLError'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { JwtAdapterService } from '../../infrastructure/jwtAdapter/jwtAdapter.service'
import { DeviceTokenOutModel } from '../../models/auth/auth.out.model'
import { DevicesRepository } from '../../repo/devices.repository'
import { UserRepository } from '../../repo/user.repository'

export class GenerateAccessAndRefreshTokensCommand implements ICommand {
	constructor(public currentDeviceRefreshToken: DeviceTokenOutModel) {}
}

@CommandHandler(GenerateAccessAndRefreshTokensCommand)
export class GenerateAccessAndRefreshTokensHandler implements ICommandHandler<GenerateAccessAndRefreshTokensCommand> {
	constructor(
		private userRepository: UserRepository,
		private securityRepository: DevicesRepository,
		private jwtAdapter: JwtAdapterService,
	) {}

	async execute(command: GenerateAccessAndRefreshTokensCommand) {
		const { currentDeviceRefreshToken } = command

		if (!currentDeviceRefreshToken) {
			throw new CustomGraphQLError(errorMessage.refreshTokenIsNotValid, ErrorCode.BadRequest_400)
		}

		// Throw en error if the user was removed
		const user = await this.userRepository.getUserById(currentDeviceRefreshToken.userId)
		if (!user) {
			throw new CustomGraphQLError(errorMessage.userNotFound, ErrorCode.BadRequest_400)
		}

		await this.securityRepository.updateDeviceRefreshTokenDate(currentDeviceRefreshToken.deviceId)

		const newRefreshTokenStr = this.jwtAdapter.createRefreshTokenStr({
			deviceId: currentDeviceRefreshToken.deviceId,
		})

		return {
			newAccessToken: this.jwtAdapter.createAccessTokenStr(currentDeviceRefreshToken.userId),
			newRefreshTokenStr,
		}
	}
}
