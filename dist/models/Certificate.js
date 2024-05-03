"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certificate = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const certificateSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: [true, 'A certificate must have a title!'],
    },
    image: {
        type: String,
        required: [true, 'A certificate must have an image!'],
    },
    isValid: {
        type: Boolean,
        default: false,
    },
    _deletedAt: {
        type: Date,
        default: null, //TODO : check default and add validator
    },
    _acceptedAt: {
        type: Date,
        default: null, //TODO : check default and add validator
    },
}, {
    timestamps: true,
});
certificateSchema.pre(/^find/, function (next) {
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
exports.Certificate = mongoose_1.default.model('Certificate', certificateSchema);
//# sourceMappingURL=Certificate.js.map