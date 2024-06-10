import { pages } from '@/controllers'
import { genAuthOpts } from '@/helpers'
import { idSchema } from '@/types'
import { pageSchema, positionSchema } from '@/types/schemas.types'

import { type FastifyInstance, type FastifyPluginOptions } from 'fastify'

export default function (
	instance: FastifyInstance,
	options: FastifyPluginOptions,
	done: () => void,
) {
	// Unauthenticated routes
	instance.get('/', pages.list)
	instance.get('/:id', { schema: { params: idSchema } }, pages.view)

	//  Authenticated routes
	const authOpts = genAuthOpts(instance)

	instance.post('/', authOpts(false, pageSchema), pages.create)
	instance.put('/:id', authOpts(true, pageSchema), pages.update)
	instance.delete('/:id', authOpts(true), pages.delete)

	instance.put('/:id/move', authOpts(true, positionSchema), pages.reposition)

	done()
}
