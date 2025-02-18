import { GraphQLError } from 'graphql'

export class CustomGraphQLError extends GraphQLError {
	constructor(message: string, code: number) {
		super(message, {
			extensions: { code }, // Add the `code` property to the `extensions` field
		})
	}
}
