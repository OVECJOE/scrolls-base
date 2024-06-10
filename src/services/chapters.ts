import supabase from '@/supabase'
import { Chapter, ChapterFilters, ServiceAuthorizer } from '@/types'
import { PrismaClient } from '@prisma/client'

class ChaptersService implements ServiceAuthorizer {
	private readonly queryBuilder: ReturnType<typeof supabase.from>
	private readonly prisma: PrismaClient

	constructor() {
		this.queryBuilder = supabase.from('chapters')
		this.prisma = new PrismaClient()
	}

	private select() {
		return this.queryBuilder
			.select(
				`
			id,
			title,
			position,
			description,
			book:bookId!inner (
				title,
				public,
				type,
				genre,
			),
			pages_cnt:Page!inner(count)
		`,
			)
			.eq('pages.chapterId', 'id')
	}

	private async one(id: number) {
		return (await this.select().eq('id', id).single<Chapter>()).data
	}

	private filter(
		query: ReturnType<typeof this.select>,
		filters: Omit<ChapterFilters, 'id'>,
	) {
		for (const [key, value] of Object.entries(filters)) {
			query = query.eq(key, value)
		}

		return query
	}

	async verify(authorId: number, chapterId: number) {
		const chapter = await this.one(chapterId)
		if (!chapter) {
			return false
		}

		// find the book with the title
		const book = await this.prisma.book.findFirst({
			where: { title: chapter.book.title },
		})

		return book?.public || book?.authorId === authorId
	}

	async get(filters?: ChapterFilters, single = false) {
		let query = this.select()
		if (filters) {
			query = this.filter(query, filters)
		}

		if (single) {
			return (await query.single<Chapter>()).data
		}

		return (
			await query
				.order('position', { ascending: true })
				.returns<Chapter[]>()
		).data
	}

	async create(bookId: number, title?: string, description?: string) {
		const chapters = (await this.get({ bookId })) as Chapter[]

		return await this.queryBuilder
			.insert({
				title,
				description,
				position: chapters.length + 1,
				bookId,
			} as never)
			.single<Chapter>()
	}

	async update(
		bookId: number,
		chapterId: number,
		data: Pick<ChapterFilters, 'title'> & { description?: string },
	) {
		const { data: chapter } = await this.queryBuilder
			.update(data as never)
			.eq('id', chapterId)
			.eq('bookId', bookId)
			.single<Chapter>()

		return chapter
	}

	async delete(bookId: number, chapterId: number) {
		const { data } = await this.queryBuilder
			.delete()
			.eq('id', chapterId)
			.eq('bookId', bookId)
			.single<Chapter>()

		await this.prisma.chapter.updateMany({
			where: { bookId, position: { gt: data?.position } },
			data: { position: { decrement: 1 } },
		})

		return data
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
