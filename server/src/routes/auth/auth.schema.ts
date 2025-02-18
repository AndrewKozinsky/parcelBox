import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Admin {
	@Field(() => Int)
	id: number

	@Field(() => String)
	email: string
}

@ObjectType()
export class Sender {
	@Field(() => Int)
	id: number

	@Field(() => String)
	email: string

	@Field(() => String, { nullable: true })
	firstName: string

	@Field(() => String, { nullable: true })
	lastName: string

	@Field(() => String, { nullable: true })
	passportNum: string

	@Field(() => Int)
	balance: number

	@Field(() => Boolean)
	active: boolean
}
