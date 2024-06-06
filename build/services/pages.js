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
class PagesService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    get(chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.page.findMany({
                where: { chapterId },
                select: {
                    id: true,
                    position: true,
                    words_cnt: true,
                },
                orderBy: { position: 'asc' },
            });
        });
    }
    getOne(chapterId, pageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.page.findUnique({
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
            });
        });
    }
    create(chapterId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const pages = yield this.get(chapterId);
            const words_cnt = content.split(' ').length;
            return yield this.prisma.page.create({
                data: {
                    content,
                    position: pages.length + 1,
                    chapterId,
                    words_cnt,
                },
            });
        });
    }
    update(chapterId, pageId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const words_cnt = (_a = data.content) === null || _a === void 0 ? void 0 : _a.split(' ').length;
            return yield this.prisma.page.update({
                where: { id: pageId, chapterId },
                data: Object.assign(Object.assign({}, data), { words_cnt }),
            });
        });
    }
    delete(chapterId, pageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.page.delete({
                where: { id: pageId, chapterId },
            });
        });
    }
    updatePosition(chapterId, pageId, position) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.page.update({
                where: { id: pageId, chapterId },
                data: { position },
            });
        });
    }
    deleteAll(chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.page.deleteMany({
                where: { chapterId },
            });
        });
    }
    deleteAllExcept(chapterId, pageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.page.deleteMany({
                where: { chapterId, id: { not: pageId } },
            });
        });
    }
}
exports.default = PagesService;
//# sourceMappingURL=pages.js.map