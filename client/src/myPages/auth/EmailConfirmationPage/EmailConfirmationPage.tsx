import { Spin, Typography } from 'antd'
import { routeNames } from '../../../utils/routeNames'
import { useEmailConfirmationStore } from './emailConfirmationStore'
import { useConfirmEmail } from './fn/confirmEmail'
import './EmailConfirmationPage.scss'
import Link from 'next/link'

const { Text } = Typography

export function EmailConfirmationPage() {
	const confirmEmailLoading = useEmailConfirmationStore((s) => s.confirmEmailLoading)

	useConfirmEmail()

	return <div className='email-confirmation'>{confirmEmailLoading ? <Spin /> : <ErrorView />}</div>
}

function ErrorView() {
	const errorMessage = useEmailConfirmationStore((s) => s.errorMessage)
	if (!errorMessage) return null

	return (
		<>
			<ErrorText />
			<ResendConfirmationEmail />
		</>
	)
}

function ErrorText() {
	const errorMessage = useEmailConfirmationStore((s) => s.errorMessage)

	return <Text>{errorMessage}</Text>
}

function ResendConfirmationEmail() {
	return (
		<Text>
			Письмо для подтверждения почты своей учётной записи можно отправить ещё раз на{' '}
			<Link href={routeNames.auth.resendConfirmationLetter.path}>этой странице</Link>.
		</Text>
	)
}
