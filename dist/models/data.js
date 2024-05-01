"use strict";
// this is for application modal the shape of data is the same on every modal just the keys of objects changes(created/accepted/declined)
// https://easyhome-lcvx.onrender.com
// ---------------------------------------------------------------------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
// route: .../application/months
//
const chartdataMonths = [
    {
        date: 'Jan 23',
        Created: 167,
        Accepted: 145,
        Declined: 135,
    },
    {
        date: 'Feb 23',
        Created: 125,
        Accepted: 110,
        Declined: 155,
    },
    {
        date: 'Mar 23',
        Created: 156,
        Accepted: 149,
        Declined: 145,
    },
    {
        date: 'Apr 23',
        Created: 165,
        Accepted: 112,
        Declined: 125,
    },
    {
        date: 'May 23',
        Created: 153,
        Accepted: 138,
        Declined: 165,
    },
    {
        date: 'Jun 23',
        Created: 124,
        Accepted: 145,
        Declined: 175,
    },
];
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// route: .../application/days
const chartdataDays = [
    {
        date: 'Jan 23',
        Created: 170,
        Accepted: 150,
        Declined: 105,
    },
    {
        date: 'jan 24',
        Created: 125,
        Accepted: 87,
        Declined: 155,
    },
    {
        date: 'jan 25',
        Created: 156,
        Accepted: 87,
        Declined: 145,
    },
    {
        date: 'jan 26',
        Created: 165,
        Accepted: 112,
        Declined: 125,
    },
    {
        date: 'jan 27',
        Created: 153,
        Accepted: 138,
        Declined: 165,
    },
    {
        date: 'jan 28',
        Created: 124,
        Accepted: 145,
        Declined: 175,
    },
];
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// route: .../application/years
const chartdataYears = [
    {
        date: '2019',
        Created: 167,
        Accepted: 145,
        Declined: 135,
    },
    {
        date: '2020',
        Created: 125,
        Accepted: 110,
        Declined: 155,
    },
    {
        date: '2021',
        Created: 156,
        Accepted: 149,
        Declined: 87,
    },
    {
        date: '2022',
        Created: 165,
        Accepted: 112,
        Declined: 125,
    },
    {
        date: '2023',
        Created: 153,
        Accepted: 138,
        Declined: 165,
    },
    {
        date: '2024',
        Created: 87,
        Accepted: 145,
        Declined: 175,
    },
];
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// route: .../application/generalDonutChart             generalDonutChart(rename it as you want )
const data5 = [
    {
        name: 'Created',
        value: 40,
    },
    {
        name: 'Accepted',
        value: 20,
    },
    {
        name: 'Declined',
        value: 20,
    },
];
// this is for the applications created accepted and declined in general (from the beginning of the application)
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// route: .../application/applicationPerJobCategory             applicationPerJobCategory(rename it as you want)
const data = [
    {
        name: 'macon',
        value: 40,
    },
    {
        name: 'architect',
        value: 40,
    },
    {
        name: 'designer',
        value: 20,
    },
];
// this is for the job categories that have applied for a work
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------
// /// i add this part
// -for the total add just one object and the route .../applications/total
// -average application per worker and the route .../applications/averageApplicationPerWorker     rename it as you want
// -//         //        //  job category        .../applications/averagePerJobCategory
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// for the (daily/mounthly/yearly)
//        -Certificates we have created/deleted/accepted(like the application)
//        **
//        -users/workers/reviews/reports/posts we have (created/deleted)
//        **
//        -deals  we have (created/finished/cancelled)
// -------------------------------------------------------------------------------------------
// for the donut chart
// in the donutChart the object should be
const data4 = [
    {
        _id: 'Architect',
        count: 2,
    },
];
//* don't change the ("_id","count")  because we did a function that takes the _id so these two words should stay the same whatever the data changes  (in every modal these two keys stay the same capichi 👍)
// 1)users
// route .../users/generalDonutChart
// route .../users/wilaya
// 2)workers
// route .../workers/jobs
// route .../workers/wilaya
// 3)certificates
// route .../certificates/generalDonutChart
// route .../certificates/workerTypes  (certificated or not)
// 4)deals
// route .../deals/generalDonutChart (created/finished/cancelled)
// 5)reviews
// route .../reviews/generalDonutChart
// route .../reviews/rating (from 1 to 5 stars)
// 6)reports
// route .../reports/generalDonutChart
// route .../reports/types (worker/user)
// 7)posts
// route .../posts/generalDonutChart
// route .../posts/jobSelected
// ------------------------------------------------------------------------------------
// for the total bayna
// for the average
// 1)users
// -avg post per user route .../users/averagePostPerUser
// -avg deal per user //
// -avg report per user //
// 2)worker
// -avg deal per worker
// -avg review per worker
// -avg certificate per worker
// 3)certificates
// avg certificate per worker
// 4)deals
// -avg deal per worker
// -avg deal per user
// 5)reviews
// -avg review per worker
// 6)reports
// -avg report per user
// -avg report per worker
// 7)posts
// -avg post per user
// -avg post per worker
//# sourceMappingURL=data.js.map