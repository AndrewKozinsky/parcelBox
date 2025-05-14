import * as fs from 'node:fs'
import * as YAML from 'yaml'
import {createDockerConfig, EnvType} from './createDockerConfig'

// Массив с названием и контентом трёх файлов.
const configs = [
	{
		// Докер для тестирования
		name: 'test',
		content: createDockerConfig(EnvType.test),
	},
	{
		// Докер для разработки
		name: 'dev',
		content: createDockerConfig(EnvType.dev),
	},
	{
		// Докер для проверки как соберётся сборка для сервера
		name: 'server-check',
		content: createDockerConfig(EnvType.server, true),
	},
	{
		// Докер для развёртывания
		name: 'server',
		content: createDockerConfig(EnvType.server),
	},
]

for (let i = 0; i < configs.length; i++) {
	const dataItem = configs[i]

	const filePath = '../../docker-compose.' + dataItem.name + '.yml'
	const content = YAML.stringify(dataItem.content)

	fs.writeFile(filePath, content, (err) => {
		if (err) {
			console.error(err)
		} else {
			console.log('Docker compose files were written successfully')
		}
	})
}
