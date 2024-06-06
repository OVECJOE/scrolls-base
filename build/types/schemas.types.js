"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchema = exports.pagePositionSchema = exports.pageIdSchema = exports.chaptersPositionSchema = exports.positionSchema = exports.pageSchema = exports.chapterSchema = exports.chapterIdSchema = exports.bookUpdateSchema = exports.bookSchema = exports.userUpdateSchema = exports.googleAuthSchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.googleAuthSchema = typebox_1.Type.Object({
    access_token: typebox_1.Type.String({ minLength: 1 }),
});
exports.userUpdateSchema = typebox_1.Type.Object({
    username: typebox_1.Type.String(),
    avatar: typebox_1.Type.String(),
});
exports.bookSchema = typebox_1.Type.Object({
    title: typebox_1.Type.String({ minLength: 1, maxLength: 255 }),
    genre: typebox_1.Type.String({ minLength: 1, maxLength: 32 }),
    type: typebox_1.Type.String({ minLength: 1 }),
    public: (0, typebox_1.Optional)(typebox_1.Type.Boolean()),
    coverPage: (0, typebox_1.Optional)(typebox_1.Type.String()),
    description: (0, typebox_1.Optional)(typebox_1.Type.String()),
    backStory: (0, typebox_1.Optional)(typebox_1.Type.String()),
});
exports.bookUpdateSchema = typebox_1.Type.Object({
    title: (0, typebox_1.Optional)(typebox_1.Type.String({ minLength: 1, maxLength: 255 })),
    genre: (0, typebox_1.Optional)(typebox_1.Type.String({ minLength: 1, maxLength: 32 })),
    type: (0, typebox_1.Optional)(typebox_1.Type.String({ minLength: 1 })),
    coverPage: (0, typebox_1.Optional)(typebox_1.Type.String()),
    description: (0, typebox_1.Optional)(typebox_1.Type.String()),
    backStory: (0, typebox_1.Optional)(typebox_1.Type.String()),
});
exports.chapterIdSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String({ minLength: 1 }),
    chapterId: typebox_1.Type.String({ minLength: 1 }),
});
exports.chapterSchema = typebox_1.Type.Object({
    title: (0, typebox_1.Optional)(typebox_1.Type.String({ minLength: 1 })),
    description: (0, typebox_1.Optional)(typebox_1.Type.String()),
});
exports.pageSchema = typebox_1.Type.Object({
    content: typebox_1.Type.String({ minLength: 1, maxLength: 3000 }),
    has_annotations: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
});
exports.positionSchema = typebox_1.Type.Object({
    position: typebox_1.Type.Number(),
});
exports.chaptersPositionSchema = typebox_1.Type.Array(typebox_1.Type.Object({
    id: typebox_1.Type.Number(),
    position: typebox_1.Type.Number(),
}));
exports.pageIdSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String({ minLength: 1 }),
    pageId: typebox_1.Type.String({ minLength: 1 }),
});
exports.pagePositionSchema = typebox_1.Type.Object({
    position: typebox_1.Type.Number(),
});
exports.idSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String({ minLength: 1 }),
});
//# sourceMappingURL=schemas.types.js.map