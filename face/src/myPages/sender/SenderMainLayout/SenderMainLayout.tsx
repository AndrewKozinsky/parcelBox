import React from 'react'
import ContentLayout from '../../common/ContentLayout/ContentLayout'
import UserPageAutoRedirect from '../../common/UserPageAutoRedirect/UserPageAutoRedirect'

type SenderMainLayoutProps = {
	children: React.ReactNode
}

function SenderMainLayout(props: SenderMainLayoutProps) {
	const { children } = props

	return (
		<ContentLayout>
			<UserPageAutoRedirect />
			{children}
		</ContentLayout>
	)
}

export default SenderMainLayout
