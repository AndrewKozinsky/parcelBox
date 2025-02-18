import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Admin {
	@Field(() => ID)
	id: number

	@Field(() => String)
	email: string

	@Field(() => String)
	password: string
}
