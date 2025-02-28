import { Field, Int, ObjectType } from '@nestjs/graphql'
import { USER_ROLE } from '../common'

@ObjectType()
export class AdminOutModel {
	@Field(() => Int)
	id: number

	@Field(() => String)
	email: string

	@Field(() => USER_ROLE)
	role: 'admin'
}
