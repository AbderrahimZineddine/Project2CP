"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Deal_1 = require("../models/Deal");
const getMyDeals_1 = require("./dealController/getMyDeals");
const handlerFactory_1 = require("./handlerFactory");
const updateDeal_1 = require("./dealController/updateDeal");
const finishDeal_1 = require("./dealController/finishDeal");
const checkOwnerDeal_1 = require("./dealController/checkOwnerDeal");
const createDeal_1 = require("./dealController/createDeal");
const dealController = {
    createDeal: createDeal_1.createDeal,
    ValidateDealInputs: createDeal_1.ValidateDealInputs,
    getMyDeals: getMyDeals_1.getMyDeals,
    getDealById: getMyDeals_1.getDealById,
    updateDeal: updateDeal_1.updateDeal,
    finishDealDecline: finishDeal_1.finishDealDecline,
    finishDealAccept: finishDeal_1.finishDealAccept,
    finishDealRequest: finishDeal_1.finishDealRequest,
    deleteDealById: (0, handlerFactory_1.deleteOne)(Deal_1.Deal),
    getDealsFromUserById: getMyDeals_1.getDealsFromUserById,
    getDealsFromWorkerById: getMyDeals_1.getDealsFromWorkerById,
    getAllDeals: (0, handlerFactory_1.getAll)(Deal_1.Deal),
    showDeletedMiddleware: checkOwnerDeal_1.showDeletedMiddleware,
    checkOwnerDeal: checkOwnerDeal_1.checkOwnerDeal,
    sortMiddleware: checkOwnerDeal_1.sortMiddleware,
};
exports.default = dealController;
//# sourceMappingURL=dealController.js.map