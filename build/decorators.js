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
exports.checkAuth = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabase_1 = __importDefault(require("./supabase"));
function checkAuth(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const token = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token)
            throw new supabase_js_1.AuthError('No token provided.', 401);
        if (!request.session) {
            request.session = {};
        }
        if (!((_b = request.session) === null || _b === void 0 ? void 0 : _b.user)) {
            const { data, error } = yield supabase_1.default.auth.getUser(token);
            if (error)
                throw error;
            const user = yield supabase_1.default
                .from('users')
                .select('*')
                .eq('googleId', data.user.id)
                .single();
            if (user.error)
                throw new supabase_js_1.AuthError(user.error.message, user.status);
            request.session = { user: user.data };
        }
    });
}
exports.checkAuth = checkAuth;
//# sourceMappingURL=decorators.js.map