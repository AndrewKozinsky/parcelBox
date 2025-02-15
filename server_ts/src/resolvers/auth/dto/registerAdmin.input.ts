import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RegisterAdminInput {
	@Field({ description: 'User name' })
	name: string

	@Field({ description: 'User email' })
	email: string

	@Field({ description: 'User password' })
	password: string
}
