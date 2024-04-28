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
import { Deal } from '../models/Deal';
import { applicationPerJobCategory } from '../controller/dashboardController/generalDonutChart';

const router = express.Router();

router.get('/users/daily', getDailyDocs(User));
router.get('/users/monthly', getMonthlyDocs(User));
router.get('/users/yearly', getYearlyDocs(User));

router.get('/applications/daily', getDailyDocs2(Application, Deal));
router.get('/applications/monthly', getMonthlyDocs2(Application, Deal));
router.get('/applications/yearly', getYearlyDocs2(Application, Deal));
router.get('/applications/applicationPerJobCategory',applicationPerJobCategory);

export default router;
