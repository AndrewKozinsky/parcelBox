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
	parcelBoxType: {
		create(props: { name: string }) {
			return `mutation {
			  ${RouteNames.PARCEL_BOX_TYPE.CREATE}(input: {
				name: "${props.name}",
			  }) {
				id
				name
				cellTypes {
					id
					name
					width
					height
					depth
					parcelBoxTypeId
				}
			  }
			}`
		},
		getAll() {
			return `query {
			  ${RouteNames.PARCEL_BOX_TYPE.GET_ALL} {
				id
				name
				cellTypes {
					id
					name
					width
					height
					depth
					parcelBoxTypeId
				}
			  }
			}`
		},
	},
	cellType: {
		create(props: { name: string; width: number; height: number; depth: number; parcelBoxTypeId: number }) {
			return `mutation {
			  ${RouteNames.CELL_TYPE.CREATE}(input: {
				name: "${props.name}",
				width: ${props.width},
				height: ${props.height},
				depth: ${props.depth},
				parcelBoxTypeId: ${props.parcelBoxTypeId},
			  }) {
				id
				name
				width
				height
				depth
				parcelBoxTypeId
			  }
			}`
		},
	},
	parcelBox: {
		create(props: {
			parcelBoxTypeId: number
			address?: string
			businessDays?: number[]
			businessTimeFrom?: string
			businessTimeTo?: string
		}) {
			const { parcelBoxTypeId, address, businessDays, businessTimeFrom, businessTimeTo } = props

			return `mutation {
			  ${RouteNames.PARCEL_BOX.CREATE}(input: {
				parcelBoxTypeId: ${parcelBoxTypeId},
				${address ? `address: "${address}",` : ''}
				${businessDays ? `businessDays: ${businessDays},` : ''}
				${businessTimeFrom ? `businessTimeFrom: "${businessTimeFrom}",` : ''}
				${businessTimeTo ? `businessTimeTo: "${businessTimeTo}"` : ''}
			  }) {
				id
				parcelBoxTypeId
				parcelBoxTypeName
				createdAt
				cells {
					id
					name
					cellTypeId
					parcelBoxId
					width
					height
					depth
				}
				location {
					id
					address
					businessDays
					businessTimeFrom
					businessTimeTo
				}
			  }
			}`
		},
		getMine() {
			return `query {
			  ${RouteNames.PARCEL_BOX.GET_MINE} {
				id
				parcelBoxTypeId
				parcelBoxTypeName
				createdAt
				cells {
					id
					name
					cellTypeId
					parcelBoxId
					width
					height
					depth
				}
				location {
					id
					address
					businessDays
					businessTimeFrom
					businessTimeTo
				}
			  }
			}`
		},
	},
	helper: {
		getAddressSuggestions(address: string) {
			return `query {
			  ${RouteNames.HELPER.ADDRESS_SUGGESTIONS} (input: {
			  	address: "${address}"
			  })
			}`
		},
	},
}
