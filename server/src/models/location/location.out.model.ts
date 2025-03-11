import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class LocationOutModel {
	@Field(() => Int)
	id: number

	@Field(() => String, { nullable: true })
	address?: null | string

	@Field(() => [Int], { nullable: true })
	businessDays?: null | number[]

	@Field(() => String, { nullable: true })
	businessTimeFrom?: null | string

	@Field(() => String, { nullable: true })
	businessTimeTo?: null | string
}
