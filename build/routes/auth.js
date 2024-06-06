"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("@/controllers");
const types_1 = require("@/types");
function default_1(instance, options, done) {
    instance.get('/redirect/google', controllers_1.googleOAuth.redirect);
    instance.post('/login/google', {
        schema: {
            body: types_1.googleAuthSchema,
        },
    }, controllers_1.googleOAuth.login);
    instance.post('/register/google', { schema: types_1.googleAuthSchema }, controllers_1.googleOAuth.register);
    instance.post('/logout', controllers_1.googleOAuth.logout);
    instance.get('/me', controllers_1.googleOAuth.me);
    instance.put('/me', { schema: types_1.userUpdateSchema }, controllers_1.googleOAuth.updateMe);
    instance.delete('/me', controllers_1.googleOAuth.deleteMe);
    done();
}
exports.default = default_1;
//# sourceMappingURL=auth.js.map