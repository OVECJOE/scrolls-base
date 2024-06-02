import { type FastifyInstance } from 'fastify'
import auth from './auth'
import books from './books'

/**
 * Registers routes.
 *
 * @param app - The Fastify instance.
 * @param supabase - The Supabase client instance.
 */
async function routes(app: FastifyInstance) {
	// Auth routes
	await app.register(auth, { prefix: '/auth' })
	// Books routes
	await app.register(books, { prefix: '/books' })
}

export default routes
