import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserOutModel {
	@Field(() => Int)
	id: number
	@Field(() => String)
	email: string
}
