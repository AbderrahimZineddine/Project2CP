import mongoose from 'mongoose';
import { UserDoc } from './UserDoc';

enum Job {
  Architect = 'Architect',
  Designer = 'Designer',
}

export interface WorkerDoc extends UserDoc {
  workerAccountVerified: boolean;
  job: Job;
  // certificates: [
  //   {
  //     title: string;
  //     image: string;
  //     isValid: boolean;
  //   }
  // ];
  certificates:  mongoose.Types.ObjectId[];
  isVerified: boolean;
  isCertified: boolean;
  idPicture: string;
  location: string;
  rating: number;
  experience: number;
  portfolioPosts: mongoose.Types.ObjectId[];
}
