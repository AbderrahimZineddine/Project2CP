"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavoriteWorkersFromUserId = exports.getFavoriteWorkers = exports.ToggleFavoriteWorker = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Worker_1 = require("../../models/Worker");
const User_1 = require("../../models/User");
exports.ToggleFavoriteWorker = (0, catchAsync_1.default)(async (req, res, next) => {
    const worker = await Worker_1.Worker.findById(req.params.id);
    if (!worker) {
        return next(new appError_1.default('No worker found with that id', 404));
    }
    if (req.user.favoriteWorkers.includes(worker.id)) {
        req.user.favoriteWorkers = req.user.favoriteWorkers.filter((workerId) => workerId != req.params.id);
        await req.user.save({ validateBeforeSave: false });
        res.status(200).json({
            status: 'success',
            message: 'worker removed from favorites successfully',
        });
    }
    else {
        req.user.favoriteWorkers.push(worker.id);
        await req.user.save({ validateBeforeSave: false });
        res.status(200).json({
            status: 'success',
            message: 'worker saved as favorite successfully',
        });
    }
});
exports.getFavoriteWorkers = (0, catchAsync_1.default)(async (req, res, next) => {
    const workers = [];
    for (const workerId of req.user.favoriteWorkers) {
        workers.push(await Worker_1.Worker.findById(workerId));
    }
    res.status(200).json({
        status: 'success',
        workers,
    });
});
exports.getFavoriteWorkersFromUserId = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = await User_1.User.findById(req.params.id);
    if (!user) {
        return next(new appError_1.default('No user found with that id : ' + req.params.id, 404));
    }
    const workers = [];
    for (const workerId of user.favoriteWorkers) {
        workers.push(await Worker_1.Worker.findById(workerId));
    }
    res.status(200).json({
        status: 'success',
        workers,
    });
});
//# sourceMappingURL=ToggleFavoriteWorker.js.map