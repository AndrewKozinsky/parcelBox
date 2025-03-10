import { Button, Modal, Typography } from 'antd'
import React, { useState } from 'react'
import { deleteParcelBoxStoreInitial, useDeleteParcelBoxStore } from './deleteParcelBoxStore'
import { useGetDeleteParcelBox } from './fn/deleteParcelBox'
import { useGetChangeModalVisibility } from './fn/showModal'

const { Text } = Typography

type DeleteParcelBoxButtonProps = {
	parcelBoxId: number
}

function DeleteParcelBoxButton(props: DeleteParcelBoxButtonProps) {
	const { parcelBoxId } = props

	const currentBoxId = useDeleteParcelBoxStore((s) => s.currentBoxId)
	const loading = useDeleteParcelBoxStore((s) => s.loading)

	const showModal = useGetChangeModalVisibility(parcelBoxId)
	const hideModal = useGetChangeModalVisibility(null)
	const deleteParcelBox = useGetDeleteParcelBox(parcelBoxId)

	return (
		<>
			<Button onClick={showModal}>Удалить</Button>
			<Modal
				title='Удаление'
				open={currentBoxId === parcelBoxId}
				onOk={deleteParcelBox}
				confirmLoading={loading}
				onCancel={hideModal}
				okText='Удалить'
				cancelText='Отмена'
			>
				<Text>Удалить посыльный ящик?</Text>
			</Modal>
		</>
	)
}

export default DeleteParcelBoxButton
