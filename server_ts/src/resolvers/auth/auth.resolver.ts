import { Args, createUnionType, Mutation, Resolver } from '@nestjs/graphql'
import { Admin, AdminError } from './auth.schema'
import { RegisterAdminInput } from './dto/registerAdmin.input'

const RegisterAdminResponse = createUnionType({
	name: 'RegisterAdminResponse',
	types: () => [Admin, AdminError] as const,
	resolveType(value) {
		if ('isError' in value) {
			return AdminError
		}

		return Admin
	},
})

@Resolver()
export class AuthResolver {
	@Mutation(() => RegisterAdminResponse, { name: 'registerAdmin' })
	registerAdmin(@Args('input') input: RegisterAdminInput) {
		try {
			const newAdmin: Admin = {
				id: 2,
				name: input.name,
				email: input.email,
				password: input.password,
			}

			return newAdmin
		} catch (err: unknown) {
			return {
				isError: true,
				errorMessage: 'error',
			} satisfies AdminError
		}
	}
}
