// add a function in every function // or middleware // or method  => to modify dashboard data

// make data created every day

// organize data in days, weeks, months, and years

import { User } from '../models/User';
import {
  getDailyDocs,
  getMonthlyDocs,
  getYearlyDocs,
} from '../controller/dashboardController/dashboard1model';
import {
  getDailyDocs2,
  getMonthlyDocs2,
  getYearlyDocs2,
} from '../controller/dashboardController/dashboard2models';
import express from 'express';
import { Application } from '../models/Application';
import {
  GeneralDonutChart1,
  applicationGeneralDonutChart,
  applicationPerJobCategory,
} from '../controller/dashboardController/generalDonutChart';
import { Worker } from '../models/Worker';
import { Review } from '../models/Review';
import { Post } from '../models/Post';
import { Deal } from '../models/Deal';
import { Certificate } from '../models/Certificate';

import {
  getDailyDocs3,
  getMonthlyDocs3,
  getYearlyDocs3,
} from '../controller/dashboardController/dashboard3models';
import {
  applicationPerJobPercentage,
  applicationTotal,
} from '../controller/dashboardController/applicationDashboard';
import {
  userTotal,
  usersPerWilaya,
} from '../controller/dashboardController/userDashboard';
import {
  workerTotal,
  workersPerJob,
  workersPerWilaya,
} from '../controller/dashboardController/workerDashboard';
import {
  reviewTotal,
  reviewsByRating,
} from '../controller/dashboardController/reviewDashboard';
import {
  postTotal,
  postsPerJob,
} from '../controller/dashboardController/postDashboard';
import {
  dealGeneralDonutChart,
  dealTotal,
} from '../controller/dashboardController/dealDashboard';
import {
  certificateGeneralDonutChart,
  certificateTotal,
} from '../controller/dashboardController/certificateDashboard';

const router = express.Router();

router.get('/users/daily', getDailyDocs(User));
router.get('/users/monthly', getMonthlyDocs(User));
router.get('/users/yearly', getYearlyDocs(User));
router.get('/users/GeneralDonutChart', GeneralDonutChart1(User)); // Total applications created , accepted , declined
router.get('/users/wilaya', usersPerWilaya);
router.get('/users/total', userTotal);

router.get('/workers/daily', getDailyDocs(Worker));
router.get('/workers/monthly', getMonthlyDocs(Worker));
router.get('/workers/yearly', getYearlyDocs(Worker));
router.get('/workers/GeneralDonutChart', GeneralDonutChart1(Worker)); // Total applications created , accepted , declined
router.get('/workers/wilaya', workersPerWilaya);
router.get('/workers/job', workersPerJob);
router.get('/workers/total', workerTotal);

router.get('/reviews/daily', getDailyDocs(Review));
router.get('/reviews/monthly', getMonthlyDocs(Review));
router.get('/reviews/yearly', getYearlyDocs(Review));
router.get('/reviews/GeneralDonutChart', GeneralDonutChart1(Review)); // Total applications created , accepted , declined
router.get('/reviews/rating', reviewsByRating); // Total applications created , accepted , declined
router.get('/reviews/total', reviewTotal);

router.get('/posts/daily', getDailyDocs(Post));
router.get('/posts/monthly', getMonthlyDocs(Post));
router.get('/posts/yearly', getYearlyDocs(Post));
router.get('/posts/GeneralDonutChart', GeneralDonutChart1(Post)); // Total applications created , accepted , declined
router.get('/posts/job', postsPerJob);
router.get('/posts/total', postTotal);

//* Application Routes :
router.get('/applications/daily', getDailyDocs2(Application)); // created , accepted , declined  in last 6 days
router.get('/applications/monthly', getMonthlyDocs2(Application)); // created , accepted , declined  in last 6 months
router.get('/applications/yearly', getYearlyDocs2(Application)); // created , accepted , declined  in last 6 years
router.get('/applications/total', applicationTotal); // Total applications created , accepted , declined
router.get('/applications/GeneralDonutChart', applicationGeneralDonutChart); // Total applications created , accepted , declined
router.get(
  '/applications/applicationPerJobCategory',
  applicationPerJobCategory
); // { name : "JOB" , value : XX }
router.get(
  '/applications/applicationPerJobPercentage',
  applicationPerJobPercentage
); // Average application per Job

//* deal Routes :
router.get('/deals/daily', getDailyDocs3(Deal)); // created , accepted , declined  in last 6 days
router.get('/deals/monthly', getMonthlyDocs3(Deal)); // created , accepted , declined  in last 6 months
router.get('/deals/yearly', getYearlyDocs3(Deal)); // created , accepted , declined  in last 6 years
router.get('/deals/GeneralDonutChart', dealGeneralDonutChart); // Total applications created , accepted , declined
router.get('/deals/total', dealTotal);

//* Application Routes :
router.get('/certificates/daily', getDailyDocs2(Certificate)); // created , accepted , declined  in last 6 days
router.get('/certificates/monthly', getMonthlyDocs2(Certificate)); // created , accepted , declined  in last 6 months
router.get('/certificates/yearly', getYearlyDocs2(Certificate)); // created , accepted , declined  in last 6 years
router.get('/certificates/GeneralDonutChart', certificateGeneralDonutChart); // Total applications created , accepted , declined
router.get('/certificates/total', certificateTotal); // Total applications created , accepted , declined

export default router;
