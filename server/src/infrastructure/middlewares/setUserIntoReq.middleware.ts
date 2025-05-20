import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { MainConfigService } from '../config/mainConfig.service'
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

		const accessTokenStr = req.cookies[accessTokenName]
		// console.log(req.cookies)
		// console.log({accessTokenStr})
		if (!accessTokenStr) {
			next()
			return
		}

		if (!this.jwtAdapter.verifyTokenFromStr(accessTokenStr)) {
			// console.log('45667890')
			next()
			return
		}


		const userId = this.jwtAdapter.getUserIdByAccessTokenStr(accessTokenStr)
		if (!userId) {
			next()
			return
		}

		req.user = await this.userRepository.getUserById(userId)
		console.log('REG.USER')
		console.log(req.user)
		next()
	}
}
