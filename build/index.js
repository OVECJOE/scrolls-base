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
require("module-alias/register");
const dotenv_1 = __importDefault(require("dotenv"));
const fastify_1 = require("fastify");
const cors_1 = __importDefault(require("@fastify/cors"));
const routes_1 = __importDefault(require("@/routes"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
dotenv_1.default.config();
class FastifyApp {
    constructor() {
        this.server = (0, fastify_1.fastify)({
            logger: true,
        }).withTypeProvider();
        this.server.get('/', () => __awaiter(this, void 0, void 0, function* () {
            return { status: 'ok' };
        }));
        this.server.register(cors_1.default);
        this.server.register(jwt_1.default, {
            secret: process.env.JWT_SECRET,
        });
        (0, routes_1.default)(this.server);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.server.listen({
                    port: process.env.PORT,
                    host: process.env.HOST,
                });
            }
            catch (err) {
                this.server.log.error(err);
                this.close(1);
            }
        });
    }
    close() {
        return __awaiter(this, arguments, void 0, function* (code = 0) {
            yield this.server.close();
            process.exit(code);
        });
    }
}
const app = new FastifyApp();
app.start();
//# sourceMappingURL=index.js.map