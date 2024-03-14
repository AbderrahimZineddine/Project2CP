"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LikeSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'User',
    },
    postId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'PortfolioPost',
    },
});
exports.Like = mongoose_1.default.model('Like', LikeSchema);
//# sourceMappingURL=Like.js.map