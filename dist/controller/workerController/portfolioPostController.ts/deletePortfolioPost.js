"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePortfolioPostById = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../../utils/appError"));
const PortfolioPost_1 = require("../../../models/PortfolioPost");
const uploadController_1 = __importDefault(require("../../uploadController"));
const Like_1 = require("../../../models/Like");
exports.deletePortfolioPostById = (0, catchAsync_1.default)(async (req, res, next) => {
    const portfolioPost = await PortfolioPost_1.PortfolioPost.findById(req.params.id);
    if (!portfolioPost) {
        return next(new appError_1.default('No portfolio post found with that id', 404));
    }
    for (const url of portfolioPost.images) {
        await uploadController_1.default.deleteFromCloudinary(url);
    }
    await PortfolioPost_1.PortfolioPost.findByIdAndDelete(portfolioPost.id);
    //TODO delete likes associated with this post !  Likes.deleteMany({ post : portfolioPost.id})
    await Like_1.Like.deleteMany({ postId: portfolioPost.id });
    res.status(200).json({
        status: 'success',
    });
});
//# sourceMappingURL=deletePortfolioPost.js.map