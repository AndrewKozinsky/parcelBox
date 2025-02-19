import { Field, InputType } from '@nestjs/graphql'
import { MinLength } from 'class-validator'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'

@InputType()
export class CreateSenderInput {
	@Field({ description: 'User email' })
	@DtoFieldDecorators('email', bdConfig.User.dbFields.email)
	email: string

	@Field({ description: 'User password' })
	@DtoFieldDecorators('email', bdConfig.User.dtoProps.password)
	password: string
}

@InputType()
export class ConfirmEmailInput {
	@Field({ description: 'User email' })
	@DtoFieldDecorators('code', bdConfig.User.dbFields.email_confirmation_code, { required: true })
	code: string
}
