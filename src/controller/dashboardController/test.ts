// export const dealGeneralDonutChart = catchAsync(
//     async (req: MyRequest, res: Response) => {
//       const data = await Deal.aggregate([
//         {
//           $group: {
//             _id: null,
//             created: {
//               $sum: {
//                 $cond: [{ $lte: ['$createdAt', new Date()] }, 1, 0], // Count applications with createdAt >= current date
//               },
//             },
//             finished: {
//               $sum: {
//                 $cond: [
//                   {
//                     $and: [
//                       { $lte: ['$_finishedAt', new Date()] },
//                       { $ifNull: ['$_finishedAt', false] }, // Check if _finishedAt exists or is null
//                     ],
//                   },
//                   1,
//                   0,
//                 ],
//               },
//             },
//             canceled: {
//               $sum: {
//                 $cond: [
//                   {
//                     $and: [
//                       { $ifNull: ['$_deletedAt', false] }, // Check if _finishedAt exists or is null
//                       { $lte: ['$_deletedAt', new Date()] },
//                       { $eq: ['$_finishedAt', null] }, // Check if _finishedAt exists or is null
//                     ],
//                   },
//                   1,
//                   0,
//                 ], // Count applications with deletedAt <= current date and finishedAt = null
//               },
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0, // Exclude the _id field from the output
//             data: [
//               { _id: 'Created', count: '$created' }, // Format data for Created status
//               { _id: 'Finished', count: '$finished' }, // Format data for Finished status
//               { _id: 'Canceled', count: '$canceled' }, // Format data for Declined status
//             ],
//           },
//         },
//       ]);
  
//       res.status(200).json({
//         status: 'success',
//         data: data.length > 0 ? data[0].data : [], // Return the formatted data or an empty array if no data found
//       });
//     }
//   );