import React from 'react'
// import AuthAutoRedirect from '../AuthAutoRedirect/AuthAutoRedirect'
import './AuthLayout.scss'

type AuthPageProps = {
	children: React.ReactNode
}

export function AuthLayout(props: AuthPageProps) {
	const { children } = props

	return (
		<section className='auth-layout'>
			{/*<AuthAutoRedirect />*/}
			<div className='auth-layout__container'>{children}</div>
		</section>
	)
}
