import { Button } from 'antd'
import React from 'react'
import './ContentLayout.scss'

type ContentLayoutProps = {
	children: React.ReactNode
}

function ContentLayout(props: ContentLayoutProps) {
	const { children } = props

	return (
		<section className='content-layout'>
			<div className='content-layout__header'>
				<Button size='small'>Выйти</Button>
			</div>
			<div className='content-layout__main'>{children}</div>
		</section>
	)
}

export default ContentLayout
