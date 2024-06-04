import { type FastifyInstance, fastify } from 'fastify'
import fastifyCors from '@fastify/cors'
import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import routes from '@/routes'
import fastifyJwt from '@fastify/jwt'
import { type User } from './types'

/**
 * Creates a Fastify server instance and connects to Supabase.
 */
class FastifyApp {
	/**
	 * The Fastify server instance.
	 */
	private readonly server: FastifyInstance

	/**
	 * Creates a new FastifyApp instance.
	 */
	constructor() {
		this.server = fastify({
			logger: true,
		}).withTypeProvider<TypeBoxTypeProvider>()

		// Add basic health check route
		this.server.get('/', async () => {
			return { status: 'ok' }
		})

		// Register plugins
		this.server.register(fastifyCors)
		this.server.register(fastifyJwt, {
			secret: process.env.JWT_SECRET!,
		})

		// Register routes
		routes(this.server)
	}

	/**
	 * Starts the Fastify server.
	 */
	async start() {
		try {
			await this.server.listen({
				port: process.env.PORT! as unknown as number,
				host: process.env.HOST!,
			})
		} catch (err) {
			this.server.log.error(err)
			this.close(1)
		}
	}

	/**
	 * Closes the Fastify server.
	 */
	async close(code: number = 0) {
		await this.server.close()
		process.exit(code)
	}
}

declare module 'fastify' {
	interface FastifyInstance {
		checkAuth: (
			request: FastifyRequest,
			reply: FastifyReply,
			done: () => void,
		) => Promise<void>
	}

	interface FastifyRequest {
		session: {
			user?: User
		}
	}
}

const app = new FastifyApp()
app.start()
