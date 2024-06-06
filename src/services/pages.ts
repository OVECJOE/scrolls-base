import { type PageSchema } from '@/types'
import { PrismaClient } from '@prisma/client'

class PagesService {
	private readonly prisma: PrismaClient

	constructor() {
		this.prisma = new PrismaClient()
	}

	async get(chapterId: number) {
		return await this.prisma.page.findMany({
			where: { chapterId },
			select: {
				id: true,
				position: true,
				words_cnt: true,
			},
			orderBy: { position: 'asc' },
		})
	}

	async getOne(chapterId: number, pageId: number) {
		return await this.prisma.page.findUnique({
			where: { id: pageId, chapterId },
			select: {
				Chapter: {
					select: {
						title: true,
						position: true,
					},
				},
				content: true,
				words_cnt: true,
				createdAt: true,
				updatedAt: true,
				position: true,
				has_annotations: true,
			},
		})
	}

	async create(chapterId: number, content: string) {
		const pages = await this.get(chapterId)
		const words_cnt = content.split(' ').length

		return await this.prisma.page.create({
			data: {
				content,
				position: pages.length + 1,
				chapterId,
				words_cnt,
			},
		})
	}

	async update(chapterId: number, pageId: number, data: PageSchema) {
		const words_cnt = data.content?.split(' ').length

		return await this.prisma.page.update({
			where: { id: pageId, chapterId },
			data: {
				...data,
				words_cnt,
			},
		})
	}

	async delete(chapterId: number, pageId: number) {
		return await this.prisma.page.delete({
			where: { id: pageId, chapterId },
		})
	}

	async updatePosition(chapterId: number, pageId: number, position: number) {
		return await this.prisma.page.update({
			where: { id: pageId, chapterId },
			data: { position },
		})
	}

	async deleteAll(chapterId: number) {
		return await this.prisma.page.deleteMany({
			where: { chapterId },
		})
	}

	async deleteAllExcept(chapterId: number, pageId: number) {
		return await this.prisma.page.deleteMany({
			where: { chapterId, id: { not: pageId } },
		})
	}
}

export default PagesService
