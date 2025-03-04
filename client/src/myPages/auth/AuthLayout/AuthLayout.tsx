'use client'

import React from 'react'
import './AuthLayout.scss'

type AuthPageProps = {
	children: React.ReactNode
}

export function AuthLayout(props: AuthPageProps) {
	const { children } = props

	return (
		<section className='auth-layout'>
			<div className='auth-layout__container'>{children}</div>
		</section>
	)
}
