import { createUnionType } from '@nestjs/graphql'
import { SenderOutModel } from '../../models/sender/sender.out.model'
import { UserOutModel } from '../../models/user/user.out.model'

export const GetMeResponse = createUnionType({
	name: 'GetMeResponse',
	types: () => [SenderOutModel, UserOutModel] as const,
	resolveType(value) {
		if ('balance' in value) {
			return SenderOutModel
		}

		return UserOutModel
	},
})
