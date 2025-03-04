import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ParcelBoxTypeOutModel {
	@Field(() => Int)
	id: number

	@Field(() => String)
	name: string
}
