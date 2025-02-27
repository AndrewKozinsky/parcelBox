import React from 'react'
import type { Metadata } from 'next'
import { AuthLayout } from '../../myPages/auth/AuthLayout/AuthLayout'

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
}

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <AuthLayout>{children}</AuthLayout>
}
