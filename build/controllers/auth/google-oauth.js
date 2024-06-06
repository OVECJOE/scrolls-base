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
const helpers_1 = require("@/controllers/helpers");
const supabase_1 = __importDefault(require("@/supabase"));
const client_1 = require("@prisma/client");
const supabase_js_1 = require("@supabase/supabase-js");
const prisma = new client_1.PrismaClient();
const redirect = (_request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { data, error } = yield supabase_1.default.auth.signInWithOAuth({
            provider: 'google',
            options: {
                skipBrowserRedirect: true,
                scopes: 'email profile openid',
            },
        });
        if (error)
            throw error;
        reply
            .status(200)
            .send((0, helpers_1.respond)({ redirectUrl: data.url }, 'Redirecting...'));
    }
    catch (e) {
        const err = e;
        reply.status((_a = err.status) !== null && _a !== void 0 ? _a : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
const register = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    try {
        const { data, error } = yield supabase_1.default.auth.getUser(request.body.access_token);
        if (error)
            throw error;
        const exists = (yield prisma.user.count({
            where: { googleId: data.user.id },
        })) > 0;
        if (exists) {
            throw new supabase_js_1.AuthError('User already exists.', 409);
        }
        const newUser = yield prisma.user.create({
            data: {
                email: data.user.email,
                googleId: data.user.id,
                username: (_b = data.user.user_metadata.name) !== null && _b !== void 0 ? _b : (_c = data.user.email) === null || _c === void 0 ? void 0 : _c.split('@')[0].replace('.', '_'),
                createdAt: data.user.created_at,
                avatar: (_d = data.user.user_metadata.picture) !== null && _d !== void 0 ? _d : data.user.user_metadata.avatar_url,
            },
        });
        reply
            .status(201)
            .send((0, helpers_1.respond)({ user: newUser }, 'Your account has been created!'));
    }
    catch (e) {
        const err = e;
        reply.status((_e = err.status) !== null && _e !== void 0 ? _e : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
const login = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const { data, error } = yield supabase_1.default.auth.getUser(request.body.access_token);
        if (error)
            throw error;
        const user = yield prisma.user.findFirst({
            where: { googleId: data.user.id },
        });
        if (!user) {
            throw new supabase_js_1.AuthError('User not found. Please register first.', 404);
        }
        reply.status(200).send((0, helpers_1.respond)({ user }, 'You are now logged in!'));
    }
    catch (e) {
        const err = e;
        reply.status((_f = err.status) !== null && _f !== void 0 ? _f : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
const logout = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    try {
        const token = (_g = request.headers.authorization) === null || _g === void 0 ? void 0 : _g.replace('Bearer ', '');
        if (!token)
            throw new supabase_js_1.AuthError('No token provided.', 400);
        const { error } = yield supabase_1.default.auth.admin.signOut(token);
        if (error)
            throw error;
        reply.status(200).send((0, helpers_1.respond)(null, 'You are now logged out!'));
    }
    catch (e) {
        const err = e;
        reply.status((_h = err.status) !== null && _h !== void 0 ? _h : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
const me = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k;
    try {
        const { data, error } = yield supabase_1.default.auth.getUser((_j = request.headers.authorization) === null || _j === void 0 ? void 0 : _j.replace('Bearer ', ''));
        if (error)
            throw error;
        const user = yield prisma.user.findFirst({
            where: { email: data.user.email },
        });
        if (!user) {
            throw new supabase_js_1.AuthError('User not found.', 404);
        }
        reply.status(200).send((0, helpers_1.respond)({ user }, 'User details.'));
    }
    catch (e) {
        const err = e;
        reply.status((_k = err.status) !== null && _k !== void 0 ? _k : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
const updateMe = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m, _o, _p;
    try {
        if (!request.body.username && !request.body.avatar) {
            throw new supabase_js_1.AuthError('You must provide either a username or an avatar.', 400);
        }
        const { data, error } = yield supabase_1.default.auth.getUser((_l = request.headers.authorization) === null || _l === void 0 ? void 0 : _l.replace('Bearer ', ''));
        if (error)
            throw error;
        const user = yield prisma.user.findFirst({
            where: { email: data.user.email },
            select: { id: true, username: true, avatar: true },
        });
        if (!user) {
            throw new supabase_js_1.AuthError('User not found.', 404);
        }
        const updatedUser = yield prisma.user.update({
            where: { id: user.id },
            data: {
                username: (_m = request.body.username) !== null && _m !== void 0 ? _m : user.username,
                avatar: (_o = request.body.avatar) !== null && _o !== void 0 ? _o : user.avatar,
            },
        });
        reply
            .status(200)
            .send((0, helpers_1.respond)({ user: updatedUser }, 'Your profile has been updated!'));
    }
    catch (e) {
        const err = e;
        reply.status((_p = err.status) !== null && _p !== void 0 ? _p : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
const deleteMe = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _q, _r;
    try {
        const { data, error } = yield supabase_1.default.auth.getUser((_q = request.headers.authorization) === null || _q === void 0 ? void 0 : _q.replace('Bearer ', ''));
        if (error)
            throw error;
        const user = yield prisma.user.findFirst({
            where: { email: data.user.email },
            select: { id: true },
        });
        if (!user) {
            throw new supabase_js_1.AuthError('User not found.', 404);
        }
        yield prisma.user.delete({ where: { id: user.id } });
        yield supabase_1.default.auth.admin.deleteUser(data.user.id);
        reply.status(200).send((0, helpers_1.respond)(null, 'Your account has been deleted!'));
    }
    catch (e) {
        const err = e;
        reply.status((_r = err.status) !== null && _r !== void 0 ? _r : 500).send((0, helpers_1.respondErrorly)(err));
    }
});
exports.default = {
    redirect,
    register,
    login,
    logout,
    me,
    updateMe,
    deleteMe,
};
//# sourceMappingURL=google-oauth.js.map