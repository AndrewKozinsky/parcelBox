import { UsePipes, ValidationPipe } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import RouteNames from '../../infrastructure/routeNames'
import { Admin } from './auth.schema'
import { RegisterAdminInput } from './dto/registerAdmin.input'

@Resolver()
export class AuthResolver {
	@Mutation(() => Admin, { name: RouteNames.AUTH.REGISTER_ADMIN })
	@UsePipes(new ValidationPipe({ transform: true }))
	registerAdmin(@Args('input') input: RegisterAdminInput) {
		const newAdmin: Admin = {
			id: 2,
			name: input.name,
			email: input.email,
			password: input.password,
		}

		return newAdmin
	}
}
