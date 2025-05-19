import { ConfigSchemaV37Json } from './types/ConfigSchemaV37Json'

const domain = 'parcels.explainit.ru'
export enum EnvType {
	test= 'testing',
	dev = 'development',
	server = 'server',
}

/**
 * Возвращает объект конфигурации docker-compose для разработки, проверки развёртывания на сервере и для сервера
 * @param env — тип конфигурации
 * @param serverCheck — конфигурация для проверки собираемости на сервере
 */
export function createDockerConfig(env: EnvType, serverCheck?: boolean): ConfigSchemaV37Json {
	return {
		services: {
			parcelsnginx: {
				image: 'nginx:1.19.7-alpine',
				container_name: 'parcels-nginx',
				depends_on: ['parcelsface', 'parcelsserver', 'parcelspostgres'],
				ports: env === EnvType.server && !serverCheck  ? undefined : ['80:80'],
				volumes: ['./nginx/nginx.conf.dev:/etc/nginx/nginx.conf'],
				environment: getNginxEnvs(env),
			},
			parcelsserver: {
				build: {
					context: 'server/',
					dockerfile: [EnvType.test, EnvType.dev].includes(env) ? 'Dockerfile.dev' : 'Dockerfile.server',
				},
				container_name: 'parcels-server',
				depends_on: ['parcelspostgres'],
				restart: 'unless-stopped',
				volumes: [EnvType.test, EnvType.dev].includes(env) ? ['./server/src:/app/src', './server/e2e:/app/e2e'] : undefined,
				command: [EnvType.test, EnvType.dev].includes(env) ? 'sh -c "yarn run dev"' : 'sh -c "yarn run migrate:dev && yarn start:prod"',

				environment: getServerEnvs(env),
				env_file: ['.env'],
				ports: [EnvType.test, EnvType.dev].includes(env) ? ['3001:3001'] : undefined,
			},
			parcelsface: {
				build: {
					context: 'face/',
					dockerfile: [EnvType.test, EnvType.dev].includes(env) ? 'Dockerfile.dev' : 'Dockerfile.server',
				},
				container_name: 'parcels-face',
				depends_on: ['parcelsserver', 'parcelspostgres'],
				restart: 'unless-stopped',
				volumes: [EnvType.test, EnvType.dev].includes(env) ? ['./face/src:/app/src', './face/public:/app/public', './face/cypress:/app/cypress'] : undefined,
				command: [EnvType.test, EnvType.dev].includes(env) ? 'yarn run dev' : 'yarn run start',
				environment: getFaceEnvs(env),
			},
			parcelspostgres: {
				image: 'postgres:16.2',
				restart: 'unless-stopped',
				container_name: 'parcel-box-postgres',
				ports: ['5433:5432'],
				environment: getPostgresEnvs(),
				env_file: ['.env'],
				volumes: ['pgdata:/var/lib/postgresql/data'],
			},
		},
		networks: env === EnvType.server && !serverCheck ? getServerNetworks() : undefined,
		volumes: {
			pgdata: {}
		}
	}
}

function getServerNetworks() {
	return {
		default: {
			name: 'nginx-proxy',
			external: true
		},
	}
}

/**
 * Возвращает переменные окружения для Nginx
 * @param env — тип конфигурации
 * @param serverCheck — конфигурация для проверки собираемости на сервере
 */
function getNginxEnvs(env: EnvType, serverCheck?: boolean) {
	if (env !== EnvType.server || serverCheck) return undefined

	return {
		VIRTUAL_HOST: `${domain},www.${domain}`,
		LETSENCRYPT_HOST: `${domain},www.${domain}`,
	}
}

/**
 * Возвращает переменные окружения для Api
 * @param env — тип конфигурации
 */
function getServerEnvs(env: EnvType) {
	return {
		MODE: env,
		PORT: 3001,
	}
}

/**
 * Возвращает переменные окружения для Face
 * @param env — тип конфигурации
 */
function getFaceEnvs(env: EnvType) {
	return { MODE: env }
}

/**
 * Возвращает переменные окружения для Face
 */
function getPostgresEnvs() {
	return { POSTGRES_DB: '${POSTGRES_DB}', POSTGRES_USER: '${POSTGRES_USER}', POSTGRES_PASSWORD: '${POSTGRES_PASSWORD}', }
}
