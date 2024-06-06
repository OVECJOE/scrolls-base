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
const supabase_js_1 = require("@supabase/supabase-js");
class BooksService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    public(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const books = yield this.prisma.book.findMany({
                where: Object.assign({ public: true }, filters),
                select: {
                    authorId: false,
                    Author: {
                        select: { username: true, email: true, avatar: true },
                    },
                    Chapter: {
                        select: {
                            _count: true,
                            Page: {
                                where: {
                                    words_cnt: { gt: 0 },
                                },
                                select: { words_cnt: true },
                            },
                            title: true,
                            description: !!(filters === null || filters === void 0 ? void 0 : filters.id),
                            position: true,
                        },
                    },
                },
                orderBy: [
                    { createdAt: 'desc' },
                    { genre: 'asc' },
                    { title: 'asc' },
                ],
            });
            if (filters === null || filters === void 0 ? void 0 : filters.id) {
                return books[0];
            }
            return books;
        });
    }
    get(authorId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const books = yield this.prisma.book.findMany({
                where: Object.assign(Object.assign({}, ((filters === null || filters === void 0 ? void 0 : filters.id) ? { authorId, id: filters.id } : { authorId })), ((filters === null || filters === void 0 ? void 0 : filters.title) ? { title: filters.title } : {})),
                select: {
                    authorId: false,
                    Chapter: {
                        select: {
                            _count: { select: { Page: true } },
                            Page: {
                                where: {
                                    words_cnt: { gt: 0 },
                                },
                                select: { words_cnt: true },
                            },
                            title: true,
                            description: !!(filters === null || filters === void 0 ? void 0 : filters.id),
                            position: true,
                        },
                    },
                },
            });
            if (books.length > 0 && (filters === null || filters === void 0 ? void 0 : filters.id)) {
                return books[0];
            }
            return books;
        });
    }
    create(authorId, book) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = (yield this.prisma.book.count({
                where: { title: book.title, authorId },
            })) > 0;
            if (exists) {
                throw new supabase_js_1.AuthError('Book with the same title already exists.', 409);
            }
            return yield this.prisma.book.create({
                data: Object.assign(Object.assign({}, book), { authorId }),
            });
        });
    }
    update(authorId, id, book) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.prisma.book.findFirst({
                where: { id, authorId },
            });
            if (!exists) {
                throw new supabase_js_1.AuthError('Book not found.', 404);
            }
            return yield this.prisma.book.update({
                where: { id, authorId },
                data: book,
            });
        });
    }
    delete(authorId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.prisma.book.findFirst({
                where: { id, authorId },
            });
            if (!exists) {
                throw new supabase_js_1.AuthError('Book not found.', 404);
            }
            return yield this.prisma.book.delete({
                where: { id, authorId },
            });
        });
    }
    publicize(authorId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.prisma.book.findFirst({
                where: { id, authorId },
            });
            if (!exists) {
                throw new supabase_js_1.AuthError('Book not found.', 404);
            }
            return yield this.prisma.book.update({
                where: { id, authorId },
                data: { public: !exists.public },
            });
        });
    }
}
exports.default = BooksService;
//# sourceMappingURL=books.js.map