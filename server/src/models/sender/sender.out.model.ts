import { Field, Int, ObjectType } from '@nestjs/graphql'
import { USER_ROLE } from '../common'

@ObjectType()
export class SenderOutModel {
	@Field(() => Int)
	id: number

	@Field(() => String)
	email: string

	@Field(() => String, { nullable: true })
	firstName: null | string

	@Field(() => String, { nullable: true })
	lastName: null | string

	@Field(() => String, { nullable: true })
	passportNum: null | string

	@Field(() => Int)
	balance: number

	@Field(() => Boolean)
	active: boolean

	@Field(() => USER_ROLE)
	role: 'sender'
}
