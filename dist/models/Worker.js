"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("./User");
const workerSchema = new mongoose_1.default.Schema({
    workerAccountVerified: {
        type: Boolean,
        default: true, //TODO change later
    },
    job: {
        type: String,
        enum: [
            'Architect',
            'Mason',
            'Painter',
            'Plumber',
            'Electrician',
            'Interior Designer',
            'Landscaper',
            'Cleaner',
            'Security System Installer',
        ],
        required: [true, 'A worker must have a job'],
    },
    certificates: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Certificate',
        },
    ],
    // isCertified: Boolean,// TODO: change to Virtual
    idPicture: {
        type: String,
        required: [true, 'a Worker must enter his id picture'],
    },
    location: String,
    rating: {
        type: Number,
        min: [0, 'cannot be below 0'],
        max: [5, 'must be below 5'],
        default: 0,
    },
    ratingsNumber: {
        type: Number,
        default: 0,
    },
    experience: {
        type: Number,
        default: 0,
    },
    //TODO ask if reports on user and worker are the same !
    portfolioPosts: [
        {
            type: mongoose_1.default.Schema.ObjectId,
            ref: 'PortfolioPost',
        },
    ],
    savedPosts: [
        {
            type: mongoose_1.default.Schema.ObjectId,
            ref: 'Post',
        },
    ],
}, {
    // show virtual properties
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
workerSchema.virtual('isCertified').get(function () {
    return this.certificates?.length > 0; //TODO
});
// workerSchema.pre(/^find/, function <any> (next : NextFunction) {
//   if (this.options._recursed) {
//     return next();
//   }
//   this.populate({ path: "followers following", options: { _recursed: true } });
//   next();
// });
workerSchema.pre(/^find/, function (next) {
    console.log('****************************************************************');
    // console.log(this);
    // console.log('****************************************************************')
    //TODO dont' select unvertified workers !
    const fields = this._userProvidedFields; // Get requested fields
    // console.log(this._userProvidedFields);
    // if (
    //   fields &&
    //   !fields.includes('portfolioPosts') &&
    //   !fields.includes('certificates')
    // ) {
    //   next();
    // } else {
    //   this.populate('portfolioPosts').populate('certificates');
    //   next();
    // }
    if (fields) {
        // if (fields.portfolioPosts) {
        //   this.populate('portfolioPosts');
        // }
        if (fields.certificates) {
            this.populate('certificates');
        }
    }
    next();
});
workerSchema.pre(/^find/, function (next) {
    // Filter out documents with _deletedAt set (including non-null values)
    this.where({ _deletedAt: null });
    next();
});
exports.Worker = User_1.User.discriminator('Worker', workerSchema);
//# sourceMappingURL=Worker.js.map