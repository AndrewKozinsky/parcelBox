'use client'

import React from 'react'
import { useParcelBoxGetMine } from '../../../../graphql'
import ParcelBoxListItem from '../ParcelBoxesListItem/ParcelBoxesListItem'
import './ParcelBoxesList.scss'

function ParcelBoxesList() {
	const { loading, data, error } = useParcelBoxGetMine({errorPolicy: 'ignore'})

	if (loading || !data) {
		return null
	}

	if (error) {
		return <p>Error</p>
	}

	return (
		<div className='parcel-boxes-list'>
			{data.parcelBox_getMine.map((parcelBox) => (
				<ParcelBoxListItem data={parcelBox} key={parcelBox.id} />
			))}
		</div>
	)
}

export default ParcelBoxesList
