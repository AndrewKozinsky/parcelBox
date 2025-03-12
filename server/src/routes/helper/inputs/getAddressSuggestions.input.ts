import { Field, InputType, Int } from '@nestjs/graphql'
import { bdConfig } from '../../../db/dbConfig/dbConfig'
import { DtoFieldDecorators } from '../../../db/dtoFieldDecorators'

@InputType()
export class GetAddressSuggestionsInput {
	@Field(() => String, { description: 'Address' })
	@DtoFieldDecorators('address', bdConfig.Location.dtoProps.addressQuery)
	address: string
}
