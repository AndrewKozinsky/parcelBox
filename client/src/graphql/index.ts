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
	 * 	**Email or passwords do not match** — there is not any user with passed email and password.
	 * 	**Email is not confirmed** — user email is not confirmed yet.
	 */
	auth_login: UserOutModel
	/**
	 * User logout
	 * 	Possible errors:
	 * 	**Refresh token is not valid** — refresh token is not valid
	 */
	auth_logout: Scalars['Boolean']['output']
	/** Get new access and refresh token */
	auth_refreshToken: Scalars['Boolean']['output']
	/**
	 * Register a user as a administrator.
	 * 	Possible errors:
	 * 	**Email is not confirmed** — the user is already registered, but doesn't confirm his email.
	 * 	**Email is already registered** — the user is already registered and confirmed his email.
	 */
	auth_registerAdmin: AdminOutModel
	/**
	 * Register a user as a administrator.
	 * 	Possible errors:
	 * 	**Email is not confirmed** — the user is already registered, but doesn't confirm his email.
	 * 	**Email is already registered** — the user is already registered and confirmed his email.
	 */
	auth_registerSender: SenderOutModel
	/**
	 * Send email confirmation email one more time
	 * 	Possible errors:
	 * 	**Email is not found** — passed email is not registered yet.
	 * 	**Email is already confirmed** — email is already confirmed.
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
	 * 	**Email confirmation code not found** — email confirmation code is not found in the database.
	 * 	**Email confirmation code is expired** — email confirmation code is expired.
	 */
	auth_confirmEmail: Scalars['Boolean']['output']
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
	role: Scalars['String']['output']
}

export type AuthConfirmEmailVariables = Exact<{
	input: ConfirmEmailInput
}>

export type AuthConfirmEmail = { __typename?: 'Query'; auth_confirmEmail: boolean }

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
