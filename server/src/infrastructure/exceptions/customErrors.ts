import { GraphQLError } from 'graphql'

export class CustomGraphQLError extends GraphQLError {
	constructor(message: string, code: number) {
		super(message, {
			extensions: { code }, // Add the `code` property to the `extensions` field
		})
	}
}

export class CustomRestError extends Error {
	public code: number

	constructor(message: string, code: number) {
		super(message)
		this.code = code
		this.name = this.constructor.name // Set the name to the class name

		// Ensure the correct prototype chain
		Object.setPrototypeOf(this, CustomRestError.prototype)
	}
}
