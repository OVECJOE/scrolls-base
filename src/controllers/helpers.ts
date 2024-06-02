import { type ApiResponse } from '@/types'
import { type AuthError } from '@supabase/supabase-js'

export function respond<T>(
	data: T,
	message: string,
	status: 'success' | 'error' = 'success',
): ApiResponse<T> {
	return { data, message, status }
}

export function respondErrorly(e: AuthError): ApiResponse<null> {
	return respond(null, e.message, 'error')
}
