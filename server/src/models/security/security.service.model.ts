export type DeviceTokenServiceModel = {
	issuedAt: string
	deviceIP: string
	deviceId: string
	deviceName: string
	userId: number
}

export type DeviceRefreshTokenServiceModel = {
	id: number
	issuedAt: string
	deviceIP: string
	deviceId: string
	deviceName: string
	userId: number
}
