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
const Worker_1 = require("../models/Worker");
const Review_1 = require("../models/Review");
const Post_1 = require("../models/Post");
const Deal_1 = require("../models/Deal");
const Certificate_1 = require("../models/Certificate");
const dashboard3models_1 = require("../controller/dashboardController/dashboard3models");
const applicationDashboard_1 = require("../controller/dashboardController/applicationDashboard");
const userDashboard_1 = require("../controller/dashboardController/userDashboard");
const workerDashboard_1 = require("../controller/dashboardController/workerDashboard");
const reviewDashboard_1 = require("../controller/dashboardController/reviewDashboard");
const postDashboard_1 = require("../controller/dashboardController/postDashboard");
const dealDashboard_1 = require("../controller/dashboardController/dealDashboard");
const certificateDashboard_1 = require("../controller/dashboardController/certificateDashboard");
const authController_1 = __importDefault(require("../controller/authController"));
const router = express_1.default.Router();
router.use(authController_1.default.protect);
router.use(authController_1.default.restrictTo('User'));
router.get('/users/daily', (0, dashboard1model_1.getDailyDocs)(User_1.User));
router.get('/users/monthly', (0, dashboard1model_1.getMonthlyDocs)(User_1.User));
router.get('/users/yearly', (0, dashboard1model_1.getYearlyDocs)(User_1.User));
router.get('/users/GeneralDonutChart', (0, generalDonutChart_1.GeneralDonutChart1)(User_1.User)); // Total applications created , accepted , declined
router.get('/users/wilaya', userDashboard_1.usersPerWilaya);
router.get('/users/total', userDashboard_1.userTotal);
router.get('/workers/daily', (0, dashboard1model_1.getDailyDocs)(Worker_1.Worker));
router.get('/workers/monthly', (0, dashboard1model_1.getMonthlyDocs)(Worker_1.Worker));
router.get('/workers/yearly', (0, dashboard1model_1.getYearlyDocs)(Worker_1.Worker));
router.get('/workers/GeneralDonutChart', (0, generalDonutChart_1.GeneralDonutChart1)(Worker_1.Worker)); // Total applications created , accepted , declined
router.get('/workers/wilaya', workerDashboard_1.workersPerWilaya);
router.get('/workers/job', workerDashboard_1.workersPerJob);
router.get('/workers/total', workerDashboard_1.workerTotal);
router.get('/reviews/daily', (0, dashboard1model_1.getDailyDocs)(Review_1.Review));
router.get('/reviews/monthly', (0, dashboard1model_1.getMonthlyDocs)(Review_1.Review));
router.get('/reviews/yearly', (0, dashboard1model_1.getYearlyDocs)(Review_1.Review));
router.get('/reviews/GeneralDonutChart', (0, generalDonutChart_1.GeneralDonutChart1)(Review_1.Review)); // Total applications created , accepted , declined
router.get('/reviews/rating', reviewDashboard_1.reviewsByRating); // Total applications created , accepted , declined
router.get('/reviews/total', reviewDashboard_1.reviewTotal);
router.get('/posts/daily', (0, dashboard1model_1.getDailyDocs)(Post_1.Post));
router.get('/posts/monthly', (0, dashboard1model_1.getMonthlyDocs)(Post_1.Post));
router.get('/posts/yearly', (0, dashboard1model_1.getYearlyDocs)(Post_1.Post));
router.get('/posts/GeneralDonutChart', (0, generalDonutChart_1.GeneralDonutChart1)(Post_1.Post)); // Total applications created , accepted , declined
router.get('/posts/job', postDashboard_1.postsPerJob);
router.get('/posts/total', postDashboard_1.postTotal);
//* Application Routes :
router.get('/applications/daily', (0, dashboard2models_1.getDailyDocs2)(Application_1.Application)); // created , accepted , declined  in last 6 days
router.get('/applications/monthly', (0, dashboard2models_1.getMonthlyDocs2)(Application_1.Application)); // created , accepted , declined  in last 6 months
router.get('/applications/yearly', (0, dashboard2models_1.getYearlyDocs2)(Application_1.Application)); // created , accepted , declined  in last 6 years
router.get('/applications/total', applicationDashboard_1.applicationTotal); // Total applications created , accepted , declined
router.get('/applications/GeneralDonutChart', generalDonutChart_1.applicationGeneralDonutChart); // Total applications created , accepted , declined
router.get('/applications/applicationPerJobCategory', generalDonutChart_1.applicationPerJobCategory); // { name : "JOB" , value : XX }
router.get('/applications/applicationPerJobPercentage', applicationDashboard_1.applicationPerJobPercentage); // Average application per Job
//* deal Routes :
router.get('/deals/daily', (0, dashboard3models_1.getDailyDocs3)(Deal_1.Deal)); // created , accepted , declined  in last 6 days
router.get('/deals/monthly', (0, dashboard3models_1.getMonthlyDocs3)(Deal_1.Deal)); // created , accepted , declined  in last 6 months
router.get('/deals/yearly', (0, dashboard3models_1.getYearlyDocs3)(Deal_1.Deal)); // created , accepted , declined  in last 6 years
router.get('/deals/GeneralDonutChart', dealDashboard_1.dealGeneralDonutChart); // Total applications created , accepted , declined
router.get('/deals/total', dealDashboard_1.dealTotal);
//* Application Routes :
router.get('/certificates/daily', (0, dashboard2models_1.getDailyDocs2)(Certificate_1.Certificate)); // created , accepted , declined  in last 6 days
router.get('/certificates/monthly', (0, dashboard2models_1.getMonthlyDocs2)(Certificate_1.Certificate)); // created , accepted , declined  in last 6 months
router.get('/certificates/yearly', (0, dashboard2models_1.getYearlyDocs2)(Certificate_1.Certificate)); // created , accepted , declined  in last 6 years
router.get('/certificates/GeneralDonutChart', certificateDashboard_1.certificateGeneralDonutChart); // Total applications created , accepted , declined
router.get('/certificates/total', certificateDashboard_1.certificateTotal); // Total applications created , accepted , declined
exports.default = router;
//# sourceMappingURL=dashboardRouter.js.map