import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { JwtAdapterService } from '../../infrastructure/jwtAdapter/jwtAdapter.service'
import { DevicesRepository } from '../../repo/devices.repository'

export class CreateRefreshTokenCommand {
	constructor(
		public userId: number,
		public clientIP: string,
		public clientName: string,
	) {}
}

@CommandHandler(CreateRefreshTokenCommand)
export class CreateRefreshTokenHandler implements ICommandHandler<CreateRefreshTokenCommand> {
	constructor(
		private jwtAdapter: JwtAdapterService,
		private devicesRepository: DevicesRepository,
	) {}

	async execute(command: CreateRefreshTokenCommand) {
		const { userId, clientIP, clientName } = command

		const newDeviceRefreshToken = this.jwtAdapter.createDeviceRefreshToken(userId, clientIP, clientName)

		await this.devicesRepository.insertDeviceRefreshToken(newDeviceRefreshToken)

		return this.jwtAdapter.createRefreshTokenStr(newDeviceRefreshToken.deviceId)
	}
}
