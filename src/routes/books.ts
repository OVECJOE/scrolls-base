import {
	createBook,
	deleteBook,
	getBook,
	getPublicBook,
	getPublicBooks,
	getUserBooks,
	showOrHideBook,
	updateBook,
} from '@/controllers/books'
import { bookSchema, idSchema } from '@/types'
import { bookUpdateSchema } from '@/types/schemas.types'
import { type FastifyInstance, type FastifyPluginOptions } from 'fastify'
import chapters from './chapters'

export default function (
	instance: FastifyInstance,
	options: FastifyPluginOptions,
	done: () => void,
) {
	// Unauthenticated routes
	instance.get('/public', getPublicBooks)
	instance.get('/public/:id', { schema: { params: idSchema } }, getPublicBook)

	// Authenticated routes
	const authOpts = {
		preHandler: [instance.checkAuth],
	}

	instance.get('/', authOpts, getUserBooks)
	instance.get(
		'/:id',
		{
			...authOpts,
			schema: { params: idSchema },
		},
		getBook,
	)
	instance.post(
		'/',
		{
			...authOpts,
			schema: { body: bookSchema },
		},
		createBook,
	)
	instance.put(
		'/:id',
		{
			...authOpts,
			schema: { params: idSchema, body: bookUpdateSchema },
		},
		updateBook,
	)
	instance.put(
		'/:id/publicize',
		{
			...authOpts,
			schema: { params: idSchema },
		},
		showOrHideBook,
	)
	instance.delete(
		'/:id',
		{
			...authOpts,
			schema: { params: idSchema },
		},
		deleteBook,
	)

	// Nested routes
	instance.register(chapters, { prefix: '/:id/chapters' })

	done()
}
