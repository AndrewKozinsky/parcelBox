import { Field, InputType } from '@nestjs/graphql'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'

@InputType()
export class CreateAdminInput {
	@Field({ description: 'User email' })
	@DtoFieldDecorators('email', bdConfig.User.dbFields.email)
	email: string
}
