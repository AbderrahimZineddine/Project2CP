import mongoose from 'mongoose';
import { User } from './User';
import { NextFunction } from 'express';
import { WorkerDoc } from './WorkerDoc';
import { Certificate, CertificateDoc } from './Certificate';



const workerSchema = new mongoose.Schema(
  {
    
    job: {
      type: String,
      enum: [
        'Architect',
        'Mason',
        'Painter',
        'Plumber',
        'Electrician',
        'Interior Designer',
        'Landscaper',
        'Cleaner',
        'Security System Installer',
      ],
      required: [true, 'A worker must have a job'],
    },
    certificates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate',
      },
    ],
    isCertified: {
      type: Boolean,
      default: false,
    },
    idPicture: {
      type: String,
      required: [true, 'a Worker must enter his id picture'],
    },
    location: {
      title : String,
      lat : Number,
      lng : Number,
    },
    rating: {
      type: Number,
      min: [0, 'cannot be below 0'],
      max: [5, 'must be below 5'],
      default: 0,
    },
    ratingsNumber: {
      type: Number,
      default: 0,
    },
    experience: {
      type: Number,
      default: 0,
    },
    //TODO ask if reports on user and worker are the same !
    portfolioPosts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'PortfolioPost',
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    // show virtual properties
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
    timestamps: true, //TODO check again
  }
);

workerSchema.methods.checkCertifiedStatus = async function () {
  console.log(this);
  const worker: WorkerDoc = this;
  worker.isCertified = false;
  if (worker.certificates && worker.certificates.length > 0) {
    for (const certId of worker.certificates) {
      const cert: CertificateDoc = await Certificate.findById(certId);
      if (!cert) {
        worker.certificates = worker.certificates.filter(
          (certificate) => certificate != certId
        );
      } else {
        if (cert.isValid) {
          worker.isCertified = true;
        }
      }
    }
  }
  await worker.save({ validateBeforeSave: false });
};

// workerSchema.virtual('isCertified').get(function () {
//   console.log('isCertified : ', this.certificates?.length > 0);
//   return this.certificates?.length > 0; //TODO
// });

// workerSchema.pre(/^find/, function <any> (next : NextFunction) {
//   if (this.options._recursed) {
//     return next();
//   }
//   this.populate({ path: "followers following", options: { _recursed: true } });
//   next();
// });

// workerSchema.pre(/^find/, function <WorkerDoc>(next: NextFunction) {
//   console.log(
//     'worker pre****************************************************************'
//   );
//   // console.log(this);
//   // console.log('****************************************************************')

//   //TODO dont' select unvertified workers !

//   const fields = this._userProvidedFields; // Get requested fields
//   // console.log(this._userProvidedFields);
//   // if (
//   //   fields &&
//   //   !fields.includes('portfolioPosts') &&
//   //   !fields.includes('certificates')
//   // ) {
//   //   next();
//   // } else {
//   //   this.populate('portfolioPosts').populate('certificates');
//   //   next();
//   // }

//   if (fields) {
//     // if (fields.portfolioPosts) {
//     //   this.populate('portfolioPosts');
//     // }
//     if (fields.certificates) {
//       this.populate('certificates');
//     }
//   }
//   next();
// });

workerSchema.pre(/^find/, function (next) {
  const query = (this as any).getQuery();

  if (
    query &&
    query['$or'] &&
    query['$or'][2] &&
    query['$or'][2]._includeDeleted === true
  ) {
    delete query['$or'][2]._includeDeleted; // Remove the flag from the query //TODO shouldn't matter if i keep this commented innit
  } else if (query._includeDeleted === true) {
    delete query._includeDeleted; // Remove the flag from the query //TODO shouldn't matter if i keep this commented innit
  } else {
    // Filter out documents with _deletedAt set (including non-null values)
    query._deletedAt = null;
  }
  next();
});

export const Worker = User.discriminator('Worker', workerSchema);
