import { APIResponseError } from '@/helpers'
import { type ApiResponse } from '@/types'

export function respond<T>(
	data: T,
	message: string,
	status: 'success' | 'error' = 'success',
): ApiResponse<T> {
	return { data, message, status }
}

export function respondErrorly<T extends APIResponseError>(
	e: T,
): ApiResponse<null> {
	return respond(null, e.message, 'error')
}
