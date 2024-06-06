"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const books_1 = require("@/controllers/books");
const types_1 = require("@/types");
const schemas_types_1 = require("@/types/schemas.types");
const chapters_1 = __importDefault(require("./chapters"));
function default_1(instance, options, done) {
    instance.get('/public', books_1.getPublicBooks);
    instance.get('/public/:id', { schema: { params: types_1.idSchema } }, books_1.getPublicBook);
    const authOpts = {
        preHandler: [instance.checkAuth],
    };
    instance.get('/', authOpts, books_1.getUserBooks);
    instance.get('/:id', Object.assign(Object.assign({}, authOpts), { schema: { params: types_1.idSchema } }), books_1.getBook);
    instance.post('/', Object.assign(Object.assign({}, authOpts), { schema: { body: types_1.bookSchema } }), books_1.createBook);
    instance.put('/:id', Object.assign(Object.assign({}, authOpts), { schema: { params: types_1.idSchema, body: schemas_types_1.bookUpdateSchema } }), books_1.updateBook);
    instance.put('/:id/publicize', Object.assign(Object.assign({}, authOpts), { schema: { params: types_1.idSchema } }), books_1.showOrHideBook);
    instance.delete('/:id', Object.assign(Object.assign({}, authOpts), { schema: { params: types_1.idSchema } }), books_1.deleteBook);
    instance.register(chapters_1.default, { prefix: '/:id/chapters' });
    done();
}
exports.default = default_1;
//# sourceMappingURL=books.js.map