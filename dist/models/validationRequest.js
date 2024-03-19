"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateIdPictureCreate = exports.ValidateCertificateCreate = exports.ValidationRequest = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validationRequestSchema = new mongoose_1.default.Schema({
    worker: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Worker',
        required: [
            true,
            'A certificate must reference a worker, provide worker id!',
        ],
    },
    certificate: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'Certificate',
    },
    idPicture: String,
    status: {
        type: String,
        enum: ['new', 'viewed'],
        default: 'new',
    },
    type: {
        type: String,
        enum: ['Certificate', 'idPicture'],
        required: [true, 'Please specify the type of the validation request'],
    },
}, {
    timestamps: true,
});
exports.ValidationRequest = mongoose_1.default.model('ValidationRequest', validationRequestSchema);
const ValidateCertificateCreate = async (id, certificate) => {
    return await exports.ValidationRequest.create({
        worker: id,
        certificate,
        type: 'Certificate',
    });
};
exports.ValidateCertificateCreate = ValidateCertificateCreate;
const ValidateIdPictureCreate = async (id, idPicture) => {
    return await exports.ValidationRequest.create({
        worker: id,
        idPicture,
        type: 'IdPicture',
    });
};
exports.ValidateIdPictureCreate = ValidateIdPictureCreate;
//# sourceMappingURL=validationRequest.js.map