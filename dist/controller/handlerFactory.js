"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOne = exports.updateOne = exports.createOne = exports.getOne = exports.getAll = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const APIFeatures_1 = __importDefault(require("../utils/APIFeatures"));
const getAll = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    // let filter = {};
    // if (req.params.id) {
    //   filter = { user: req.params.id };
    // }
    // const features = new APIFeatures(Model.find(filter), req.query)
    const features = new APIFeatures_1.default(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const doc = await features.query;
    res
        .status(200)
        .json({ status: 'success', results: doc.length, data: { data: doc } });
});
exports.getAll = getAll;
const getOne = (Model, populateOptions) => (0, catchAsync_1.default)(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
        query = query.populate(populateOptions);
    }
    const doc = await query;
    if (!doc) {
        return next(new appError_1.default('no Document found with that id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
});
exports.getOne = getOne;
const createOne = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { data: doc },
    });
});
exports.createOne = createOne;
const updateOne = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // new updated document will be returned
        runValidators: true,
    });
    if (!doc) {
        return next(new appError_1.default('no Document found with that id', 404));
    }
    res.status(200).json({ status: 'success', data: { data: doc } });
});
exports.updateOne = updateOne;
const deleteOne = (Model) => (0, catchAsync_1.default)(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new appError_1.default('no Document found with that ID', 404));
    }
    res.status(204).json({ status: 'success' }); //* 204
});
exports.deleteOne = deleteOne;
//# sourceMappingURL=handlerFactory.js.map