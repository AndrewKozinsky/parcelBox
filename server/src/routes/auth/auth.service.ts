import { Injectable } from '@nestjs/common'
import { addDays } from 'date-fns'
import { CookieOptions, Response } from 'express'
import { MainConfigService } from '../../config/mainConfig.service'

@Injectable()
export class AuthService {
	constructor(private mainConfig: MainConfigService) {}

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
