import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'
import { addMilliseconds } from 'date-fns'
import { MainConfigService } from '../../config/mainConfig.service'
import { DeviceTokenServiceModel } from '../../models/security/security.service.model'
import { createUniqString } from '../../utils/stringUtils'

@Injectable()
export class JwtAdapterService {
	constructor(private mainConfig: MainConfigService) {}

	createAccessTokenStr(userId: number) {
		return jwt.sign({ userId, expiresInSeconds: this.getExpiresInSeconds() }, this.mainConfig.get().jwt.secret)
	}

	createRefreshTokenStr(deviceId: string): string {
		return jwt.sign({ deviceId, expiresInSeconds: this.getExpiresInSeconds() }, this.mainConfig.get().jwt.secret)
	}

	getExpiresInSeconds() {
		const expiresInMs = this.mainConfig.get().refreshToken.lifeDurationInMs
		const expiresInSeconds = expiresInMs / 1000
		return expiresInSeconds + 's'
	}

	createDeviceRefreshToken(userId: number, deviceIP: string, deviceName: string): DeviceTokenServiceModel {
		const deviceId = createUniqString()

		const expirationDate = addMilliseconds(new Date(), this.mainConfig.get().refreshToken.lifeDurationInMs)
		expirationDate.setMilliseconds(0)

		return {
			issuedAt: new Date().toISOString(),
			expirationDate: expirationDate.toISOString(),
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
	isRefreshTokenStrValid(refreshTokenStr: string = '') {
		try {
			const tokenPayload = jwt.verify(refreshTokenStr, this.mainConfig.get().jwt.secret)
			return true
		} catch (error) {
			console.log(error)
			return false
		}
	}

	getTokenStrExpirationDate(tokenStr: string): null | Date {
		try {
			const tokenPayload = jwt.decode(tokenStr)

			if (!tokenPayload || typeof tokenPayload === 'string') {
				return null
			}

			// @ts-ignore
			return new Date(tokenPayload.exp * 1000)
		} catch (error) {
			console.log(error)
			return null
		}
	}
}
