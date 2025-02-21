import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { MainConfigService } from '../../config/mainConfig.service'
import { UserRepository } from '../../repo/user.repository'
import { JwtAdapterService } from '../jwtAdapter/jwtAdapter.service'

@Injectable()
export class SetUserIntoReqMiddleware implements NestMiddleware {
	constructor(
		private jwtAdapter: JwtAdapterService,
		private userRepository: UserRepository,
		private mainConfig: MainConfigService,
	) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const accessTokenName = this.mainConfig.get().accessToken.name

		const accessTokenCookieStr = req.cookies[accessTokenName]
		if (!accessTokenCookieStr) {
			next()
			return
		}

		const token = getBearerTokenFromStr(accessTokenCookieStr)
		if (!token) {
			next()
			return
		}

		const userId = this.jwtAdapter.getUserIdByAccessTokenStr(token)
		if (!userId) {
			next()
			return
		}

		req.user = await this.userRepository.getUserById(userId)
		next()
	}
}

function getBearerTokenFromStr(authorizationHeader: string) {
	const [authType, token] = authorizationHeader.split(' ')

	if (authType !== 'Bearer' || !token) {
		return false
	}

	return token
}
