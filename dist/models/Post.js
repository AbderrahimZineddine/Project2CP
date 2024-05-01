"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const WorkerDoc_1 = require("./WorkerDoc");
const PostSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'User',
        required: [true, 'a post must be associated with a user'],
    },
    title: {
        type: String,
        required: [true, 'A post must have a title'],
    },
    description: String,
    images: [String],
    job: {
        type: String,
        enum: WorkerDoc_1.Job,
        required: [true, 'Please specify the required job for this post.'],
    },
    price: {
        type: Number,
        min: [0, "Can't have a price less than zero"],
    },
    selectedWorkers: [
        {
            type: mongoose_1.default.Schema.ObjectId,
            ref: 'Worker',
        },
    ],
    _deletedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });
PostSchema.pre(/^find/, function (next) {
    // Filter out documents with _deletedAt set (including non-null values)
    this.where({ _deletedAt: { $exists: false } });
    next();
});
PostSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name profilePicture', // Select specific fields from the user model
    });
    next();
});
exports.Post = mongoose_1.default.model('Post', PostSchema);
//# sourceMappingURL=Post.js.map