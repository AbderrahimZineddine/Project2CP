"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateIdPictureCreate = exports.ValidateCertificateCreate = exports.ValidationRequest = exports.ValidationType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var ValidationType;
(function (ValidationType) {
    ValidationType["Certificate"] = "Certificate";
    ValidationType["IdPicture"] = "IdPicture";
})(ValidationType || (exports.ValidationType = ValidationType = {}));
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
    // idPicture: String,
    status: {
        type: String,
        enum: ['new', 'viewed'],
        default: 'new',
    },
    type: {
        type: String,
        enum: ValidationType,
        required: [true, 'Please specify the type of the validation request'],
    },
    _deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
validationRequestSchema.pre(/^find/, function (next) {
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
validationRequestSchema.pre(/^find/, function (next) {
    console.log(this);
    // if (this.certificate) {
    //   this.populate('certificate');
    // }
    // if (this.worker) {
    //   this.populate('worker');
    // }
    this.populate({ path: 'worker' });
    this.populate({ path: 'certificate' });
    next();
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