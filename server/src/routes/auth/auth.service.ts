import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import { MainConfigService } from '../../config/mainConfig.service'

@Injectable()
export class AuthService {
	constructor(private mainConfig: MainConfigService) {}

	setRefreshTokenInCookie(res: Response, refreshTokenStr: string) {
		res.cookie(this.mainConfig.get().refreshToken.name, refreshTokenStr, {
			maxAge: this.mainConfig.get().refreshToken.lifeDurationInMs,
			httpOnly: false,
			secure: true,
			sameSite: 'none',
		})
	}

	setAccessTokenInCookie(res: Response, accessTokenStr: string) {
		res.cookie(this.mainConfig.get().accessToken.name, accessTokenStr, {
			maxAge: this.mainConfig.get().accessToken.lifeDurationInMs,
			httpOnly: false,
			secure: true,
			sameSite: 'none',
		})
	}
}
