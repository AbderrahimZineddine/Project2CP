"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = require("../models/Application");
const applyPost_1 = require("./applicationController/applyPost");
const handlerFactory_1 = require("./handlerFactory");
const updateApplication_1 = require("./applicationController/updateApplication");
const getMyApplications_1 = require("./applicationController/getMyApplications");
const getMyPostsApplications_1 = require("./applicationController/getMyPostsApplications");
const checkOwnerApplication_1 = require("./applicationController/checkOwnerApplication");
const applicationController = {
    applyPost: applyPost_1.applyPost,
    ValidateApplicationInputs: applyPost_1.ValidateApplicationInputs,
    checkOwnerApplication: checkOwnerApplication_1.checkOwnerApplication,
    deleteApplication: (0, handlerFactory_1.deleteOne)(Application_1.Application),
    updateApplication: updateApplication_1.updateApplication,
    getApplicationById: (0, handlerFactory_1.getOne)(Application_1.Application),
    getMyApplications: getMyApplications_1.getMyApplications,
    getMyPostsApplications: getMyPostsApplications_1.getMyPostsApplications,
    getAllApplications: (0, handlerFactory_1.getAll)(Application_1.Application),
};
exports.default = applicationController;
//# sourceMappingURL=applicationController.js.map