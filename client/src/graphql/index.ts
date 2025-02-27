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
}

export type AdminOutModel = {
	__typename?: 'AdminOutModel'
	email: Scalars['String']['output']
	id: Scalars['Int']['output']
	role: User_Role
}

export type ConfirmEmailInput = {
	/** User email */
	code: Scalars['String']['input']
}

export type GetMeResponse = SenderOutModel | UserOutModel

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
	 * 	**Почта уже зарегистрирована, но не подтверждена.** — user email is not confirmed yet.
	 */
	auth_login: UserOutModel
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
	 * 	**Почта уже зарегистрирована, но не подтверждена.** — the user is already registered, but doesn't confirm his email.
	 * 	**Почта уже зарегистрирована.** — the user is already registered and confirmed his email.
	 */
	auth_registerAdmin: AdminOutModel
	/**
	 * Register a user as a administrator.
	 * 	Possible errors:
	 * 	**Почта уже зарегистрирована, но не подтверждена.** — the user is already registered, but doesn't confirm his email.
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
	auth_getMe: GetMeResponse
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

export type UserOutModel = {
	__typename?: 'UserOutModel'
	email: Scalars['String']['output']
	id: Scalars['Int']['output']
	role: User_Role
}

export type AuthConfirmEmailVariables = Exact<{
	input: ConfirmEmailInput
}>

export type AuthConfirmEmail = { __typename?: 'Query'; auth_confirmEmail: boolean }

export type AuthGetMeVariables = Exact<{ [key: string]: never }>

export type AuthGetMe = {
	__typename?: 'Query'
	auth_getMe:
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
		| { __typename?: 'UserOutModel'; id: number; email: string; role: User_Role }
}

export type AuthLoginVariables = Exact<{
	input: LoginInput
}>

export type AuthLogin = {
	__typename?: 'Mutation'
	auth_login: { __typename?: 'UserOutModel'; id: number; email: string }
}

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
			... on UserOutModel {
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
			id
			email
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
