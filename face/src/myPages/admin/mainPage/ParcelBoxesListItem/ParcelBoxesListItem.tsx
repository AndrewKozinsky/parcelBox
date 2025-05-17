'use client'

import React from 'react'
import { Typography } from 'antd'
import { ParcelBoxOutModel } from '../../../../graphql'
import DeleteParcelBoxButton from '../DeleteParcelBoxButton/DeleteParcelBoxButton'
import { convertNumArrToWeekDaysStr } from './fn/common'
import './ParcelBoxesListItem.scss'

const { Title, Text } = Typography

type ParcelBoxListItemProps = {
	data: ParcelBoxOutModel
}

function ParcelBoxListItem(props: ParcelBoxListItemProps) {
	const { data } = props

	const businessDaysArr = convertNumArrToWeekDaysStr(data.location.businessDays)

	return (
		<div className='parcel-box'>
			<div>
				<Title level={5}>Адрес</Title>
				{data.location.address ? <Text>{data.location.address}</Text> : <Text disabled>Не указан</Text>}
			</div>
			<div>
				<Title level={5}>Дни работы</Title>
				<Text>{businessDaysArr.join(', ')}</Text>
			</div>
			<BusinessHours data={data} />
			<div>
				<Title level={5}>Тип</Title>
				<Text>{data.parcelBoxTypeName}</Text>
			</div>
			<div className='parcel-box__buttons'>
				{/*<EditParcelBoxButton />*/}
				<DeleteParcelBoxButton parcelBoxId={data.id} />
			</div>
		</div>
	)
}

export default ParcelBoxListItem

type CellProps = {
	data: ParcelBoxOutModel
}

function BusinessHours(props: CellProps) {
	const { businessTimeFrom, businessTimeTo } = props.data.location

	let content = <Text disabled>Не указаны</Text>

	if (businessTimeFrom || businessTimeTo) {
		const fromHour = businessTimeFrom ? <Text>{businessTimeFrom}</Text> : <Text disabled>Не указано</Text>
		const toHour = businessTimeTo ? <Text>{businessTimeTo}</Text> : <Text disabled>Не указано</Text>

		content = <>{fromHour} — {toHour}</>
	}

	return (
		<div>
			<Title level={5}>Часы работы</Title>
			{content}
		</div>
	)
}
