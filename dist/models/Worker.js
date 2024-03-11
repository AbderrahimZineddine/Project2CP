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
        default: false,
    },
    job: {
        type: String,
        enum: ['Architect', 'Designer'],
        required: [true, 'A worker must have a job'],
    },
    certificates: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Certificate",
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
}, {
    // show virtual properties
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
workerSchema.virtual('isCertified').get(function () {
    return this.certificates?.length > 0; //TODO
});
exports.Worker = User_1.User.discriminator('Worker', workerSchema);
//# sourceMappingURL=Worker.js.map