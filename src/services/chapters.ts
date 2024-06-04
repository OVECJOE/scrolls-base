import { type ChapterSchema } from '@/types'
import { PrismaClient } from '@prisma/client'

class ChaptersService {
	private readonly prisma: PrismaClient

	constructor() {
		this.prisma = new PrismaClient()
	}

	async get(bookId: number) {
		return await this.prisma.chapter.findMany({
			where: { bookId },
			select: {
				id: true,
				title: true,
				position: true,
			},
			orderBy: { position: 'asc' },
		})
	}

	async getOne(bookId: number, chapterId: number) {
		return await this.prisma.chapter.findUnique({
			where: { id: chapterId, bookId },
			select: {
				Book: {
					select: {
						title: true,
						public: true,
						type: true,
						genre: true,
					},
				},
				Page: {
					select: {
						words_cnt: true,
					},
					orderBy: {
						position: 'asc',
					},
				},
			},
		})
	}

	async create(bookId: number, title?: string, description?: string) {
		const chapters = await this.get(bookId)
		return await this.prisma.chapter.create({
			data: {
				title,
				description,
				position: chapters.length + 1,
				bookId,
			},
		})
	}

	async update(bookId: number, chapterId: number, data: ChapterSchema) {
		return await this.prisma.chapter.update({
			where: { id: chapterId, bookId },
			data,
		})
	}

	async delete(bookId: number, chapterId: number) {
		const { position } = await this.prisma.chapter.delete({
			where: { id: chapterId, bookId },
		})

		// Update the positions of the remaining chapters
		return await this.prisma.chapter.updateMany({
			where: { bookId, position: { gt: position } },
			data: { position: { decrement: 1 } },
		})
	}

	async move(bookId: number, chapterId: number, position: number) {
		// Step 1: fetch all chapters in the book except the one being moved
		const chapters = await this.prisma.chapter.findMany({
			where: { bookId, id: { not: chapterId } },
			select: { id: true, position: true },
			orderBy: { position: 'asc' },
		})

		// Step 2: add the chapter being moved to the list
		chapters.push({ id: chapterId, position })

		// Step 3: reorder the chapters
		return await this.reorder(bookId, chapters)
	}

	async reorder(
		bookId: number,
		chapters: Array<{
			id: number
			position: number
		}>,
	) {
		const updates = chapters.map(
			async ({ id, position }) =>
				await this.prisma.chapter.update({
					where: { id, bookId },
					data: { position },
				}),
		)

		return await Promise.all(updates)
	}
}

export default ChaptersService
