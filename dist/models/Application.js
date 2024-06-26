"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ApplicationSchema = new mongoose_1.default.Schema({
    worker: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Worker',
        required: [true, 'an application must be associated with a worker'],
    },
    post: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'an application must be associated with a post'],
    },
    description: {
        type: String,
        required: [true, 'an application must have a description'],
    },
    price: {
        type: Number,
        min: [0, 'Cannot have a price less than 0'],
    },
    _deletedAt: {
        type: Date,
        default: null, //TODO : check default and add validator
    },
    _acceptedAt: {
        type: Date,
        default: null, //TODO : check default and add validator
    },
    // statusUpdatedAt : Date,
    // status: {
    //   type: String,
    //   enum: ApplicationStatus,
    // },
}, {
    timestamps: true,
});
// ApplicationSchema.pre(/^find/, function (next) {
//   // Filter out documents with _deletedAt set (including non-null values)
//   (this as any).where({ _deletedAt: null });
//   next();
// });
ApplicationSchema.pre(/^find/, function (next) {
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
ApplicationSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'worker',
        select: 'name profilePicture job isCertified', // Select specific fields from the user model
    });
    this.populate({
        path: 'post',
        select: 'title', // Select specific fields from the user model
    });
    next();
});
exports.Application = mongoose_1.default.model('Application', ApplicationSchema);
//# sourceMappingURL=Application.js.map