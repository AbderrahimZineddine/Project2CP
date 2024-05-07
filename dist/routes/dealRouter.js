"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = __importDefault(require("../controller/authController"));
const dealController_1 = __importDefault(require("../controller/dealController"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/me', authController_1.default.protect, dealController_1.default.getMyDeals, 
// dealController.showDeletedMiddleware,
dealController_1.default.sortMiddleware, dealController_1.default.getAllDeals);
router.get('/:id', dealController_1.default.getDealById, dealController_1.default.getAllDeals);
router.use(authController_1.default.protect);
router.post('/:id', //here it is application id!!!
authController_1.default.restrictTo('User'), dealController_1.default.ValidateDealInputs, dealController_1.default.createDeal);
router.patch('/:id', dealController_1.default.checkOwnerDeal, dealController_1.default.updateDeal);
router.patch('/:id/finishRequest', authController_1.default.restrictTo('Worker'), dealController_1.default.checkOwnerDeal, dealController_1.default.finishDealRequest);
router.patch('/:id/finishDecline', dealController_1.default.checkOwnerDeal, dealController_1.default.finishDealDecline);
router.patch('/:id/finishAccept', authController_1.default.restrictTo('User'), dealController_1.default.checkOwnerDeal, dealController_1.default.finishDealAccept);
router.delete('/:id', dealController_1.default.checkOwnerDeal, dealController_1.default.deleteDealById);
router.get('/', 
// dealController.showDeletedMiddleware,
dealController_1.default.sortMiddleware, dealController_1.default.getAllDeals);
exports.default = router;
//# sourceMappingURL=dealRouter.js.map