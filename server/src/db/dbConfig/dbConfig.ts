import { BdConfig } from './dbConfigType'

/**
 * Database structure.
 * With help of this structure, it is formed schema.prisma and class-validator set of decorators to check fields in DTO.
 */
export const bdConfig = {
	User: {
		dtoProps: {
			password: {
				type: 'string',
				minLength: 6,
				maxLength: 30,
				match: /[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/,
				matchErrorMessage:
					'Password must have min length is 6 and max length is 30 and contains letters, numbers and other symbols',
				description: "User's password",
				example: '$1Hn[595n8]T',
				required: true,
			},
			/*recoveryCode: {
				type: 'string',
				minLength: 1,
				maxLength: 100,
				description: 'The code that the server sent after the password recovery request',
				example: 'z151JPS16j',
				required: true,
			},*/
		},
		dbFields: {
			id: {
				type: 'index',
			},
			email: {
				type: 'email',
				unique: true,
				description: "User's email",
				required: true,
			},
			password: {
				type: 'string',
				description: "Hashed user's password",
				example: 'z151JPS16jz151JPS16j',
				required: true,
			},
			email_confirmation_code: {
				type: 'string',
				required: false,
				minLength: 3,
				maxLength: 100,
				description: 'The code with which the user must confirm his email',
				example: '1836',
			},
			email_confirmation_code_expiration_date: {
				type: 'string',
				required: false,
				description: 'The date when email confirmation code will be expired',
				example: '2024-08-30T08:43:48.596Z',
			},
			is_email_confirmed: {
				type: 'boolean',
				default: false,
				description: "Is user's email confirmed",
				example: true,
				required: true,
			},
			created_at: {
				type: 'createdAt',
			},
			role: {
				type: 'number',
				description: 'User role',
				required: true,
			},
			/*password_recovery_code: {
				type: 'string',
				required: false,
				description:
					'The code with which the user must to confirm, that he ask for password recovery',
				example: '6b459253-6d74-4bc1-bfca-b80447e67cec',
			},*/
			DeviceToken: {
				type: 'oneToMany',
			},
			Sender: {
				type: 'parentOneToOne',
			},
		},
	},
	DeviceToken: {
		dtoProps: {},
		dbFields: {
			id: {
				type: 'index',
			},
			issued_at: {
				type: 'string',
				description: 'When device token was created',
				required: true,
			},
			device_ip: {
				type: 'string',
				description: 'Token device IP address',
				required: true,
			},
			device_id: {
				type: 'string',
				description: 'Token device ID',
				required: true,
			},
			device_name: {
				type: 'string',
				description: 'Token device name',
				required: true,
			},
			user_id: {
				type: 'manyToOne',
				thisField: 'user_id',
				foreignTable: 'User',
				foreignField: 'id',
			},
		},
	},
	Sender: {
		dtoProps: {
			/*photosIds: {
				type: 'array',
				arrayItemType: 'mongoId',
				required: true,
				example: ['507f1f77bcf86cd799439011'],
			},*/
		},
		dbFields: {
			first_name: {
				type: 'string',
				minLength: 1,
				maxLength: 50,
				match: /^[A-Za-zА-Яа-я]+$/,
				matchErrorMessage: 'First name must contain only letters',
				description: "User's first name",
				example: 'Andrew',
				required: false,
			},
			last_name: {
				type: 'string',
				minLength: 1,
				maxLength: 50,
				match: /^[A-Za-zА-Яа-я]+$/,
				matchErrorMessage: 'Last name must contain only letters',
				description: "User's last name",
				example: 'Kozinsky',
				required: false,
			},
			passport_num: {
				type: 'string',
				description: 'Sender passport series and number',
				required: false,
			},
			balance: {
				type: 'number',
				description: 'Sender balance',
				required: true,
				default: 0,
			},
			active: {
				type: 'boolean',
				description: 'Is user-s passport was checked and he can rent parcel terminal cell',
				required: true,
				default: false,
			},
			user_id: {
				type: 'childOneToOne',
				thisField: 'user_id',
				foreignTable: 'User',
				foreignField: 'id',
			},
			/*PostPhoto: {
				type: 'oneToMany',
			},*/
		},
	},
	Admin: {
		dtoProps: {},
		dbFields: {
			user_id: {
				type: 'childOneToOne',
				thisField: 'user_id',
				foreignTable: 'User',
				foreignField: 'id',
			},
		},
	},
	ParcelBoxType: {
		dtoProps: {},
		dbFields: {
			id: {
				type: 'index',
			},
			name: {
				type: 'string',
				minLength: 1,
				maxLength: 100,
				description: 'Parcel box type name',
				example: 'Compact',
				required: true,
			},
			CellType: {
				type: 'oneToMany',
			},
		},
	},
	CellType: {
		dtoProps: {
			parcelBoxTypeId: {
				type: 'index',
			},
		},
		dbFields: {
			id: {
				type: 'index',
			},
			name: {
				type: 'string',
				minLength: 1,
				maxLength: 100,
				description: 'Cell type name',
				example: '1D',
				required: true,
			},
			width: {
				type: 'number',
				min: 10,
				max: 100,
				description: 'A cell width',
				required: true,
			},
			height: {
				type: 'number',
				min: 10,
				max: 100,
				description: 'A cell width',
				required: true,
			},
			depth: {
				type: 'number',
				min: 10,
				max: 100,
				description: 'A cell depth',
				required: true,
			},
			parcel_box_type_id: {
				type: 'manyToOne',
				thisField: 'parcel_box_type_id',
				foreignTable: 'ParcelBoxType',
				foreignField: 'id',
			},
		},
	},
	/*PostPhoto: {
		dtoProps: {},
		dbFields: {
			id: {
				type: 'index',
			},
			files_ms_post_photo_id: {
				type: 'string',
				description: 'Post photo id in database of files microservice',
				required: true,
			},
			post_id: {
				type: 'manyToOne',
				thisField: 'post_id',
				foreignTable: 'Post',
				foreignField: 'id',
			},
		},
	},*/
} satisfies BdConfig.Root
