"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PortfolioPostSchema = new mongoose_1.default.Schema({
    images: {
        type: [String],
        required: [true, 'At least one image must be provided'],
    },
    description: String,
    likes: {
        type: Number,
        default: 0,
    },
    _deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
PortfolioPostSchema.pre(/^find/, function (next) {
    // Filter out documents with _deletedAt set (including non-null values)
    this.where({ _deletedAt: null });
    next();
});
exports.PortfolioPost = mongoose_1.default.model('PortfolioPost', PortfolioPostSchema);
//# sourceMappingURL=PortfolioPost.js.map