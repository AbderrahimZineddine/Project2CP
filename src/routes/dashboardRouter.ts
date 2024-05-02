// add a function in every function // or middleware // or method  => to modify dashboard data

// make data created every day

// organize data in days, weeks, months, and years

import { User } from '../models/User';
import {
  getDailyDocs,
  getMonthlyDocs,
  getYearlyDocs,
} from '../controller/dashboardController/dashboard1model';
import { getDailyDocs2, getMonthlyDocs2, getYearlyDocs2 } from '../controller/dashboardController/dashboard2models';
import express from 'express';
import { Application } from '../models/Application';
import { applicationGeneralDonutChart, applicationPerJobCategory } from '../controller/dashboardController/generalDonutChart';
import { applicationPerJobPercentage, averageApplicationPerJob, averageApplicationPerWorker } from '../controller/dashboardController/totalApplication';
import { Worker } from '../models/Worker';
import { Review } from '../models/Review';
import { Post } from '../models/Post';
import { Deal } from '../models/Deal';
import { getDailyDocs3, getMonthlyDocs3, getYearlyDocs3 } from '../controller/dashboardController/dashboard3models';

const router = express.Router();

router.get('/users/daily', getDailyDocs(User));
router.get('/users/monthly', getMonthlyDocs(User));
router.get('/users/yearly', getYearlyDocs(User));

router.get('/workers/daily', getDailyDocs(Worker));
router.get('/workers/monthly', getMonthlyDocs(Worker));
router.get('/workers/yearly', getYearlyDocs(Worker));

router.get('/reviews/daily', getDailyDocs(Review));
router.get('/reviews/monthly', getMonthlyDocs(Review));
router.get('/reviews/yearly', getYearlyDocs(Review));

router.get('/posts/daily', getDailyDocs(Post));
router.get('/posts/monthly', getMonthlyDocs(Post));
router.get('/posts/yearly', getYearlyDocs(Post));


//* Application Routes : 
router.get('/applications/daily', getDailyDocs2(Application));  // created , accepted , declined  in last 6 days
router.get('/applications/monthly', getMonthlyDocs2(Application)); // created , accepted , declined  in last 6 months
router.get('/applications/yearly', getYearlyDocs2(Application)); // created , accepted , declined  in last 6 years
router.get('/applications/applicationPerJobCategory',applicationPerJobCategory);  // { name : "JOB" , value : XX }
router.get('/applications/GeneralDonutChart',applicationGeneralDonutChart); // Total applications created , accepted , declined
router.get('/applications/averageApplicationPerWorker',averageApplicationPerWorker); // Average application per worker
router.get('/applications/applicationPerJobPercentage',applicationPerJobPercentage); // Average application per Job

//* deal Routes : 
router.get('/deals/daily', getDailyDocs3(Deal));  // created , accepted , declined  in last 6 days
router.get('/deals/monthly', getMonthlyDocs3(Deal)); // created , accepted , declined  in last 6 months
router.get('/deals/yearly', getYearlyDocs3(Deal)); // created , accepted , declined  in last 6 years
// router.get('/applications/applicationPerJobCategory',applicationPerJobCategory);  // { name : "JOB" , value : XX }
// router.get('/applications/GeneralDonutChart',applicationGeneralDonutChart); // Total applications created , accepted , declined
// router.get('/applications/averageApplicationPerWorker',averageApplicationPerWorker); // Average application per worker
// router.get('/applications/applicationPerJobPercentage',applicationPerJobPercentage); // Average application per Job


export default router;
