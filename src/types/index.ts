export { type Database } from './database.types'
export {
	type GoogleAuthSchema,
	googleAuthSchema,
	userUpdateSchema,
	type UserUpdateSchema,
} from './schemas.types'

export type ApiResponse<T> = {
	data?: T
	message: string
	status: 'success' | 'error'
}
