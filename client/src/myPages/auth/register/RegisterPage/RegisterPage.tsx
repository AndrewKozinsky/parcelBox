import { Typography } from 'antd'
import Link from 'next/link'
import { routeNames } from '../../../../utils/routeNames'
import { useRedirectToMainPageIfUserAuthorized } from '../../../common/auth/redirectToMainPageIfUserAuthorized'
import { AuthPageLayout } from '../../common/AuthPageWithFormLayout/AuthPageLayout'
import RegisterForm from '../RegisterForm/RegisterForm'

const { Text } = Typography

export function RegisterPage() {
	useRedirectToMainPageIfUserAuthorized()

	return (
		<AuthPageLayout
			pageTitle={routeNames.auth.register.name}
			form={<RegisterForm />}
			afterFormLinks={[
				<Text key='1'>
					<Link href={routeNames.auth.login.path}>{routeNames.auth.login.name}</Link>
				</Text>,
				<Text key='2'>
					<Link href={routeNames.auth.rememberPassword.path}>{routeNames.auth.rememberPassword.name}</Link>
				</Text>,
			]}
		/>
	)
}
