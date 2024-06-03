"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMap = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Post_1 = require("../../models/Post");
exports.getMap = (0, catchAsync_1.default)(async (req, res, next) => {
    try {
        // Validate input parameters
        if (!req.query.lat || !req.query.lng || !req.query.diameter) {
            return next(new appError_1.default('Missing parameters', 400));
        }
        if (isNaN(parseFloat(req.query.lat)) ||
            isNaN(parseFloat(req.query.lng)) ||
            isNaN(parseFloat(req.query.diameter))) {
            return next(new appError_1.default('Invalid parameters provided', 400));
        }
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        const diameter = parseFloat(req.query.diameter);
        // Calculate the geographical area boundaries
        const xLat = lat - diameter / 2;
        const xLng = lng - diameter / 2;
        const yLat = lat + diameter / 2;
        const yLng = lng + diameter / 2;
        let posts = [];
        if (req.query.job) {
            posts = await Post_1.Post.find({
                'location.lat': { $gte: xLat, $lte: yLat },
                'location.lng': { $gte: xLng, $lte: yLng },
                job: req.query.job,
            });
        }
        else {
            posts = await Post_1.Post.find({
                'location.lat': { $gte: xLat, $lte: yLat },
                'location.lng': { $gte: xLng, $lte: yLng },
            });
        }
        res.status(200).json({
            status: 'success',
            results: posts.length,
            posts,
        });
    }
    catch (error) {
        next(new appError_1.default(error.message, 500));
    }
});
//# sourceMappingURL=getMapPosts.js.map