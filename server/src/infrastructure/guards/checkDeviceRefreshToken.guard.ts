import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { DevicesRepository } from '../../repo/devices.repository'
import { BrowserService } from '../browserService/browser.service'
import { CustomGraphQLError } from '../exceptions/customGraphQLError'
import { ErrorCode } from '../exceptions/errorCode'
import { errorMessage } from '../exceptions/errorMessage'
import { JwtAdapterService } from '../jwtAdapter/jwtAdapter.service'

@Injectable()
export class CheckDeviceRefreshTokenGuard implements CanActivate {
	constructor(
		private browserService: BrowserService,
		private jwtAdapter: JwtAdapterService,
		private securityRepository: DevicesRepository,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		try {
			const refreshTokenStr = this.browserService.getRefreshTokenStrFromReq(request)

			if (!refreshTokenStr || !this.jwtAdapter.isRefreshTokenStrValid(refreshTokenStr)) {
				throw new CustomGraphQLError(errorMessage.refreshTokenIsNotValid, ErrorCode.Unauthorized_401)
			}

			// Check if refreshTokenStr has another expiration date
			const refreshTokenStrExpirationDate = this.jwtAdapter.getTokenStrExpirationDate(refreshTokenStr)

			const deviceRefreshToken = await this.securityRepository.getDeviceRefreshTokenByTokenStr(refreshTokenStr)

			if (!refreshTokenStrExpirationDate || !deviceRefreshToken) {
				throw new CustomGraphQLError(errorMessage.refreshTokenIsNotValid, ErrorCode.Unauthorized_401)
			}

			if (deviceRefreshToken!.expirationDate !== refreshTokenStrExpirationDate!.toISOString()) {
				throw new CustomGraphQLError(errorMessage.refreshTokenIsNotValid, ErrorCode.BadRequest_400)
			}

			request.deviceRefreshToken = deviceRefreshToken
			return true
		} catch (err: unknown) {
			throw new CustomGraphQLError(errorMessage.refreshTokenIsNotValid, ErrorCode.Unauthorized_401)
		}
	}
}
