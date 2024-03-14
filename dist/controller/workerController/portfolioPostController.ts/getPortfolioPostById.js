"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortfolioPostById = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../../utils/appError"));
const PortfolioPost_1 = require("../../../models/PortfolioPost");
const Like_1 = require("../../../models/Like");
exports.getPortfolioPostById = (0, catchAsync_1.default)(async (req, res, next) => {
    const portfolioPost = await PortfolioPost_1.PortfolioPost.findById(req.params.id);
    if (!portfolioPost) {
        return next(new appError_1.default('No portfolio post found with that id', 404));
    }
    const like = await Like_1.Like.findOne({
        userId: req.user.id,
        postId: req.params.id,
    });
    let isLiked = false;
    if (like) {
        isLiked = true;
    }
    res.status(200).json({
        status: 'success',
        portfolioPost,
        isLiked,
    });
});
//# sourceMappingURL=getPortfolioPostById.js.map