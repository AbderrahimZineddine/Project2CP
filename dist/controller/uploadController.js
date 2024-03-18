"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upload_1 = __importDefault(require("./uploadController/upload"));
const uploadCert_1 = __importDefault(require("./uploadController/uploadCert"));
const uploadCertificate_1 = __importDefault(require("./uploadController/uploadCertificate"));
const uploadId_1 = __importDefault(require("./uploadController/uploadId"));
const uploadPfp_1 = __importDefault(require("./uploadController/uploadPfp"));
const deleteCloudinary_1 = __importDefault(require("./uploadController/deleteCloudinary"));
const uploadImages_1 = __importDefault(require("./uploadController/uploadImages"));
const uploadController = {
    upload: upload_1.default,
    uploadId: uploadId_1.default,
    uploadProfilePicture: uploadPfp_1.default,
    uploadCertificates: uploadCertificate_1.default,
    uploadCertificate: uploadCert_1.default,
    deleteFromCloudinary: deleteCloudinary_1.default,
    uploadImages: uploadImages_1.default,
};
exports.default = uploadController;
//# sourceMappingURL=uploadController.js.map