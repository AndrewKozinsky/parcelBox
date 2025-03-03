import RouteNames from '../../infrastructure/routeNames'

export const queries = {
	auth: {
		registerAdmin(props: { email: string; password: string }) {
			return `mutation {
			  ${RouteNames.AUTH.REGISTER_ADMIN}(input: {
				email: "${props.email}",
				password: "${props.password}"
			  }) {
				id
				email
				role
			  }
			}`
		},
		registerSender(props: { email: string; password: string }) {
			return `mutation {
			  ${RouteNames.AUTH.REGISTER_SENDER}(input: {
				email: "${props.email}",
				password: "${props.password}"
			  }) {
				id
				email
				firstName
				lastName
				passportNum
				balance
				active
				role
			  }
			}`
		},
		confirmEmail(code: string) {
			return `query {
				${RouteNames.AUTH.CONFIRM_EMAIL}(
					input: {
						code: "${code}",
					}
				)
			}`
		},
		login(props: { email: string; password: string }) {
			return `mutation {
			  ${RouteNames.AUTH.LOGIN}(
				input: {
				  email: "${props.email}",
				  password: "${props.password}"
				}
			) {
			  ... on AdminOutModel {
					id
					email
					role
				}
				... on SenderOutModel {
					id
					email
					firstName
					lastName
					passportNum
					balance
					active
					role
				}
			  }
			}`
		},
		resendConfirmationEmail(email: string) {
			return `mutation {
			  ${RouteNames.AUTH.RESEND_CONFIRMATION_EMAIL}(
				input: {
				  email: "${email}",
				}
				)
			}`
		},
		logout() {
			return `mutation {
			  ${RouteNames.AUTH.LOGOUT}
			}`
		},
		getNewAccessAndRefreshTokens() {
			return `mutation {
			  ${RouteNames.AUTH.GET_NEW_ACCESS_AND_REFRESH_TOKENS}
			}`
		},
		getMe() {
			return `query {
			  ${RouteNames.AUTH.GET_ME} {
				... on AdminOutModel {
					id
					email
					role
				}
				... on SenderOutModel {
					id
					email
					firstName
					lastName
					passportNum
					balance
					active
					role
				}
			  }
			}`
		},
	},
}
