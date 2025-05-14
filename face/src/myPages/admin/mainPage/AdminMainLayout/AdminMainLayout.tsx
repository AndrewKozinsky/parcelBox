import React from 'react'
import ContentLayout from '../../../common/ContentLayout/ContentLayout'

type AdminMainLayoutProps = {
	children: React.ReactNode
}

function AdminMainLayout(props: AdminMainLayoutProps) {
	const { children } = props

	return <ContentLayout>{children}</ContentLayout>
}

export default AdminMainLayout
