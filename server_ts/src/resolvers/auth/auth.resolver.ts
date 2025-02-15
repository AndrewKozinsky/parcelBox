import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'
import { books } from '../../db/db'
import { Admin } from './auth.schema'
import { RegisterAdminInput } from './dto/registerAdmin.input'

@Resolver(() => Admin)
export class AuthResolver {
	@Mutation(() => Admin, { name: 'registerAdmin' })
	registerAdmin(@Args('input') registerAdminInput: RegisterAdminInput) {
		const newAdmin: Admin = {
			id: Math.round(Math.random() * 100),
			email: registerAdminInput.email,
			name: registerAdminInput.name,
			password: registerAdminInput.password,
		}

		return newAdmin
	}
}
