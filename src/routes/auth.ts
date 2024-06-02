import { googleOAuth } from '@/controllers'
import { googleAuthSchema, userUpdateSchema } from '@/types'
import { type FastifyInstance, type FastifyPluginOptions } from 'fastify'

export default function (
	instance: FastifyInstance,
	options: FastifyPluginOptions,
	done: () => void,
) {
	// Unauthenticated routes
	instance.get('/redirect/google', googleOAuth.redirect)
	instance.post(
		'/login/google',
		{ schema: googleAuthSchema },
		googleOAuth.login,
	)
	instance.post(
		'/register/google',
		{ schema: googleAuthSchema },
		googleOAuth.register,
	)

	// Authenticated routes
	instance.post('/logout', googleOAuth.logout)
	instance.get('/me', googleOAuth.me)
	instance.put('/me', { schema: userUpdateSchema }, googleOAuth.updateMe)
	instance.delete('/me', googleOAuth.deleteMe)

	done()
}
