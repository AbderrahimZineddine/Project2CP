"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workerController_1 = __importDefault(require("../controller/workerController"));
const uploadController_1 = __importDefault(require("../controller/uploadController"));
const express_1 = require("express");
const authController_1 = __importDefault(require("../controller/authController"));
const router = (0, express_1.Router)();
router.get('/me', workerController_1.default.getMyCertificate);
router.get('/:id', workerController_1.default.getCertificateById);
router.get('/', workerController_1.default.getAllCertificates);
router.use(authController_1.default.protect);
router.use(authController_1.default.restrictTo('Worker'));
router.patch('/:id/title', workerController_1.default.checkOwnerCertificate, workerController_1.default.updateCertificateTitle);
router.delete('/:id', workerController_1.default.checkOwnerCertificate, workerController_1.default.deleteCertificateById);
// workerController.checkTitle, //* doesn't' work ⬇️
router.post('/', uploadController_1.default.upload.single('certificate'), uploadController_1.default.uploadCertificate, workerController_1.default.addCertificate);
exports.default = router;
//# sourceMappingURL=certificateRouter.js.map