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
}, { timestamps: true });
ReviewSchema.pre(/^find/, function (next) {
    const query = this.getQuery();
    if (query &&
        query['$or'] &&
        query['$or'][2] &&
        query['$or'][2]._includeDeleted === true) {
        delete query['$or'][2]._includeDeleted; // Remove the flag from the query //TODO shouldn't matter if i keep this commented innit
    }
    else if (query._includeDeleted === true) {
        delete query._includeDeleted; // Remove the flag from the query //TODO shouldn't matter if i keep this commented innit
    }
    else {
        // Filter out documents with _deletedAt set (including non-null values)
        query._deletedAt = null;
    }
    next();
});
ReviewSchema.pre('save', async function (next) {
    if (this.isNew) {
        const worker = await Worker_1.Worker.findById(this.worker);
        if (!worker) {
            return next(new appError_1.default('There is no worker with id ' + this.worker, 400));
        }
        // Calculate the new average rating
        worker.rating =
            (worker.rating * worker.ratingsNumber + this.rating) /
                (worker.ratingsNumber + 1);
        worker.ratingsNumber++;
        await worker.save();
    }
    else if (this.isModified('rating')) {
        const worker = await Worker_1.Worker.findById(this.worker);
        if (!worker) {
            return next(new appError_1.default('There is no worker with id ' + this.worker, 400));
        }
        const oldDoc = await exports.Review.findById(this._id);
        if (!oldDoc) {
            return next(new Error('Document not found'));
        }
        worker.rating =
            ((worker.rating * worker.ratingsNumber) -
                oldDoc.rating +
                this.rating) /
                worker.ratingsNumber;
        // tODO : previous idk if it works
        await worker.save();
    }
    next();
});
ReviewSchema.pre("find", function (next) {
    this.populate({
        path: 'user',
        select: 'name profilePicture phoneNumber', // Select specific fields from the user model
    });
    // this.populate({
    //   path: 'worker',
    //   select: 'name profilePicture job isCertified experience', // Select specific fields from the user model
    // });
    next();
});
exports.Review = mongoose_1.default.model('Review', ReviewSchema);
//# sourceMappingURL=Review.js.map