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
const decorators_1 = require("@/decorators");
const auth_1 = __importDefault(require("./auth"));
const books_1 = __importDefault(require("./books"));
const pages_1 = __importDefault(require("./pages"));
function routes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.decorate('checkAuth', decorators_1.checkAuth);
        yield app.register(auth_1.default, { prefix: '/auth' });
        yield app.register(books_1.default, { prefix: '/books' });
        yield app.register(pages_1.default, { prefix: '/pages' });
    });
}
exports.default = routes;
//# sourceMappingURL=index.js.map