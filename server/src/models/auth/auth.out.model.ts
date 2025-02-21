import { Field, ObjectType } from '@nestjs/graphql'
import { UserOutModel } from '../user/user.out.model'

@ObjectType()
export class LoginOutModel {
	@Field(() => String)
	accessToken: string
	@Field(() => UserOutModel)
	user: UserOutModel
}

export type DeviceTokenOutModel = {
	issuedAt: string
	deviceIP: string
	deviceId: string
	deviceName: string
	userId: number
}
