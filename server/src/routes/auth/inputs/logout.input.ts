import { Field, InputType } from '@nestjs/graphql'
import { MinLength } from 'class-validator'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'

// DELETE
/*@InputType()
export class LogoutInput {
	@Field({ description: 'Refresh token' })
	@DtoFieldDecorators('email', bdConfig.User.dbFields.email)
	refreshToken: string
}*/
