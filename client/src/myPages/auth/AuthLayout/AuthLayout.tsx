'use client'

import React from 'react'
import './AuthLayout.scss'
import { useRedirectToRoleMainPageIfUserAuthorized } from '../../common/autoRedirect/redirects'

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
