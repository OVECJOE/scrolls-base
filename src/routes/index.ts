import { type FastifyInstance } from 'fastify'
import { checkAuth } from '@/decorators'
import auth from './auth'
import books from './books'
import pages from './pages'
import chapters from './chapters'

/**
 * Registers routes.
 *
 * @param app - The Fastify instance.
 * @param supabase - The Supabase client instance.
 */
async function routes(app: FastifyInstance) {
	// authenticate the user for protected routes
	app.decorate('checkAuth', checkAuth)

	// Routes
	await app.register(auth, { prefix: '/auth' })
	await app.register(books, { prefix: '/books' })
	await app.register(chapters, { prefix: '/chapters' })
	await app.register(pages, { prefix: '/pages' })
}

export default routes
