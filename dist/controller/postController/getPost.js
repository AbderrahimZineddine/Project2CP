"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsFromUserById = exports.getMyPosts = exports.getAllPosts = exports.getPostById = void 0;
const Post_1 = require("../../models/Post");
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Application_1 = require("../../models/Application");
const UserDoc_1 = require("../../models/UserDoc");
const APIFeatures_1 = __importDefault(require("../../utils/APIFeatures"));
exports.getPostById = (0, catchAsync_1.default)(async (req, res, next) => {
    const post = await Post_1.Post.findById(req.params.id);
    if (!post) {
        return next(new appError_1.default('No post found with this id', 500));
    }
    if (req.user && req.user.currentRole === UserDoc_1.Role.Worker) {
        const applied = await Application_1.Application.findOne({
            worker: req.user.id,
            post: post._id, // Assuming `savedPosts` contains objects with `_id` properties
        });
        const isSaved = req.user.savedPosts.includes(post._id);
        res.status(200).json({
            status: 'success',
            post,
            application: {
                id: applied ? applied.id : null,
                applied: applied != null,
            },
            isSaved,
        });
    }
    else {
        res.status(200).json({
            status: 'success',
            post,
        });
    }
});
exports.getAllPosts = (0, catchAsync_1.default)(async (req, res, next) => {
    let features;
    if (req.query.user) {
        const qUser = req.query.user;
        delete req.query.user;
        features = new APIFeatures_1.default(Post_1.Post.find({ user: qUser }).populate({
            path: 'user',
            select: 'name profilePicture wilaya', // Select specific fields from the user model
        }), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
    }
    else {
        features = new APIFeatures_1.default(Post_1.Post.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
    }
    const doc = await features.query;
    if (req.user && req.user.currentRole === UserDoc_1.Role.Worker) {
        console.log('hi');
        const data = await Promise.all(doc.map(async (post) => {
            const applied = await Application_1.Application.findOne({
                worker: req.user.id,
                post: post._id, // Assuming `savedPosts` contains objects with `_id` properties
            });
            const isSaved = req.user.savedPosts.includes(post._id);
            return {
                post,
                application: {
                    id: applied ? applied.id : null,
                    applied: applied != null,
                },
                isSaved,
            };
        }));
        res.status(200).json({ status: 'success', results: data.length, data });
    }
    else {
        res
            .status(200)
            .json({ status: 'success', results: doc.length, data: doc });
    }
});
exports.getMyPosts = (0, catchAsync_1.default)(async (req, res, next) => {
    req.query.user = req.user.id;
    next();
});
exports.getPostsFromUserById = (0, catchAsync_1.default)(async (req, res, next) => {
    req.query.user = req.params.id;
    next();
});
//# sourceMappingURL=getPost.js.map