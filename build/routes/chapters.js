"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const books_1 = require("@/controllers/books");
const types_1 = require("@/types");
const schemas_types_1 = require("@/types/schemas.types");
function default_1(instance, options, done) {
    const authOpts = {
        preHandler: [instance.checkAuth],
    };
    instance.get('/', authOpts, books_1.getChapters);
    instance.get('/:chapterId', authOpts, books_1.getChapter);
    instance.post('', Object.assign(Object.assign({}, authOpts), { schema: { body: types_1.chapterSchema } }), books_1.createChapter);
    instance.put('/:chapterId', Object.assign(Object.assign({}, authOpts), { schema: { body: types_1.chapterSchema } }), books_1.updateChapter);
    instance.delete('/:chapterId', authOpts, books_1.deleteChapter);
    instance.put('/:chapterId/move', Object.assign(Object.assign({}, authOpts), { schema: { body: schemas_types_1.positionSchema, params: schemas_types_1.chapterIdSchema } }), books_1.moveChapter);
    instance.put('/reorder', Object.assign(Object.assign({}, authOpts), { schema: { body: schemas_types_1.chaptersPositionSchema, params: types_1.idSchema } }), books_1.reorderChapters);
    done();
}
exports.default = default_1;
//# sourceMappingURL=chapters.js.map