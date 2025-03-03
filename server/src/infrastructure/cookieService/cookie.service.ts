import { Injectable } from '@nestjs/common'
import { CookieOptions, Request, Response } from 'express'
import { MainConfigService } from '../config/mainConfig.service'

@Injectable()
export class CookieService {
	constructor(private mainConfig: MainConfigService) {}

	getCookieInRequest(req: Request, type: 'refreshToken' | 'accessToken') {
		if (!req.cookies) return ''

		let tokenName = ''
		if (type === 'refreshToken') {
			tokenName = this.mainConfig.get().refreshToken.name
		} else if (type === 'accessToken') {
			tokenName = this.mainConfig.get().accessToken.name
		}

		return req.cookies[tokenName]
	}

	setRefreshTokenInCookie(res: Response, refreshTokenStr: string) {
		const cookieOptions = this.getCookieOptions(this.mainConfig.get().refreshToken.lifeDurationInMs)

		res.cookie(this.mainConfig.get().refreshToken.name, refreshTokenStr, cookieOptions)
	}

	setAccessTokenInCookie(res: Response, accessTokenStr: string) {
		const cookieOptions = this.getCookieOptions(this.mainConfig.get().accessToken.lifeDurationInMs)

		res.cookie(this.mainConfig.get().accessToken.name, accessTokenStr, cookieOptions)
	}

	getCookieOptions(maxAge: number): CookieOptions {
		const sameSite = this.mainConfig.get().mode === 'development' ? 'lax' : 'none'
		const secure = this.mainConfig.get().mode !== 'development'

		return {
			maxAge,
			httpOnly: false,
			secure,
			sameSite,
			path: '/',
		}
	}

	addExpiredCookieInRes(res: Response, cookieName: string) {
		const cookieOptions = this.getCookieOptions(-1)

		res.cookie(cookieName, '123', cookieOptions)
	}
}
