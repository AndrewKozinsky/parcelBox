import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, MaxLength, MinLength } from 'class-validator'

@InputType()
export class RegisterAdminInput {
	@Field({ description: 'User name' })
	@MinLength(4)
	name: string

	@Field({ description: 'User email' })
	@IsEmail()
	email: string

	@Field({ description: 'User password' })
	@MinLength(4)
	@MaxLength(50)
	password: string
}
