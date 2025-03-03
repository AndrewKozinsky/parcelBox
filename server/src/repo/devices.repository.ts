import { Injectable } from '@nestjs/common'
import { DeviceToken } from '@prisma/client'
import { MainConfigService } from '../infrastructure/config/mainConfig.service'
import { PrismaService } from '../db/prisma.service'
import { JwtAdapterService } from '../infrastructure/jwtAdapter/jwtAdapter.service'
import { DeviceRefreshTokenServiceModel, DeviceTokenServiceModel } from '../models/security/security.service.model'

@Injectable()
export class DevicesRepository {
	constructor(
		private prisma: PrismaService,
		private jwtAdapter: JwtAdapterService,
		private mainConfig: MainConfigService,
	) {}

	async getDeviceRefreshTokenByTokenStr(tokenStr: string): Promise<null | DeviceTokenServiceModel> {
		try {
			const refreshTokenPayload = this.jwtAdapter.getRefreshTokenDataFromTokenStr(tokenStr)
			return this.getDeviceRefreshTokenByDeviceId(refreshTokenPayload!.deviceId)
		} catch (err: unknown) {
			return null
		}
	}

	async getDeviceRefreshTokenByDeviceId(deviceId: string): Promise<null | DeviceTokenServiceModel> {
		const token = await this.prisma.deviceToken.findFirst({
			where: { device_id: deviceId },
		})

		if (!token) return null

		return this.mapDbDeviceRefreshTokenToServiceDeviceRefreshToken(token)
	}

	/*async terminateAllDeviceRefreshTokensApartThis(currentDeviceId: string) {
		await this.prisma.deviceToken.deleteMany({
			where: { NOT: { device_id: currentDeviceId } },
		})
	}*/

	async deleteRefreshTokenByDeviceId(deviceId: string) {
		await this.prisma.deviceToken.deleteMany({
			where: { device_id: deviceId },
		})
	}

	async getDevicesByUserId(userId: number) {
		const userDevices = await this.prisma.deviceToken.findMany({
			where: { user_id: userId },
		})

		return userDevices.map(this.mapDbDeviceRefreshTokenToServiceDeviceRefreshToken)
	}

	/*async getUserDevicesByDeviceId(deviceId: string) {
		const userByDeviceToken = await this.prisma.deviceToken.findFirst({
			where: { device_id: deviceId },
		})

		if (!userByDeviceToken) {
			return null
		}

		const { user_id } = userByDeviceToken

		const userDevices = await this.prisma.deviceToken.findMany({
			where: { user_id },
		})

		if (!userDevices.length) {
			return null
		}

		return userDevices.map(this.mapDbDeviceRefreshTokenToServiceDeviceRefreshToken)
	}*/

	async insertDeviceRefreshToken(deviceRefreshToken: DeviceTokenServiceModel): Promise<DeviceTokenServiceModel> {
		const deviceToken = await this.prisma.deviceToken.create({
			data: {
				issued_at: deviceRefreshToken.issuedAt,
				user_id: deviceRefreshToken.userId,
				device_ip: deviceRefreshToken.deviceIP,
				device_id: deviceRefreshToken.deviceId,
				device_name: deviceRefreshToken.deviceName,
			},
		})

		return this.mapDbDeviceRefreshTokenToServiceDeviceRefreshToken(deviceToken)
	}

	async updateDeviceRefreshTokenDate(props: { deviceId: string; issuedAt: Date }) {
		const issuedAt = props.issuedAt.toISOString()

		this.prisma.deviceToken.updateMany({
			where: { device_id: props.deviceId },
			data: { issued_at: issuedAt },
		})
	}

	mapDbDeviceRefreshTokenToServiceDeviceRefreshToken(dbDevice: DeviceToken): DeviceRefreshTokenServiceModel {
		return {
			id: dbDevice.id,
			issuedAt: dbDevice.issued_at,
			deviceIP: dbDevice.device_ip,
			deviceId: dbDevice.device_id,
			deviceName: dbDevice.device_name,
			userId: dbDevice.user_id,
		}
	}
}
