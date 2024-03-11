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
});
exports.Certificate = mongoose_1.default.model('Certificate', certificateSchema);
//# sourceMappingURL=Certificate.js.map