export const defAdminEmail = 'mail@email.com'
export const defAdminPassword = 'password'

type GraphQLErrorResponse = {
	errors: {
		message: string
		code: number
		fields?: Record<string, string[]>
	}[]
	data: null
}

export function extractErrObjFromResp(errResponse: GraphQLErrorResponse) {
	try {
		return errResponse.errors[0]
	} catch (err: unknown) {
		throw new Error('The response does not match to the schema of error')
	}
}
