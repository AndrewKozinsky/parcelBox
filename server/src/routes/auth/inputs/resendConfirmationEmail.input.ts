import { Field, InputType } from '@nestjs/graphql'
import { MinLength } from 'class-validator'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'

@InputType()
export class ResendConfirmationEmailInput {
	@Field({ description: 'User email' })
	@DtoFieldDecorators('email', bdConfig.User.dbFields.email)
	email: string
}
