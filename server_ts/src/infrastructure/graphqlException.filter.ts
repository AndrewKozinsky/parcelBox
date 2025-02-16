import { BadRequestException, Catch, ExceptionFilter } from '@nestjs/common'
import { GraphQLError } from 'graphql'

@Catch(BadRequestException)
export class GraphQLValidationFilter implements ExceptionFilter {
	catch(exception: BadRequestException) {
		const response = exception.getResponse()

		const responseMessage = [
			{ message: 'email must be an email', field: 'email' },
			{
				message: 'password must be longer than or equal to 4 characters',
				field: 'password',
			},
		]

		if (typeof response == 'object' && 'message' in response) {
			return new GraphQLError('Wrong input data', {
				extensions: {
					fields: this.convertErrorsArrToErrorsObj(response.message as any),
				},
			})
		}

		return new GraphQLError('My unknown err')
	}

	convertErrorsArrToErrorsObj(originalMessages: { message: string; field: string }[]): Record<string, string[]> {
		const result: Record<string, string[]> = {}

		originalMessages.forEach((messageObj) => {
			if (!result[messageObj.field]) {
				result[messageObj.field] = []
			}

			result[messageObj.field].push(messageObj.message)
		})

		return result
	}
}

// Type of GraphQL error answer.
// For illustrative purposes.
type ErrorsObj = {
	errors: GQLError[]
	data: null
}

type GQLError = {
	message: string
	inputData?: GQLInputError[]
}

type GQLInputError = {
	message: string
	field: string
}
