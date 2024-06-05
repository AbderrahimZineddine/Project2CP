"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMap = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Post_1 = require("../../models/Post");
// Helper function to calculate the Haversine distance between two points
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => value * Math.PI / 180;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};
exports.getMap = (0, catchAsync_1.default)(async (req, res, next) => {
    try {
        // Validate input parameters
        if (!req.query.lat || !req.query.lng || !req.query.diameter) {
            return next(new appError_1.default('Missing parameters', 400));
        }
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        let diameter = parseFloat(req.query.diameter);
        if (isNaN(lat) || isNaN(lng) || isNaN(diameter)) {
            return next(new appError_1.default('Invalid parameters provided', 400));
        }
        diameter = diameter / 1000;
        let posts = [];
        if (req.query.job) {
            posts = await Post_1.Post.find({ job: req.query.job });
        }
        else {
            posts = await Post_1.Post.find();
        }
        let i = 1;
        // Filter posts based on distance from the center point
        const postsWithinDiameter = posts.filter((post) => {
            const postLat = post.location.lat;
            const postLng = post.location.lng;
            const distance = haversineDistance(lat, lng, postLat, postLng);
            return distance <= diameter / 2;
        });
        res.status(200).json({
            status: 'success',
            results: postsWithinDiameter.length,
            posts: postsWithinDiameter,
        });
    }
    catch (error) {
        next(new appError_1.default(error.message, 500));
    }
});
//# sourceMappingURL=getMapPosts.js.map