'use client'

import { Typography } from 'antd'
import Link from 'next/link'
import { routeNames } from '../../../../utils/routeNames'
import { AuthPageLayout } from '../../common/AuthPageWithFormLayout/AuthPageLayout'
import LoginForm from '../LoginForm/LoginForm'

const { Text } = Typography

export function LoginPage() {
	return (
		<AuthPageLayout
			pageTitle={routeNames.auth.login.name}
			form={<LoginForm />}
			afterFormLinks={[
				<Text key='1'>
					<Link href={routeNames.auth.register.path}>{routeNames.auth.register.name}</Link>
				</Text>,
				<Text key='2'>
					<Link href={routeNames.auth.rememberPassword.path}>{routeNames.auth.rememberPassword.name}</Link>
				</Text>,
			]}
		/>
	)
}
