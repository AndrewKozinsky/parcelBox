import { Field, Int, ObjectType } from '@nestjs/graphql'
import { USER_ROLE } from '../../graphql'

@ObjectType()
export class UserOutModel {
	@Field(() => Int)
	id: number

	@Field(() => String)
	email: string

	@Field(() => USER_ROLE)
	role: 'admin' | 'sender'
}
