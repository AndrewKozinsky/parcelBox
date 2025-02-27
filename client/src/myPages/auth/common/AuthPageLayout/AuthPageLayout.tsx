import React from 'react'
import { Typography } from 'antd'
import './AuthPageLayout.scss'
import { constants } from '../../../../utils/constants'

const { Text, Title } = Typography

type AuthPageLayoutProps = {
	pageTitle: string
	form: React.ReactNode
	afterFormLinks: React.ReactNode[]
}

export function AuthPageLayout(props: AuthPageLayoutProps) {
	const { pageTitle, form, afterFormLinks } = props

	return (
		<div className='auth-page-layout'>
			<div className='auth-page-layout__main'>
				<Title level={2}>{pageTitle}</Title>
				{form}
				<div className='auth-page-layout__after-form-links'>{afterFormLinks}</div>
			</div>
			<Text>
				В случае технических проблем пишите на{' '}
				<a href={'mailto:' + constants.supportEmail}>{constants.supportEmail}</a>.
			</Text>
		</div>
	)
}
