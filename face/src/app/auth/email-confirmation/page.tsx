import {Suspense} from 'react'
import { EmailConfirmationPage } from '../../../myPages/auth/EmailConfirmationPage/EmailConfirmationPage'

export default function Page() {
	return (
		<Suspense>
			<EmailConfirmationPage />
		</Suspense>
	)
}
