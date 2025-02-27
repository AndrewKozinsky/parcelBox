import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
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
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext().req

		const regRefreshTokenStr = this.browserService.getRefreshTokenStrFromReq(request)
		if (!regRefreshTokenStr || !this.jwtAdapter.verifyTokenFromStr(regRefreshTokenStr)) {
			throw new CustomGraphQLError(errorMessage.refreshTokenIsNotValid, ErrorCode.Unauthorized_401)
		}

		const reqRefreshToken = this.jwtAdapter.getRefreshTokenFromStr(regRefreshTokenStr)

		if (!reqRefreshToken || typeof reqRefreshToken === 'string') {
			throw new CustomGraphQLError(errorMessage.refreshTokenIsNotValid, ErrorCode.Unauthorized_401)
		}

		// Check reqRefreshToken expiration date
		const regRefreshTokenExpDate = this.jwtAdapter.getRefreshTokenExpirationDate(reqRefreshToken)
		if (!regRefreshTokenExpDate || +regRefreshTokenExpDate <= +new Date()) {
			throw new CustomGraphQLError(errorMessage.refreshTokenIsNotValid, ErrorCode.Unauthorized_401)
		}

		// Get refresh token from the database
		const dbRefreshToken = await this.securityRepository.getDeviceRefreshTokenByTokenStr(regRefreshTokenStr)
		if (!dbRefreshToken) {
			throw new CustomGraphQLError(errorMessage.refreshTokenIsNotValid, ErrorCode.Unauthorized_401)
		}

		// Check if dates in tokens are different
		if (reqRefreshToken!.issuedAt !== dbRefreshToken!.issuedAt) {
			throw new CustomGraphQLError(errorMessage.refreshTokenIsNotValid, ErrorCode.BadRequest_400)
		}

		request.deviceRefreshToken = dbRefreshToken
		return true
	}
}
