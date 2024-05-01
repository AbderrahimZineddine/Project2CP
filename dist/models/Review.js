"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Worker_1 = require("./Worker");
const appError_1 = __importDefault(require("../utils/appError"));
const ReviewSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A review must be associated with an user'],
    },
    worker: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Worker',
        required: [true, 'A review must be associated with a worker'],
    },
    review: String,
    rating: {
        type: Number,
        required: [true, 'A review must have a rating'],
        min: [0, 'Rating cannot be below 0'],
        max: [5, 'Rating must be below or equal to 5'],
    },
    _deletedAt: {
        type: Date,
        default: null,
    },
});
ReviewSchema.pre(/^find/, function (next) {
    // Filter out documents with _deletedAt set (including non-null values)
    this.where({ _deletedAt: null });
    next();
});
ReviewSchema.pre('save', async function (next) {
    if (this.isNew) {
        const worker = await Worker_1.Worker.findById(this.worker);
        if (!this.worker) {
            return next(new appError_1.default('There is no worker with id ' + this.worker, 400));
        }
        worker.ratingsNumber++;
        worker.rating = (this.rating + worker.rating) / worker.ratingsNumber; //or here ++worker.ratingsNumber
        await worker.save({ validateModifiedOnly: true });
    }
    next();
    //   } else if (!this.isModified('rating')) {
    //     const worker: WorkerDoc = await Worker.findById(this.worker);
    //     if (!this.worker) {
    //       return next(
    //         new AppError('There is no worker with id ' + this.worker, 400)
    //       );
    //     }
    //     worker.rating = (this.rating + worker.rating) / worker.ratingsNumber;
    //     await worker.save();
    //   }
});
exports.Review = mongoose_1.default.model('Review', ReviewSchema);
//# sourceMappingURL=Review.js.map