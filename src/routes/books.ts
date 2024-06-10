import { author, details, publc } from '@/controllers'
import { bookSchema, idSchema } from '@/types'
import { bookUpdateSchema } from '@/types/schemas.types'
import { Type } from '@sinclair/typebox'
import { type FastifyInstance, type FastifyPluginOptions } from 'fastify'

export default function (
	instance: FastifyInstance,
	options: FastifyPluginOptions,
	done: () => void,
) {
	// Unauthenticated routes
	instance.get('/public', publc.list)
	instance.get('/public/:id', { schema: { params: idSchema } }, publc.view)

	// Authenticated routes
	const authOpts = {
		preHandler: [instance.checkAuth],
	}

	instance.get('/summary', authOpts, author.summary)
	instance.get('/genres', authOpts, details.genres)
	instance.get('/types', authOpts, details.types)

	instance.get('/', authOpts, author.list)
	instance.get(
		'/:id',
		{
			...authOpts,
			schema: { params: idSchema },
		},
		author.view,
	)
	instance.post(
		'/',
		{
			...authOpts,
			schema: { body: bookSchema },
		},
		author.create,
	)
	instance.put(
		'/:id',
		{
			...authOpts,
			schema: { params: idSchema, body: bookUpdateSchema },
		},
		author.update,
	)
	instance.delete(
		'/:id',
		{
			...authOpts,
			schema: { params: idSchema },
		},
		author.delete,
	)

	instance.put(
		'/:id/publicity',
		{
			...authOpts,
			schema: { params: idSchema },
		},
		author.togglePublicity,
	)

	instance.put(
		'/:id/transfer',
		{
			...authOpts,
			schema: { params: idSchema, body: { authorId: Type.Number() } },
		},
		author.transfer,
	)

	done()
}
