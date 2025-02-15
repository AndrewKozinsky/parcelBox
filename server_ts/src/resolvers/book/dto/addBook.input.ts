import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class AddBookInput {
	@Field()
	title: string

	@Field((type) => Int)
	price: number
}
