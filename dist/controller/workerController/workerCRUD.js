"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorker = exports.updateWorker = exports.createWorker = exports.getWorkerById = exports.getAllWorkers = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Worker_1 = require("../../models/Worker");
const handlerFactory_1 = require("../handlerFactory");
const UserDoc_1 = require("../../models/UserDoc");
const Review_1 = require("../../models/Review");
const APIFeatures_1 = __importDefault(require("../../utils/APIFeatures"));
exports.getAllWorkers = (0, catchAsync_1.default)(async (req, res, next) => {
    // Create APIFeatures instance to filter, sort, limit fields, and paginate
    let yasser = false; // for not sorting by fav is sort incluede rating ;
    if ((req.query &&
        req.query.sort &&
        req.query.sort.split(',').includes('rating')) ||
        req.query.sort.split(',').includes('-rating')) {
        yasser = true;
    }
    const features = new APIFeatures_1.default(Worker_1.Worker.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    // Execute the query and retrieve workers
    const workers = await features.query;
    // const workers : any[] = await Worker.find().sort('rating');
    let data;
    console.log(req.user.role);
    if (req.user && req.user.currentRole === UserDoc_1.Role.User) {
        // Map workers and add isFavorite property
        console.log('hi');
        data = workers.map((worker) => ({
            ...worker.toObject(),
            isFavorite: req.user.favoriteWorkers.includes(worker.id),
        }));
        // Sort data to show favorites on top
        if (yasser) {
            data.sort((a, b) => {
                if (a.rating > b.rating) {
                    return -1; // a comes before b
                }
                else if (a.rating < b.rating) {
                    return 1; // b comes before a
                }
                else if (!a.isFavorite && b.isFavorite) {
                    return 1; // b comes before a
                }
                else if (a.isFavorite && !b.isFavorite) {
                    return -1; // a comes before b
                }
                else {
                    return 0; // maintain order
                }
            });
        }
        else {
            data.sort((a, b) => {
                if (a.isFavorite && !b.isFavorite) {
                    return -1; // a comes before b
                }
                else if (!a.isFavorite && b.isFavorite) {
                    return 1; // b comes before a
                }
                else {
                    return 0; // maintain order
                }
            });
        }
    }
    else {
        data = workers;
    }
    // Send response with sorted data
    res
        .status(200)
        .json({ status: 'success', results: workers.length, workers: data });
});
exports.getWorkerById = (0, catchAsync_1.default)(async (req, res, next) => {
    const worker = await Worker_1.Worker.findById(req.params.id);
    if (!worker) {
        return next(new appError_1.default('No worker found with that id', 404));
    }
    const { portfolioPosts, reviews } = req.query;
    let portfolioPostsData, reviewsData;
    // if (portfolioPosts) {
    //   worker.populate({ path: 'portfolioPosts'});
    // }
    if (reviews) {
        reviewsData = await Review_1.Review.find({ worker: worker.id });
    }
    if (req.user && req.user.currentRole === UserDoc_1.Role.User) {
        const isFavorite = req.user.favoriteWorkers.includes(worker.id);
        res.status(200).json({
            status: 'success',
            worker,
            isFavorite,
            portfolioPostsData,
            reviewsData,
        });
    }
    else {
        res.status(200).json({
            status: 'success',
            worker,
            portfolioPostsData,
            reviewsData,
        });
    }
});
exports.createWorker = (0, handlerFactory_1.createOne)(Worker_1.Worker);
exports.updateWorker = (0, handlerFactory_1.updateOne)(Worker_1.Worker);
exports.deleteWorker = (0, handlerFactory_1.deleteOne)(Worker_1.Worker);
//# sourceMappingURL=workerCRUD.js.map