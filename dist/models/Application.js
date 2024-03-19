"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ApplicationSchema = new mongoose_1.default.Schema({
    worker: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Worker',
        required: [true, 'an application must be associated with a worker'],
    },
    post: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'an application must be associated with a post'],
    },
    description: {
        type: String,
        required: [true, 'an application must have a description'],
    },
    price: Number,
}, {
    timestamps: true,
});
exports.Application = mongoose_1.default.model('Application', ApplicationSchema);
//# sourceMappingURL=Application.js.map