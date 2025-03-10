import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string }
	String: { input: string; output: string }
	Boolean: { input: boolean; output: boolean }
	Int: { input: number; output: number }
	Float: { input: number; output: number }
	DateTime: { input: any; output: any }
}

export type AdminOrSender = AdminOutModel | SenderOutModel

export type AdminOutModel = {
	__typename?: 'AdminOutModel'
	email: Scalars['String']['output']
	id: Scalars['Int']['output']
	role: User_Role
}

export type CellOutModel = {
	__typename?: 'CellOutModel'
	cellTypeId: Scalars['Int']['output']
	depth: Scalars['Int']['output']
	height: Scalars['Int']['output']
	id: Scalars['Int']['output']
	name: Scalars['String']['output']
	parcelBoxId: Scalars['Int']['output']
	width: Scalars['Int']['output']
}

export type CellTypeOutModel = {
	__typename?: 'CellTypeOutModel'
	depth: Scalars['Int']['output']
	height: Scalars['Int']['output']
	id: Scalars['Int']['output']
	name: Scalars['String']['output']
	parcelBoxTypeId: Scalars['Int']['output']
	width: Scalars['Int']['output']
}

export type ConfirmEmailInput = {
	/** User email */
	code: Scalars['String']['input']
}

export type CreateCellTypeInput = {
	/** Cell depth */
	depth: Scalars['Int']['input']
	/** Cell height */
	height: Scalars['Int']['input']
	/** Cell type name */
	name: Scalars['String']['input']
	/** Cell depth */
	parcelBoxTypeId: Scalars['Int']['input']
	/** Cell width */
	width: Scalars['Int']['input']
}

export type CreateParcelBoxInput = {
	/** Parcel box type id */
	parcelBoxTypeId: Scalars['Float']['input']
	/** User id who belongs to this parcel box */
	userId: Scalars['Float']['input']
}

export type CreateParcelBoxTypeInput = {
	/** Parcel box type name */
	name: Scalars['String']['input']
}

export type LocationOutModel = {
	__typename?: 'LocationOutModel'
	address: Scalars['String']['output']
	businessDays: Array<Scalars['Int']['output']>
	businessHoursFrom: Scalars['Int']['output']
	businessHoursTo: Scalars['Int']['output']
	id: Scalars['Int']['output']
}

export type LoginInput = {
	/** User email */
	email: Scalars['String']['input']
	/** User password */
	password: Scalars['String']['input']
}

export type Mutation = {
	__typename?: 'Mutation'
	/**
	 * User login
	 * 	Possible errors:
	 * 	**Почта и пароль не совпадают.** — there is not any user with passed email and password.
	 * 	**Почта зарегистрирована, но не подтверждена.** — user email is not confirmed yet.
	 */
	auth_login: AdminOrSender
	/**
	 * User logout
	 * 	Possible errors:
	 * 	**Токен обновления недействителен.** — refresh token is not valid
	 */
	auth_logout: Scalars['Boolean']['output']
	/** Get new access and refresh token */
	auth_refreshToken: Scalars['Boolean']['output']
	/**
	 * Register a user as a administrator.
	 * 	Possible errors:
	 * 	**Почта зарегистрирована, но не подтверждена.** — the user is already registered, but doesn't confirm his email.
	 * 	**Почта уже зарегистрирована.** — the user is already registered and confirmed his email.
	 */
	auth_registerAdmin: AdminOutModel
	/**
	 * Register a user as a administrator.
	 * 	Possible errors:
	 * 	**Почта зарегистрирована, но не подтверждена.** — the user is already registered, but doesn't confirm his email.
	 * 	**Почта уже зарегистрирована.** — the user is already registered and confirmed his email.
	 */
	auth_registerSender: SenderOutModel
	/**
	 * Send email confirmation email one more time
	 * 	Possible errors:
	 * 	**Почта не найдена.** — passed email is not registered yet.
	 * 	**Почта уже подтверждена.** — email is already confirmed.
	 */
	auth_resendConfirmationEmail: Scalars['Boolean']['output']
	/**
	 * Create cell type.
	 * 	Possible errors:
	 * 	**Тип ячейки не создан.** — parcel cell couldn't create for some reason.
	 */
	cellType_create: CellTypeOutModel
	/**
	 * Create parcel box type.
	 * 	Possible errors:
	 * 	**Тип посыльного ящика не создан.** — parcel box type couldn't create for some reason.
	 */
	parcelBoxType_create: ParcelBoxTypeOutModel
	/**
	 * Create parcel box.
	 * 	Possible errors:
	 * 	**Тип посыльного ящика не создан.** — parcel box couldn't create for some reason.
	 */
	parcelBox_create: ParcelBoxOutModel
}

export type MutationAuth_LoginArgs = {
	input: LoginInput
}

export type MutationAuth_RegisterAdminArgs = {
	input: RegisterAdminInput
}

export type MutationAuth_RegisterSenderArgs = {
	input: RegisterSenderInput
}

export type MutationAuth_ResendConfirmationEmailArgs = {
	input: ResendConfirmationEmailInput
}

export type MutationCellType_CreateArgs = {
	input: CreateCellTypeInput
}

export type MutationParcelBoxType_CreateArgs = {
	input: CreateParcelBoxTypeInput
}

export type MutationParcelBox_CreateArgs = {
	input: CreateParcelBoxInput
}

export type ParcelBoxOutModel = {
	__typename?: 'ParcelBoxOutModel'
	cells: Array<CellOutModel>
	createdAt: Scalars['DateTime']['output']
	id: Scalars['Int']['output']
	location: LocationOutModel
	parcelBoxTypeId: Scalars['Int']['output']
	parcelBoxTypeName: Scalars['String']['output']
}

export type ParcelBoxTypeOutModel = {
	__typename?: 'ParcelBoxTypeOutModel'
	cellTypes: Array<CellTypeOutModel>
	id: Scalars['Int']['output']
	name: Scalars['String']['output']
}

export type Query = {
	__typename?: 'Query'
	/**
	 * User email confirmation.
	 * 	Possible errors:
	 * 	**Код подтверждения почты не найден.** — email confirmation code is not found in the database.
	 * 	**Срок действия кода подтверждения почты истек.** — email confirmation code is expired.
	 */
	auth_confirmEmail: Scalars['Boolean']['output']
	/** Get current user data */
	auth_getMe: AdminOrSender
	/** Get all parcel box of the current user. */
	parcelBox_getMine: Array<ParcelBoxOutModel>
}

export type QueryAuth_ConfirmEmailArgs = {
	input: ConfirmEmailInput
}

export type RegisterAdminInput = {
	/** User email */
	email: Scalars['String']['input']
	/** User password */
	password: Scalars['String']['input']
}

export type RegisterSenderInput = {
	/** User email */
	email: Scalars['String']['input']
	/** User password */
	password: Scalars['String']['input']
}

export type ResendConfirmationEmailInput = {
	/** User email */
	email: Scalars['String']['input']
}

export type SenderOutModel = {
	__typename?: 'SenderOutModel'
	active: Scalars['Boolean']['output']
	balance: Scalars['Int']['output']
	email: Scalars['String']['output']
	firstName: Maybe<Scalars['String']['output']>
	id: Scalars['Int']['output']
	lastName: Maybe<Scalars['String']['output']>
	passportNum: Maybe<Scalars['String']['output']>
	role: User_Role
}

/** User roles in the system */
export enum User_Role {
	Admin = 'admin',
	Sender = 'sender',
}

export type ParcelBoxGetMineVariables = Exact<{ [key: string]: never }>

export type ParcelBoxGetMine = {
	__typename?: 'Query'
	parcelBox_getMine: Array<{
		__typename?: 'ParcelBoxOutModel'
		id: number
		parcelBoxTypeId: number
		parcelBoxTypeName: string
		createdAt: any
		cells: Array<{
			__typename?: 'CellOutModel'
			id: number
			name: string
			cellTypeId: number
			parcelBoxId: number
			width: number
			height: number
			depth: number
		}>
		location: {
			__typename?: 'LocationOutModel'
			id: number
			address: string
			businessDays: Array<number>
			businessHoursFrom: number
			businessHoursTo: number
		}
	}>
}

export type AuthConfirmEmailVariables = Exact<{
	input: ConfirmEmailInput
}>

export type AuthConfirmEmail = { __typename?: 'Query'; auth_confirmEmail: boolean }

export type AuthGetMeVariables = Exact<{ [key: string]: never }>

export type AuthGetMe = {
	__typename?: 'Query'
	auth_getMe:
		| { __typename?: 'AdminOutModel'; id: number; email: string; role: User_Role }
		| {
				__typename?: 'SenderOutModel'
				id: number
				email: string
				firstName: string | null
				lastName: string | null
				passportNum: string | null
				balance: number
				active: boolean
				role: User_Role
		  }
}

export type AuthLoginVariables = Exact<{
	input: LoginInput
}>

export type AuthLogin = {
	__typename?: 'Mutation'
	auth_login:
		| { __typename?: 'AdminOutModel'; id: number; email: string; role: User_Role }
		| {
				__typename?: 'SenderOutModel'
				id: number
				email: string
				firstName: string | null
				lastName: string | null
				passportNum: string | null
				balance: number
				active: boolean
				role: User_Role
		  }
}

export type AuthLogoutVariables = Exact<{ [key: string]: never }>

export type AuthLogout = { __typename?: 'Mutation'; auth_logout: boolean }

export type AuthRefreshTokenVariables = Exact<{ [key: string]: never }>

export type AuthRefreshToken = { __typename?: 'Mutation'; auth_refreshToken: boolean }

export type AuthRegisterAdminVariables = Exact<{
	input: RegisterAdminInput
}>

export type AuthRegisterAdmin = {
	__typename?: 'Mutation'
	auth_registerAdmin: { __typename?: 'AdminOutModel'; id: number; email: string }
}

export type AuthRegisterSenderVariables = Exact<{
	input: RegisterSenderInput
}>

export type AuthRegisterSender = {
	__typename?: 'Mutation'
	auth_registerSender: {
		__typename?: 'SenderOutModel'
		id: number
		email: string
		firstName: string | null
		lastName: string | null
		passportNum: string | null
		balance: number
		active: boolean
	}
}

export type AuthResendConfirmationEmailVariables = Exact<{
	input: ResendConfirmationEmailInput
}>

export type AuthResendConfirmationEmail = { __typename?: 'Mutation'; auth_resendConfirmationEmail: boolean }

export const ParcelBoxGetMineDocument = gql`
	query ParcelBoxGetMine {
		parcelBox_getMine {
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
				businessHoursFrom
				businessHoursTo
			}
		}
	}
`

/**
 * __useParcelBoxGetMine__
 *
 * To run a query within a React component, call `useParcelBoxGetMine` and pass it any options that fit your needs.
 * When your component renders, `useParcelBoxGetMine` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useParcelBoxGetMine({
 *   variables: {
 *   },
 * });
 */
export function useParcelBoxGetMine(
	baseOptions?: Apollo.QueryHookOptions<ParcelBoxGetMine, ParcelBoxGetMineVariables>,
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<ParcelBoxGetMine, ParcelBoxGetMineVariables>(ParcelBoxGetMineDocument, options)
}
export function useParcelBoxGetMineLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<ParcelBoxGetMine, ParcelBoxGetMineVariables>,
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<ParcelBoxGetMine, ParcelBoxGetMineVariables>(ParcelBoxGetMineDocument, options)
}
export function useParcelBoxGetMineSuspenseQuery(
	baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ParcelBoxGetMine, ParcelBoxGetMineVariables>,
) {
	const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<ParcelBoxGetMine, ParcelBoxGetMineVariables>(ParcelBoxGetMineDocument, options)
}
export type ParcelBoxGetMineHookResult = ReturnType<typeof useParcelBoxGetMine>
export type ParcelBoxGetMineLazyQueryHookResult = ReturnType<typeof useParcelBoxGetMineLazyQuery>
export type ParcelBoxGetMineSuspenseQueryHookResult = ReturnType<typeof useParcelBoxGetMineSuspenseQuery>
export type ParcelBoxGetMineQueryResult = Apollo.QueryResult<ParcelBoxGetMine, ParcelBoxGetMineVariables>
export const AuthConfirmEmailDocument = gql`
	query AuthConfirmEmail($input: ConfirmEmailInput!) {
		auth_confirmEmail(input: $input)
	}
`

/**
 * __useAuthConfirmEmail__
 *
 * To run a query within a React component, call `useAuthConfirmEmail` and pass it any options that fit your needs.
 * When your component renders, `useAuthConfirmEmail` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuthConfirmEmail({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAuthConfirmEmail(
	baseOptions: Apollo.QueryHookOptions<AuthConfirmEmail, AuthConfirmEmailVariables> &
		({ variables: AuthConfirmEmailVariables; skip?: boolean } | { skip: boolean }),
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<AuthConfirmEmail, AuthConfirmEmailVariables>(AuthConfirmEmailDocument, options)
}
export function useAuthConfirmEmailLazyQuery(
	baseOptions?: Apollo.LazyQueryHookOptions<AuthConfirmEmail, AuthConfirmEmailVariables>,
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<AuthConfirmEmail, AuthConfirmEmailVariables>(AuthConfirmEmailDocument, options)
}
export function useAuthConfirmEmailSuspenseQuery(
	baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AuthConfirmEmail, AuthConfirmEmailVariables>,
) {
	const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<AuthConfirmEmail, AuthConfirmEmailVariables>(AuthConfirmEmailDocument, options)
}
export type AuthConfirmEmailHookResult = ReturnType<typeof useAuthConfirmEmail>
export type AuthConfirmEmailLazyQueryHookResult = ReturnType<typeof useAuthConfirmEmailLazyQuery>
export type AuthConfirmEmailSuspenseQueryHookResult = ReturnType<typeof useAuthConfirmEmailSuspenseQuery>
export type AuthConfirmEmailQueryResult = Apollo.QueryResult<AuthConfirmEmail, AuthConfirmEmailVariables>
export const AuthGetMeDocument = gql`
	query AuthGetMe {
		auth_getMe {
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
	}
`

/**
 * __useAuthGetMe__
 *
 * To run a query within a React component, call `useAuthGetMe` and pass it any options that fit your needs.
 * When your component renders, `useAuthGetMe` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuthGetMe({
 *   variables: {
 *   },
 * });
 */
export function useAuthGetMe(baseOptions?: Apollo.QueryHookOptions<AuthGetMe, AuthGetMeVariables>) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useQuery<AuthGetMe, AuthGetMeVariables>(AuthGetMeDocument, options)
}
export function useAuthGetMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AuthGetMe, AuthGetMeVariables>) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useLazyQuery<AuthGetMe, AuthGetMeVariables>(AuthGetMeDocument, options)
}
export function useAuthGetMeSuspenseQuery(
	baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AuthGetMe, AuthGetMeVariables>,
) {
	const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions }
	return Apollo.useSuspenseQuery<AuthGetMe, AuthGetMeVariables>(AuthGetMeDocument, options)
}
export type AuthGetMeHookResult = ReturnType<typeof useAuthGetMe>
export type AuthGetMeLazyQueryHookResult = ReturnType<typeof useAuthGetMeLazyQuery>
export type AuthGetMeSuspenseQueryHookResult = ReturnType<typeof useAuthGetMeSuspenseQuery>
export type AuthGetMeQueryResult = Apollo.QueryResult<AuthGetMe, AuthGetMeVariables>
export const AuthLoginDocument = gql`
	mutation AuthLogin($input: LoginInput!) {
		auth_login(input: $input) {
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
	}
`
export type AuthLoginMutationFn = Apollo.MutationFunction<AuthLogin, AuthLoginVariables>

/**
 * __useAuthLogin__
 *
 * To run a mutation, you first call `useAuthLogin` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthLogin` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authLogin, { data, loading, error }] = useAuthLogin({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAuthLogin(baseOptions?: Apollo.MutationHookOptions<AuthLogin, AuthLoginVariables>) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<AuthLogin, AuthLoginVariables>(AuthLoginDocument, options)
}
export type AuthLoginHookResult = ReturnType<typeof useAuthLogin>
export type AuthLoginMutationResult = Apollo.MutationResult<AuthLogin>
export type AuthLoginMutationOptions = Apollo.BaseMutationOptions<AuthLogin, AuthLoginVariables>
export const AuthLogoutDocument = gql`
	mutation AuthLogout {
		auth_logout
	}
`
export type AuthLogoutMutationFn = Apollo.MutationFunction<AuthLogout, AuthLogoutVariables>

/**
 * __useAuthLogout__
 *
 * To run a mutation, you first call `useAuthLogout` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthLogout` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authLogout, { data, loading, error }] = useAuthLogout({
 *   variables: {
 *   },
 * });
 */
export function useAuthLogout(baseOptions?: Apollo.MutationHookOptions<AuthLogout, AuthLogoutVariables>) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<AuthLogout, AuthLogoutVariables>(AuthLogoutDocument, options)
}
export type AuthLogoutHookResult = ReturnType<typeof useAuthLogout>
export type AuthLogoutMutationResult = Apollo.MutationResult<AuthLogout>
export type AuthLogoutMutationOptions = Apollo.BaseMutationOptions<AuthLogout, AuthLogoutVariables>
export const AuthRefreshTokenDocument = gql`
	mutation AuthRefreshToken {
		auth_refreshToken
	}
`
export type AuthRefreshTokenMutationFn = Apollo.MutationFunction<AuthRefreshToken, AuthRefreshTokenVariables>

/**
 * __useAuthRefreshToken__
 *
 * To run a mutation, you first call `useAuthRefreshToken` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthRefreshToken` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authRefreshToken, { data, loading, error }] = useAuthRefreshToken({
 *   variables: {
 *   },
 * });
 */
export function useAuthRefreshToken(
	baseOptions?: Apollo.MutationHookOptions<AuthRefreshToken, AuthRefreshTokenVariables>,
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<AuthRefreshToken, AuthRefreshTokenVariables>(AuthRefreshTokenDocument, options)
}
export type AuthRefreshTokenHookResult = ReturnType<typeof useAuthRefreshToken>
export type AuthRefreshTokenMutationResult = Apollo.MutationResult<AuthRefreshToken>
export type AuthRefreshTokenMutationOptions = Apollo.BaseMutationOptions<AuthRefreshToken, AuthRefreshTokenVariables>
export const AuthRegisterAdminDocument = gql`
	mutation AuthRegisterAdmin($input: RegisterAdminInput!) {
		auth_registerAdmin(input: $input) {
			id
			email
		}
	}
`
export type AuthRegisterAdminMutationFn = Apollo.MutationFunction<AuthRegisterAdmin, AuthRegisterAdminVariables>

/**
 * __useAuthRegisterAdmin__
 *
 * To run a mutation, you first call `useAuthRegisterAdmin` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthRegisterAdmin` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authRegisterAdmin, { data, loading, error }] = useAuthRegisterAdmin({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAuthRegisterAdmin(
	baseOptions?: Apollo.MutationHookOptions<AuthRegisterAdmin, AuthRegisterAdminVariables>,
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<AuthRegisterAdmin, AuthRegisterAdminVariables>(AuthRegisterAdminDocument, options)
}
export type AuthRegisterAdminHookResult = ReturnType<typeof useAuthRegisterAdmin>
export type AuthRegisterAdminMutationResult = Apollo.MutationResult<AuthRegisterAdmin>
export type AuthRegisterAdminMutationOptions = Apollo.BaseMutationOptions<AuthRegisterAdmin, AuthRegisterAdminVariables>
export const AuthRegisterSenderDocument = gql`
	mutation AuthRegisterSender($input: RegisterSenderInput!) {
		auth_registerSender(input: $input) {
			id
			email
			firstName
			lastName
			passportNum
			balance
			active
		}
	}
`
export type AuthRegisterSenderMutationFn = Apollo.MutationFunction<AuthRegisterSender, AuthRegisterSenderVariables>

/**
 * __useAuthRegisterSender__
 *
 * To run a mutation, you first call `useAuthRegisterSender` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthRegisterSender` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authRegisterSender, { data, loading, error }] = useAuthRegisterSender({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAuthRegisterSender(
	baseOptions?: Apollo.MutationHookOptions<AuthRegisterSender, AuthRegisterSenderVariables>,
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<AuthRegisterSender, AuthRegisterSenderVariables>(AuthRegisterSenderDocument, options)
}
export type AuthRegisterSenderHookResult = ReturnType<typeof useAuthRegisterSender>
export type AuthRegisterSenderMutationResult = Apollo.MutationResult<AuthRegisterSender>
export type AuthRegisterSenderMutationOptions = Apollo.BaseMutationOptions<
	AuthRegisterSender,
	AuthRegisterSenderVariables
>
export const AuthResendConfirmationEmailDocument = gql`
	mutation AuthResendConfirmationEmail($input: ResendConfirmationEmailInput!) {
		auth_resendConfirmationEmail(input: $input)
	}
`
export type AuthResendConfirmationEmailMutationFn = Apollo.MutationFunction<
	AuthResendConfirmationEmail,
	AuthResendConfirmationEmailVariables
>

/**
 * __useAuthResendConfirmationEmail__
 *
 * To run a mutation, you first call `useAuthResendConfirmationEmail` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAuthResendConfirmationEmail` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [authResendConfirmationEmail, { data, loading, error }] = useAuthResendConfirmationEmail({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAuthResendConfirmationEmail(
	baseOptions?: Apollo.MutationHookOptions<AuthResendConfirmationEmail, AuthResendConfirmationEmailVariables>,
) {
	const options = { ...defaultOptions, ...baseOptions }
	return Apollo.useMutation<AuthResendConfirmationEmail, AuthResendConfirmationEmailVariables>(
		AuthResendConfirmationEmailDocument,
		options,
	)
}
export type AuthResendConfirmationEmailHookResult = ReturnType<typeof useAuthResendConfirmationEmail>
export type AuthResendConfirmationEmailMutationResult = Apollo.MutationResult<AuthResendConfirmationEmail>
export type AuthResendConfirmationEmailMutationOptions = Apollo.BaseMutationOptions<
	AuthResendConfirmationEmail,
	AuthResendConfirmationEmailVariables
>
