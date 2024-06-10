import { main, operations } from '@/controllers'
import { genAuthOpts } from '@/helpers'
import { chapterSchema, idSchema } from '@/types'
import { positionsSchema, positionSchema } from '@/types/schemas.types'
import { type FastifyInstance, type FastifyPluginOptions } from 'fastify'

export default function (
	instance: FastifyInstance,
	options: FastifyPluginOptions,
	done: () => void,
) {
	// Unauthenticated routes
	instance.get('/', main.list)
	instance.get('/:id', { schema: { params: idSchema } }, main.view)

	// Authenticated routes
	const authOpts = genAuthOpts(instance)

	instance.post('/', authOpts(false, chapterSchema), main.create)
	instance.put('/:id', authOpts(true, chapterSchema), main.update)
	instance.delete('/:id', authOpts(true), main.delete)

	instance.put('/:id/move', authOpts(true, positionSchema), operations.move)
	instance.put(
		'/reorder',
		authOpts(false, positionsSchema),
		operations.rearrange,
	)

	done()
}
