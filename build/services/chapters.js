"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class ChaptersService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    get(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.chapter.findMany({
                where: { bookId },
                select: {
                    id: true,
                    title: true,
                    position: true,
                },
                orderBy: { position: 'asc' },
            });
        });
    }
    getOne(bookId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.chapter.findUnique({
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
            });
        });
    }
    create(bookId, title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const chapters = yield this.get(bookId);
            return yield this.prisma.chapter.create({
                data: {
                    title,
                    description,
                    position: chapters.length + 1,
                    bookId,
                },
            });
        });
    }
    update(bookId, chapterId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.chapter.update({
                where: { id: chapterId, bookId },
                data,
            });
        });
    }
    delete(bookId, chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { position } = yield this.prisma.chapter.delete({
                where: { id: chapterId, bookId },
            });
            return yield this.prisma.chapter.updateMany({
                where: { bookId, position: { gt: position } },
                data: { position: { decrement: 1 } },
            });
        });
    }
    move(bookId, chapterId, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const chapters = yield this.prisma.chapter.findMany({
                where: { bookId, id: { not: chapterId } },
                select: { id: true, position: true },
                orderBy: { position: 'asc' },
            });
            chapters.push({ id: chapterId, position });
            return yield this.reorder(bookId, chapters);
        });
    }
    reorder(bookId, chapters) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = chapters.map((_a) => __awaiter(this, [_a], void 0, function* ({ id, position }) {
                return yield this.prisma.chapter.update({
                    where: { id, bookId },
                    data: { position },
                });
            }));
            return yield Promise.all(updates);
        });
    }
}
exports.default = ChaptersService;
//# sourceMappingURL=chapters.js.map