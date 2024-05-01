"use strict";
// add a function in every function // or middleware // or method  => to modify dashboard data
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// make data created every day
// organize data in days, weeks, months, and years
const User_1 = require("../models/User");
const dashboard1model_1 = require("../controller/dashboardController/dashboard1model");
const dashboard2models_1 = require("../controller/dashboardController/dashboard2models");
const express_1 = __importDefault(require("express"));
const Application_1 = require("../models/Application");
const generalDonutChart_1 = require("../controller/dashboardController/generalDonutChart");
const router = express_1.default.Router();
router.get('/users/daily', (0, dashboard1model_1.getDailyDocs)(User_1.User));
router.get('/users/monthly', (0, dashboard1model_1.getMonthlyDocs)(User_1.User));
router.get('/users/yearly', (0, dashboard1model_1.getYearlyDocs)(User_1.User));
router.get('/applications/daily', (0, dashboard2models_1.getDailyDocs2)(Application_1.Application));
router.get('/applications/monthly', (0, dashboard2models_1.getMonthlyDocs2)(Application_1.Application));
router.get('/applications/yearly', (0, dashboard2models_1.getYearlyDocs2)(Application_1.Application));
router.get('/applications/applicationPerJobCategory', generalDonutChart_1.applicationPerJobCategory);
router.get('/applications/GeneralDonutChart', generalDonutChart_1.applicationGeneralDonutChart);
exports.default = router;
//# sourceMappingURL=dashboardRouter.js.map