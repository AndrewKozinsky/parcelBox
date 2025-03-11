import React from 'react'
import { Button, Modal } from 'antd'
import { useAddParcelBoxStore } from '../addParcelBoxStore'
import CreateParcelBoxForm from '../CreateParcelBoxForm/CreateParcelBoxForm'
import { useGetChangeModalVisibility } from './fn/modal'
import './CreateParcelBoxButton.scss'

function CreateParcelBox() {
	const isModalOpen = useAddParcelBoxStore((s) => s.isModalOpen)

	const showModal = useGetChangeModalVisibility(true)
	const closeModal = useGetChangeModalVisibility(false)

	return (
		<div className='create-parcel-button-panel'>
			<Button onClick={showModal}>Создать посыльный ящик</Button>
			<Modal title='Создание посыльного ящика' open={isModalOpen} onCancel={closeModal} footer={null}>
				<CreateParcelBoxForm />
			</Modal>
		</div>
	)
}

export default CreateParcelBox
