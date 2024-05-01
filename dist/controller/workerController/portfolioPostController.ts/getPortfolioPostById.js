"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortfolioPostsFromWorkerById = exports.getMyPortfolioPosts = exports.getPortfolioPostById = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../../utils/appError"));
const PortfolioPost_1 = require("../../../models/PortfolioPost");
const Like_1 = require("../../../models/Like");
const Worker_1 = require("../../../models/Worker");
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
exports.getMyPortfolioPosts = (0, catchAsync_1.default)(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const slicedPortfolioPosts = req.user.portfolioPosts.slice(skip, skip + limit);
    const data = [];
    for (const ppostId of slicedPortfolioPosts) {
        const like = await Like_1.Like.findOne({
            userId: req.user.id,
            postId: ppostId,
        });
        data.push({
            portfolioPost: await PortfolioPost_1.PortfolioPost.findById(ppostId),
            isLiked: like != null,
        });
    }
    res.status(200).json({
        status: 'success',
        results: data.length,
        data,
    });
});
exports.getPortfolioPostsFromWorkerById = (0, catchAsync_1.default)(async (req, res, next) => {
    const worker = await Worker_1.Worker.findById(req.params.id);
    if (!worker) {
        return next(new appError_1.default('No worker found with that id : ' + req.params.id, 404));
    }
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const slicedPortfolioPosts = worker.portfolioPosts.slice(skip, skip + limit);
    const data = [];
    for (const ppostId of slicedPortfolioPosts) {
        const like = await Like_1.Like.findOne({
            userId: req.user.id,
            postId: ppostId,
        });
        data.push({
            portfolioPost: await PortfolioPost_1.PortfolioPost.findById(ppostId),
            isLiked: like != null,
        });
    }
    res.status(200).json({
        status: 'success',
        results: data.length,
        data,
    });
});
//# sourceMappingURL=getPortfolioPostById.js.map