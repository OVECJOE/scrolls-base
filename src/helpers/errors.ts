import { HttpCodes } from 'fastify/types/utils'

class APIResponseError extends Error {
	private _status: number

	constructor(message: string, status: HttpCodes = 500) {
		super(message)
		this._status = status
		this.name = this.constructor.name

		Error.captureStackTrace(this, this.constructor)
	}

	get status() {
		return this._status
	}
}

export { APIResponseError }
