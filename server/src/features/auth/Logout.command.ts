import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Request } from 'express'
import { CookieService } from '../../infrastructure/cookieService/cookie.service'
import { JwtAdapterService } from '../../infrastructure/jwtAdapter/jwtAdapter.service'
import { DevicesRepository } from '../../repo/devices.repository'

export class LogoutCommand {
	constructor(public request: Request) {}
}

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
	constructor(
		private devicesRepository: DevicesRepository,
		private jwtAdapter: JwtAdapterService,
		private cookieService: CookieService,
	) {}

	async execute(command: LogoutCommand) {
		const { request } = command

		try {
			const regRefreshTokenStr = this.cookieService.getCookieInRequest(request, 'refreshToken')
			if (!regRefreshTokenStr || !this.jwtAdapter.verifyTokenFromStr(regRefreshTokenStr)) {
				return
			}

			const refreshTokenInDb = await this.devicesRepository.getDeviceRefreshTokenByTokenStr(regRefreshTokenStr)

			if (!refreshTokenInDb || !this.jwtAdapter.getRefreshTokenFromStr(regRefreshTokenStr)) {
				return
			}

			await this.devicesRepository.deleteRefreshTokenByDeviceId(refreshTokenInDb.deviceId)
		} catch (err: unknown) {
			console.log(err)
		}
	}
}
