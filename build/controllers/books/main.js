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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showOrHideBook = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getUserBooks = exports.getPublicBook = exports.getPublicBooks = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const helpers_1 = require("../helpers");
const services_1 = __importDefault(require("./services"));
const getPublicBooks = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const books = (yield services_1.default.books.public());
        return yield reply.send((0, helpers_1.respond)({ books }, `${books.length} books available for you to read.`));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_a = err.status) !== null && _a !== void 0 ? _a : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.getPublicBooks = getPublicBooks;
const getPublicBook = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const params = request.params;
        const book = yield services_1.default.books.public({
            id: parseInt(params.id),
        });
        if (!book) {
            throw new supabase_js_1.AuthError('Book not found.', 404);
        }
        return yield reply.send((0, helpers_1.respond)({ book }, 'Your book is ready for you to read.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_b = err.status) !== null && _b !== void 0 ? _b : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.getPublicBook = getPublicBook;
const getUserBooks = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { user } = request === null || request === void 0 ? void 0 : request.session;
        return yield reply.send((0, helpers_1.respond)({ books: user ? yield services_1.default.books.get(user.id) : [] }, 'Your books are ready for you to manage.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_c = err.status) !== null && _c !== void 0 ? _c : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.getUserBooks = getUserBooks;
const getBook = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const { user } = request.session;
        if (user) {
            const params = request.params;
            const book = yield services_1.default.books.get(user.id, {
                id: parseInt(params.id),
            });
            if (!book) {
                throw new supabase_js_1.AuthError('Book not found.', 404);
            }
            return yield reply.send((0, helpers_1.respond)({ book }, 'Your book is ready for you to manipulate.'));
        }
        throw new supabase_js_1.AuthError('User not found.', 404);
    }
    catch (e) {
        const err = e;
        return yield reply.status((_d = err.status) !== null && _d !== void 0 ? _d : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.getBook = getBook;
const createBook = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const { id } = request.session.user;
        const body = request.body;
        const book = yield services_1.default.books.create(id, {
            title: body.title,
            genre: body.genre,
            public: body.public,
            type: body.type,
            backStory: body.backStory,
            coverPage: body.coverPage,
            description: body.description,
        });
        return yield reply.send((0, helpers_1.respond)({ book }, `Your new book "${book.title}" has been created.`));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_e = err.status) !== null && _e !== void 0 ? _e : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.createBook = createBook;
const updateBook = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const params = request.params;
        const body = request.body;
        const { id } = request.session.user;
        const book = yield services_1.default.books.update(id, parseInt(params.id), body);
        return yield reply.send((0, helpers_1.respond)({ book }, `Your book "${book.title}" has been updated.`));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_f = err.status) !== null && _f !== void 0 ? _f : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.updateBook = updateBook;
const deleteBook = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const params = request.params;
        const { id } = request.session.user;
        const book = yield services_1.default.books.delete(id, parseInt(params.id));
        return yield reply.send((0, helpers_1.respond)({ book }, 'Your book has been deleted!'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_g = err.status) !== null && _g !== void 0 ? _g : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.deleteBook = deleteBook;
const showOrHideBook = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    try {
        const params = request.params;
        const { id } = request.session.user;
        const book = yield services_1.default.books.publicize(id, parseInt(params.id));
        return yield reply.send((0, helpers_1.respond)({ book }, `Your book "${book.title}" is now public.`));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_h = err.status) !== null && _h !== void 0 ? _h : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.showOrHideBook = showOrHideBook;
//# sourceMappingURL=main.js.map