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
exports.moveChapter = exports.reorderChapters = exports.getChapters = exports.deleteChapter = exports.updateChapter = exports.createChapter = exports.getChapter = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const helpers_1 = require("../helpers");
const services_1 = __importDefault(require("./services"));
const getChapter = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const params = request.params;
        const chapter = yield services_1.default.chapters.getOne(parseInt(params.id), parseInt(params.chapterId));
        if (!chapter) {
            throw new supabase_js_1.AuthError('Chapter not found.', 404);
        }
        return yield reply.send((0, helpers_1.respond)({ chapter }, 'Your chapter is ready for you to read.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_a = err.status) !== null && _a !== void 0 ? _a : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.getChapter = getChapter;
const createChapter = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const params = request.params;
        const { title, description } = request.body;
        const chapter = yield services_1.default.chapters.create(parseInt(params.id), title, description);
        return yield reply.send((0, helpers_1.respond)({ chapter }, 'Your chapter has been created.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_b = err.status) !== null && _b !== void 0 ? _b : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.createChapter = createChapter;
const updateChapter = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const params = request.params;
        const data = request.body;
        const chapter = yield services_1.default.chapters.update(parseInt(params.id), parseInt(params.chapterId), data);
        return yield reply.send((0, helpers_1.respond)({ chapter }, 'Your chapter has been updated.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_c = err.status) !== null && _c !== void 0 ? _c : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.updateChapter = updateChapter;
const deleteChapter = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const params = request.params;
        yield services_1.default.chapters.delete(parseInt(params.id), parseInt(params.chapterId));
        return yield reply.send((0, helpers_1.respond)({}, 'Your chapter has been deleted.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_d = err.status) !== null && _d !== void 0 ? _d : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.deleteChapter = deleteChapter;
const getChapters = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const params = request.params;
        const chapters = yield services_1.default.chapters.get(parseInt(params.id));
        return yield reply.send((0, helpers_1.respond)({ chapters }, 'Here are your chapters.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_e = err.status) !== null && _e !== void 0 ? _e : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.getChapters = getChapters;
const reorderChapters = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const params = request.params;
        const chapters = request.body;
        yield services_1.default.chapters.reorder(parseInt(params.id), chapters);
        return yield reply.send((0, helpers_1.respond)({}, 'Your chapters have been reordered.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_f = err.status) !== null && _f !== void 0 ? _f : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.reorderChapters = reorderChapters;
const moveChapter = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const params = request.params;
        const { position } = request.body;
        const chapters = yield services_1.default.chapters.move(parseInt(params.id), parseInt(params.chapterId), position);
        return yield reply.send((0, helpers_1.respond)({ chapters }, 'Your chapter has been moved.'));
    }
    catch (e) {
        const err = e;
        return yield reply.status((_g = err.status) !== null && _g !== void 0 ? _g : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.moveChapter = moveChapter;
//# sourceMappingURL=chapters.js.map