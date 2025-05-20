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
		// console.log('Middleware - Access Token:', accessTokenStr ? 'Present' : 'Missing')

		if (!accessTokenStr) {
			// console.log('Middleware - No access token found in cookies')
			next()
			return
		}

		const isTokenValid = this.jwtAdapter.verifyTokenFromStr(accessTokenStr)
		// console.log('Middleware - Token validation:', isTokenValid ? 'Valid' : 'Invalid')

		if (!isTokenValid) {
			// console.log('Middleware - Token verification failed')
			next()
			return
		}

		const userId = this.jwtAdapter.getUserIdByAccessTokenStr(accessTokenStr)
		// console.log('Middleware - User ID from token:', userId)

		if (!userId) {
			// console.log('Middleware - No user ID found in token')
			next()
			return
		}

		req.user = await this.userRepository.getUserById(userId)
		// console.log('Middleware - User found in database:', req.user ? 'Yes' : 'No')
		next()
	}
}
