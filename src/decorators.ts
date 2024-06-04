import { AuthError } from '@supabase/supabase-js'
import supabase from './supabase'
import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function checkAuth(request: FastifyRequest, reply: FastifyReply) {
	// Step 1: Get the token from the request headers
	const token = request.headers.authorization?.replace('Bearer ', '')
	if (!token) throw new AuthError('No token provided.', 401)

	if (!request.session) {
		request.session = {}
	}

	if (!request.session?.user) {
		// Step 2: Get the user from supabase
		const { data, error } = await supabase.auth.getUser(token)
		if (error) throw error

		// Step 3: Get the user from the database
		const user = await supabase
			.from('users')
			.select('*')
			.eq('googleId', data.user.id)
			.single()
		if (user.error) throw new AuthError(user.error.message, user.status)

		// Step 4: Add the user to the request object
		request.session = { user: user.data }
	}
}
