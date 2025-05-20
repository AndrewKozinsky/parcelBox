import React from 'react'
import type { Metadata } from 'next'
import AdminMainLayout from '../../myPages/admin/mainPage/AdminMainLayout/AdminMainLayout'

export const metadata: Metadata = {
	title: 'Посыльные ящики',
	description: 'Посыльные ящики',
}

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <AdminMainLayout>{children}</AdminMainLayout>
}
