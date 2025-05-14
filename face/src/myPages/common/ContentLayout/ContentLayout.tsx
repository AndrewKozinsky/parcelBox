import React from 'react'
import LogoutButton from '../LogoutButton/LogoutButton'
import './ContentLayout.scss'

type ContentLayoutProps = {
	children: React.ReactNode
}

function ContentLayout(props: ContentLayoutProps) {
	const { children } = props

	return (
		<section className='content-layout'>
			<div className='content-layout__header'>
				<LogoutButton />
			</div>
			<div className='content-layout__main'>{children}</div>
		</section>
	)
}

export default ContentLayout
