import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Book {
	@Field(() => ID)
	id: number

	@Field()
	title: string

	@Field(() => Int, { nullable: true })
	price?: number
}
