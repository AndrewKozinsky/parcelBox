'use client'

import { Typography } from 'antd'
import Link from 'next/link'
import { routeNames } from '../../utils/routeNames'
import './NotFoundPage.scss'

const { Title, Text } = Typography

function NotFoundPage() {
	return (
		<div className='not-found'>
			<div className='not-found__content'>
				<Title>Страница не найдена</Title>
				<Text>
					Вернуться на <Link href={routeNames.main.path}>Главную</Link>
				</Text>
			</div>
		</div>
	)
}

export default NotFoundPage
