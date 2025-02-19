import { UserQueryRepository } from '../../src/repo/user.queryRepository'

export const defAdminEmail = 'admin@email.com'
export const defAdminPassword = 'adminPassword'

export const defSenderEmail = 'sender@email.com'
export const defSenderPassword = 'senderPassword'

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

export async function isUserExists(userQueryRepository: UserQueryRepository, userId: number) {
	const createdUser = await userQueryRepository.getUserById(userId)
	expect(createdUser).toBeTruthy()
}
