"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondErrorly = exports.respond = void 0;
function respond(data, message, status = 'success') {
    return { data, message, status };
}
exports.respond = respond;
function respondErrorly(e) {
    return respond(null, e.message, 'error');
}
exports.respondErrorly = respondErrorly;
//# sourceMappingURL=helpers.js.map