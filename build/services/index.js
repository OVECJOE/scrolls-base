"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagesService = exports.ChaptersService = exports.BooksService = void 0;
var books_1 = require("./books");
Object.defineProperty(exports, "BooksService", { enumerable: true, get: function () { return __importDefault(books_1).default; } });
var chapters_1 = require("./chapters");
Object.defineProperty(exports, "ChaptersService", { enumerable: true, get: function () { return __importDefault(chapters_1).default; } });
var pages_1 = require("./pages");
Object.defineProperty(exports, "PagesService", { enumerable: true, get: function () { return __importDefault(pages_1).default; } });
//# sourceMappingURL=index.js.map