import { Typography } from 'antd'
import Link from 'next/link'
import { routeNames } from '../../../../utils/routeNames'
import { useRedirectToMainPageIfUserAuthorized } from '../../../common/auth/redirectToMainPageIfUserAuthorized'
import { AuthPageLayout } from '../../common/AuthPageLayout/AuthPageLayout'
import LoginForm from '../LoginForm/LoginForm'

const { Text } = Typography

export function LoginPage() {
	useRedirectToMainPageIfUserAuthorized()

	return (
		<AuthPageLayout
			pageTitle={routeNames.login.name}
			form={<LoginForm />}
			afterFormLinks={[
				<Text key='1'>
					<Link href={routeNames.login.path}>{routeNames.register.name}</Link>
				</Text>,
				<Text key='2'>
					<Link href={routeNames.rememberPassword.path}>{routeNames.rememberPassword.name}</Link>
				</Text>,
			]}
		/>
	)
}
