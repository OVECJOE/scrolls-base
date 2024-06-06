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
exports.deleteOtherPages = exports.deleteAllPages = exports.updatePagePosition = exports.deletePage = exports.updatePage = exports.createPage = exports.getPage = exports.getPages = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const helpers_1 = require("../helpers");
const services_1 = __importDefault(require("./services"));
const getPages = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const params = request.params;
        const pages = yield services_1.default.pages.get(parseInt(params.id));
        return yield reply.send((0, helpers_1.respond)({ pages }, 'Your pages are ready for you to read.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_a = err.status) !== null && _a !== void 0 ? _a : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.getPages = getPages;
const getPage = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const params = request.params;
        const page = yield services_1.default.pages.getOne(parseInt(params.id), parseInt(params.pageId));
        if (!page) {
            throw new supabase_js_1.AuthError('Page not found.', 404);
        }
        return yield reply.send((0, helpers_1.respond)({ page }, 'Your page is ready for you to read.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_b = err.status) !== null && _b !== void 0 ? _b : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.getPage = getPage;
const createPage = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const params = request.params;
        const { content } = request.body;
        const page = yield services_1.default.pages.create(parseInt(params.id), content);
        return yield reply.send((0, helpers_1.respond)({ page }, 'Your page has been created.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_c = err.status) !== null && _c !== void 0 ? _c : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.createPage = createPage;
const updatePage = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const params = request.params;
        const data = request.body;
        const page = yield services_1.default.pages.update(parseInt(params.id), parseInt(params.pageId), data);
        return yield reply.send((0, helpers_1.respond)({ page }, 'Your page has been updated.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_d = err.status) !== null && _d !== void 0 ? _d : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.updatePage = updatePage;
const deletePage = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const params = request.params;
        const page = yield services_1.default.pages.delete(parseInt(params.id), parseInt(params.pageId));
        return yield reply.send((0, helpers_1.respond)({ page }, 'Your page has been deleted.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_e = err.status) !== null && _e !== void 0 ? _e : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.deletePage = deletePage;
const updatePagePosition = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const params = request.params;
        const { position } = request.body;
        const page = yield services_1.default.pages.updatePosition(parseInt(params.id), parseInt(params.pageId), position);
        return yield reply.send((0, helpers_1.respond)({ page }, 'Your page has been updated.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_f = err.status) !== null && _f !== void 0 ? _f : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.updatePagePosition = updatePagePosition;
const deleteAllPages = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const params = request.params;
        yield services_1.default.pages.deleteAll(parseInt(params.id));
        return yield reply.send((0, helpers_1.respond)({}, 'All pages have been deleted.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_g = err.status) !== null && _g !== void 0 ? _g : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.deleteAllPages = deleteAllPages;
const deleteOtherPages = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    try {
        const params = request.params;
        yield services_1.default.pages.deleteAllExcept(parseInt(params.id), parseInt(params.pageId));
        return yield reply.send((0, helpers_1.respond)({}, 'Other pages have been deleted.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_h = err.status) !== null && _h !== void 0 ? _h : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.deleteOtherPages = deleteOtherPages;
//# sourceMappingURL=pages.js.map