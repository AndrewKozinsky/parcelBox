import { Typography } from 'antd'
import Link from 'next/link'
import { routeNames } from '../../../../utils/routeNames'
import { useRedirectToMainPageIfUserAuthorized } from '../../../common/auth/redirectToMainPageIfUserAuthorized'
import { AuthPageLayout } from '../../common/AuthPageLayout/AuthPageLayout'
import RegisterForm from '../RegisterForm/RegisterForm'

const { Text } = Typography

export function RegisterPage() {
	useRedirectToMainPageIfUserAuthorized()

	return (
		<AuthPageLayout
			pageTitle={routeNames.register.name}
			form={<RegisterForm />}
			afterFormLinks={[
				<Text key='1'>
					<Link href={routeNames.login.path}>{routeNames.login.name}</Link>
				</Text>,
				<Text key='2'>
					<Link href={routeNames.rememberPassword.path}>{routeNames.rememberPassword.name}</Link>
				</Text>,
			]}
		/>
	)
}
