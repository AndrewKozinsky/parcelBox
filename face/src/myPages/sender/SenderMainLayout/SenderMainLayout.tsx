import React from 'react'
import ContentLayout from '../../common/ContentLayout/ContentLayout'

type SenderMainLayoutProps = {
	children: React.ReactNode
}

function SenderMainLayout(props: SenderMainLayoutProps) {
	const { children } = props

	return <ContentLayout>{children}</ContentLayout>
}

export default SenderMainLayout
