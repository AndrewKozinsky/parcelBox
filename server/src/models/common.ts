import { registerEnumType } from '@nestjs/graphql'

export enum USER_ROLE {
	admin = 'admin',
	sender = 'sender',
}

// Register the enum type for GraphQL
registerEnumType(USER_ROLE, {
	name: 'USER_ROLE', // Name in the GraphQL schema
	description: 'User roles in the system', // Optional description
})
