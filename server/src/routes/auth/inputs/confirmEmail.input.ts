import { Field, InputType } from '@nestjs/graphql'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'

@InputType()
export class ConfirmEmailInput {
	@Field({ description: 'User email' })
	@DtoFieldDecorators('code', bdConfig.User.dbFields.email_confirmation_code, { required: true })
	code: string
}
