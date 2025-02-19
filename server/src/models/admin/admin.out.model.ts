import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AdminOutModel {
	@Field(() => Int)
	id: number

	@Field(() => String)
	email: string
}
