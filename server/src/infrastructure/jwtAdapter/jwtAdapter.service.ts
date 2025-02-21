import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import * as dateFns from 'date-fns'
import { MainConfigService } from '../../config/mainConfig.service'
import { DeviceTokenServiceModel } from '../../models/security/security.service.model'
import { createUniqString } from '../../utils/stringUtils'

@Injectable()
export class JwtAdapterService {
	constructor(private mainConfig: MainConfigService) {}

	createAccessTokenStr(userId: number) {
		return jwt.sign({ userId }, this.mainConfig.get().jwt.secret)
	}

	createRefreshTokenStr(deviceId: string): string {
		const issuedAt = new Date().toISOString()
		return jwt.sign({ deviceId, issuedAt }, this.mainConfig.get().jwt.secret)
	}

	getExpiresInSeconds() {
		const expiresInMs = this.mainConfig.get().refreshToken.lifeDurationInMs
		const expiresInSeconds = expiresInMs / 1000
		return expiresInSeconds
	}

	createDeviceRefreshToken(userId: number, deviceIP: string, deviceName: string): DeviceTokenServiceModel {
		const deviceId = createUniqString()

		const expirationDate = dateFns.addMilliseconds(new Date(), this.mainConfig.get().refreshToken.lifeDurationInMs)
		expirationDate.setMilliseconds(0)

		return {
			issuedAt: new Date().toISOString(),
			deviceIP,
			deviceId,
			deviceName,
			userId,
		}
	}

	getUserIdByAccessTokenStr(accessToken: string): null | number {
		try {
			const result: any = jwt.verify(accessToken, this.mainConfig.get().jwt.secret)
			return result.userId
		} catch (error) {
			return null
		}
	}

	getRefreshTokenDataFromTokenStr(refreshTokenStr: string) {
		try {
			const payload = jwt.verify(refreshTokenStr, this.mainConfig.get().jwt.secret)
			return payload as { deviceId: string }
		} catch (error) {
			console.log(error)
			return null
		}
	}

	// Check if token string is valid
	verifyRefreshTokenFromStr(refreshTokenStr: string = '') {
		try {
			return jwt.verify(refreshTokenStr, this.mainConfig.get().jwt.secret)
		} catch (error) {
			console.log(error)
			return false
		}
	}

	// Check if token string is valid
	getRefreshTokenFromStr(refreshTokenStr: string = '') {
		try {
			return jwt.decode(refreshTokenStr)
		} catch (error) {
			console.log(error)
			return false
		}
	}

	getTokenStrExpirationDate(tokenStr: string): null | Date {
		try {
			const tokenPayload = jwt.decode(tokenStr)

			if (!tokenPayload || typeof tokenPayload === 'string' || !tokenPayload.iat) {
				return null
			}

			const issuedAtDate = new Date(tokenPayload.iat * 1000)

			const tokenLifetimeInMs = this.mainConfig.get().refreshToken.lifeDurationInMs
			return dateFns.addSeconds(issuedAtDate, tokenLifetimeInMs)
		} catch (error) {
			console.log(error)
			return null
		}
	}

	getTokenExpirationDate(token: null | jwt.JwtPayload): null | Date {
		try {
			if (!token || !token.iat) {
				return null
			}

			const issuedAtDate = new Date(token.iat * 1000)

			const tokenLifetimeInMs = this.mainConfig.get().refreshToken.lifeDurationInMs
			return dateFns.addSeconds(issuedAtDate, tokenLifetimeInMs)
		} catch (error) {
			console.log(error)
			return null
		}
	}
}
