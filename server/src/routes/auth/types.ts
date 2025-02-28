import { createUnionType } from '@nestjs/graphql'
import { AdminOutModel } from '../../models/admin/admin.out.model'
import { SenderOutModel } from '../../models/sender/sender.out.model'

export const AdminOrSender = createUnionType({
	name: 'AdminOrSender',
	types: () => [SenderOutModel, AdminOutModel] as const,
	resolveType(value) {
		if ('balance' in value) {
			return SenderOutModel
		}

		return AdminOutModel
	},
})
