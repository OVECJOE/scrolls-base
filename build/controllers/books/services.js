"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("@/services");
exports.default = {
    books: new services_1.BooksService(),
    chapters: new services_1.ChaptersService(),
    pages: new services_1.PagesService(),
};
//# sourceMappingURL=services.js.map