import RouteNames from '../../src/infrastructure/routeNames'

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
			  accessToken
			  user {
				  id
				  email
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
	},
}
