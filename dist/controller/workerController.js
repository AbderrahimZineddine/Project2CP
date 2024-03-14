"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workerCRUD_1 = require("./workerController/workerCRUD");
const editMeWorker_1 = require("./workerController/editMeWorker");
const certificatesController_1 = require("./workerController/certificatesController");
const workerController = {
    getWorkerById: workerCRUD_1.getWorkerById,
    getAllWorkers: workerCRUD_1.getAllWorkers,
    deleteWorker: workerCRUD_1.deleteWorker,
    updateWorker: workerCRUD_1.updateWorker,
    createWorker: workerCRUD_1.createWorker,
    editMeWorker: editMeWorker_1.editMeWorker,
    updateCertificateImage: certificatesController_1.updateCertificateImage,
    updateCertificateTitle: certificatesController_1.updateCertificateTitle,
    getCertificateById: certificatesController_1.getCertificateById,
    getMyCertificate: certificatesController_1.getMyCertificates,
    deleteCertificateById: certificatesController_1.deleteCertificateById,
    addCertificate: certificatesController_1.addCertificate,
    checkTitle: certificatesController_1.checkTitle,
    checkOwnerCertificate: certificatesController_1.checkOwnerCertificate,
};
exports.default = workerController;
//# sourceMappingURL=workerController.js.map