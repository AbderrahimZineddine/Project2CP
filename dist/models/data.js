"use strict";
// this is for application modal the shape of data is the same on every modal just the keys of objects changes(created/accepted/declined)
Object.defineProperty(exports, "__esModule", { value: true });
// ---------------------------------------------------------------------------------------------------------------------------------------------------
// route: .../application/months
const chartdataMonths = [
    {
        date: "Jan 23",
        Created: 167,
        Accepted: 145,
        Declined: 135,
    },
    {
        date: "Feb 23",
        Created: 125,
        Accepted: 110,
        Declined: 155,
    },
    {
        date: "Mar 23",
        Created: 156,
        Accepted: 149,
        Declined: 145,
    },
    {
        date: "Apr 23",
        Created: 165,
        Accepted: 112,
        Declined: 125,
    },
    {
        date: "May 23",
        Created: 153,
        Accepted: 138,
        Declined: 165,
    },
    {
        date: "Jun 23",
        Created: 124,
        Accepted: 145,
        Declined: 175,
    },
];
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// route: .../application/days
const chartdataDays = [
    {
        date: "Jan 23",
        Created: 170,
        Accepted: 150,
        Declined: 105,
    },
    {
        date: "jan 24",
        Created: 125,
        Accepted: 87,
        Declined: 155,
    },
    {
        date: "jan 25",
        Created: 156,
        Accepted: 87,
        Declined: 145,
    },
    {
        date: "jan 26",
        Created: 165,
        Accepted: 112,
        Declined: 125,
    },
    {
        date: "jan 27",
        Created: 153,
        Accepted: 138,
        Declined: 165,
    },
    {
        date: "jan 28",
        Created: 124,
        Accepted: 145,
        Declined: 175,
    },
];
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// route: .../application/years
const chartdataYears = [
    {
        date: "2019",
        Created: 167,
        Accepted: 145,
        Declined: 135,
    },
    {
        date: "2020",
        Created: 125,
        Accepted: 110,
        Declined: 155,
    },
    {
        date: "2021",
        Created: 156,
        Accepted: 149,
        Declined: 87,
    },
    {
        date: "2022",
        Created: 165,
        Accepted: 112,
        Declined: 125,
    },
    {
        date: "2023",
        Created: 153,
        Accepted: 138,
        Declined: 165,
    },
    {
        date: "2024",
        Created: 87,
        Accepted: 145,
        Declined: 175,
    },
];
// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// route: .../application/generalDonutChart             generalDonutChart(rename it as you want )
const data2 = [
    {
        name: "Created",
        value: 40,
    },
    {
        name: "Accepted",
        value: 20,
    },
    {
        name: "Declined",
        value: 20,
    },
];
// this is for the applications created accepted and declined in general (from the beginning of the application)
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// route: .../application/applicationPerJobCategory             applicationPerJobCategory(rename it as you want) 
const data = [
    {
        name: "macon",
        value: 40,
    },
    {
        name: "architect",
        value: 40,
    },
    {
        name: "designer",
        value: 20,
    },
];
// this is for the job categories that have applied for a work
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------
// for the average and total we didn't use a library so it is up to you
//# sourceMappingURL=data.js.map