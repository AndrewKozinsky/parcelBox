'use client'

import React from 'react'
import { useRedirectToRoleMainPageIfUserAuthorized } from '../../common/autoRedirect/redirects'
import './AuthLayout.scss'

type AuthPageProps = {
	children: React.ReactNode
}

export function AuthLayout(props: AuthPageProps) {
	const { children } = props

	useRedirectToRoleMainPageIfUserAuthorized()

	return (
		<section className='auth-layout'>
			<div className='auth-layout__container'>{children}</div>
		</section>
	)
}
