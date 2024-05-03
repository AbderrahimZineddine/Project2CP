"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPortfolioPost = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const PortfolioPost_1 = require("../../models/PortfolioPost");
exports.createPortfolioPost = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.images || req.images.length === 0) {
        return next(new appError_1.default('Please upload at least one image for this post', 500));
    }
    const portfolioPost = await PortfolioPost_1.PortfolioPost.create({
        images: req.images,
        description: req.body.description,
    });
    if (!portfolioPost) {
        return next(new appError_1.default('Error creating your portfolio Post', 500));
    }
    req.user.portfolioPosts.push(portfolioPost.id);
    req.user.save({ validateBeforeSave: false });
    res.status(200).json({
        status: 'success',
        portfolioPost,
    });
});
//# sourceMappingURL=createPortfolioPost.js.map