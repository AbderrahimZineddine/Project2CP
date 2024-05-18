"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workerCRUD_1 = require("./workerController/workerCRUD");
const editMeWorker_1 = require("./workerController/editMeWorker");
const certificatesController_1 = require("./workerController/certificatesController");
const handlerFactory_1 = require("./handlerFactory");
const Certificate_1 = require("../models/Certificate");
const getSavedPosts_1 = require("./workerController/getSavedPosts");
const getMyRequests_1 = require("./workerController/getMyRequests");
const bestWorkers_1 = require("./workerController/bestWorkers");
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
    getAllCertificates: (0, handlerFactory_1.getAll)(Certificate_1.Certificate),
    deleteCertificateById: certificatesController_1.deleteCertificateById,
    addCertificate: certificatesController_1.addCertificate,
    checkTitle: certificatesController_1.checkTitle,
    checkOwnerCertificate: certificatesController_1.checkOwnerCertificate,
    getWorkerSavedPostsById: getSavedPosts_1.getWorkerSavedPostsById,
    getWorkerCertificatesById: certificatesController_1.getWorkerCertificatesById,
    getMyRequests: getMyRequests_1.getMyRequests,
    deleteRequestById: getMyRequests_1.deleteRequestById,
    getBestWorkers: bestWorkers_1.getBestWorkers,
};
exports.default = workerController;
//# sourceMappingURL=workerController.js.map