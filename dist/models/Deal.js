"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deal = exports.DealStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var DealStatus;
(function (DealStatus) {
    DealStatus["OnGoing"] = "OnGoing";
    DealStatus["FinishRequestSent"] = "FinishRequestSent";
})(DealStatus || (exports.DealStatus = DealStatus = {}));
const DealSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'User',
        required: [true, 'an Deal must be associated with an user'],
    },
    worker: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Worker',
        required: [true, 'an Deal must be associated with a worker'],
    },
    post: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Post',
        required: [true, 'an Deal must be associated with a post'],
    },
    userTitle: String,
    userDescription: String,
    workerTitle: String,
    workerDescription: String,
    status: {
        type: String,
        enum: DealStatus,
        default: DealStatus.OnGoing,
    },
}, {
    timestamps: true,
});
exports.Deal = mongoose_1.default.model('Deal', DealSchema);
//# sourceMappingURL=Deal.js.map