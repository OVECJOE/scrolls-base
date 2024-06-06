"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const books_1 = require("@/controllers/books");
const types_1 = require("@/types");
const schemas_types_1 = require("@/types/schemas.types");
function default_1(instance, options, done) {
    const authOpts = {
        preHandler: [instance.checkAuth],
    };
    instance.get('/:id', Object.assign(Object.assign({}, authOpts), { schema: {
            params: types_1.idSchema,
        } }), books_1.getPages);
    instance.get('/:id/:pageId', Object.assign(Object.assign({}, authOpts), { schema: {
            params: schemas_types_1.pageIdSchema,
        } }), books_1.getPage);
    instance.post('/:id', Object.assign(Object.assign({}, authOpts), { schema: {
            params: types_1.idSchema,
            body: schemas_types_1.pageSchema,
        } }), books_1.createPage);
    instance.put('/:id/:pageId', Object.assign(Object.assign({}, authOpts), { schema: {
            params: schemas_types_1.pageIdSchema,
            body: schemas_types_1.pageSchema,
        } }), books_1.updatePage);
    instance.delete('/:id', Object.assign(Object.assign({}, authOpts), { schema: {
            params: types_1.idSchema,
        } }), books_1.deleteAllPages);
    instance.delete('/:id/:pageId', Object.assign(Object.assign({}, authOpts), { schema: {
            params: schemas_types_1.pageIdSchema,
        } }), books_1.deletePage);
    instance.delete('/:id/other', Object.assign(Object.assign({}, authOpts), { schema: {
            params: types_1.idSchema,
        } }), books_1.deleteOtherPages);
    instance.put('/:id/:pageId/move', Object.assign(Object.assign({}, authOpts), { schema: {
            params: schemas_types_1.pageIdSchema,
            body: schemas_types_1.pagePositionSchema,
        } }), books_1.updatePagePosition);
    done();
}
exports.default = default_1;
//# sourceMappingURL=pages.js.map