"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkerSavedPostsById = void 0;
const Worker_1 = require("../../models/Worker");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Application_1 = require("../../models/Application");
const appError_1 = __importDefault(require("../../utils/appError"));
exports.getWorkerSavedPostsById = (0, catchAsync_1.default)(async (req, res, next) => {
    const worker = await Worker_1.Worker.findById(req.params.id).populate({
        path: 'savedPosts',
    });
    if (!worker) {
        return next(new appError_1.default('there no worker with id ' + req.params.id, 404));
    }
    const data = await Promise.all(worker.savedPosts.map(async (post) => {
        const applied = await Application_1.Application.findOne({
            worker: worker.id,
            post: post._id, // Assuming `savedPosts` contains objects with `_id` properties
        });
        return {
            post,
            application: {
                id: applied ? applied.id : null,
                applied: applied != null,
            },
        };
    }));
    res.status(200).json({
        status: 'success',
        results: data.length,
        data,
    });
});
//# sourceMappingURL=getSavedPosts.js.map