import React from 'react'
import ContentLayout from '../../../common/ContentLayout/ContentLayout'
import UserPageAutoRedirect from '../../../common/UserPageAutoRedirect/UserPageAutoRedirect'

type AdminMainLayoutProps = {
	children: React.ReactNode
}

function AdminMainLayout(props: AdminMainLayoutProps) {
	const { children } = props

	return (
		<ContentLayout>
			<UserPageAutoRedirect />
			{children}
		</ContentLayout>
	)
}

export default AdminMainLayout
